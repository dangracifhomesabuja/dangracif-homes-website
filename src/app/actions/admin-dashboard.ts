"use server";

import "reflect-metadata";
import { revalidatePath } from "next/cache";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { LeadInquiry, InquiryType, InquiryStatus } from "@/lib/db/entities/LeadInquiry";
import { PropertyUnit } from "@/lib/db/entities/PropertyUnit";
import { getAdminSession } from "@/lib/auth";
import { ILike } from "typeorm";

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized. Please log in.");
  }
  return session;
}

const DEFAULT_PROPERTY_UNITS: PropertyUnit[] = [
  {
    id: "1-bed",
    title: "1-Bedroom Apartment",
    unitsCount: 32,
    availableUnits: 32,
    description: "Compact, efficient city living with premium finishes.",
    price: "₦55,500,000",
    numericPrice: 55500000,
    imageSrc: "/images/apartment-1bed.jpg",
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2-bed",
    title: "2-Bedroom Apartment",
    unitsCount: 48,
    availableUnits: 48,
    description: "Ideal for young families & professionals. Spacious living.",
    price: "₦82,500,000",
    numericPrice: 82500000,
    imageSrc: "/images/apartment-2bed.jpg",
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4-bed-terrace",
    title: "4-Bedroom Terrace (Shell)",
    unitsCount: 8,
    availableUnits: 8,
    description: "Shell option — finish to your bespoke taste & architectural flair.",
    price: "₦127,500,000",
    numericPrice: 127500000,
    imageSrc: "/images/terrace-duplex.jpg",
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getDashboardStats() {
  await requireAuth();
  try {
    const ds = await getDatabaseConnection();
    const leadRepo = ds.getRepository<LeadInquiry>("lead_inquiries");
    const unitRepo = ds.getRepository<PropertyUnit>("property_units");

    const [totalLeads, newLeads, scheduledInspections, closedLeads] = await Promise.all([
      leadRepo.count(),
      leadRepo.count({ where: { status: "new" } }),
      leadRepo.count({ where: { status: "scheduled" } }),
      leadRepo.count({ where: { status: "closed" } }),
    ]);

    const [inspections, reservations, buyRequests, openHouse, contacts] = await Promise.all([
      leadRepo.count({ where: { type: "inspection" } }),
      leadRepo.count({ where: { type: "reserve" } }),
      leadRepo.count({ where: { type: "buy" } }),
      leadRepo.count({ where: { type: "open-house" } }),
      leadRepo.count({ where: { type: "contact" } }),
    ]);

    let units = await unitRepo.find();
    if (!units || units.length === 0) {
      units = DEFAULT_PROPERTY_UNITS;
    }
    const totalUnits = units.reduce((acc, u) => acc + (u.unitsCount || 0), 0);
    const availableUnits = units.reduce((acc, u) => acc + (u.availableUnits || 0), 0);
    const soldUnits = Math.max(0, totalUnits - availableUnits);

    // Calculate estimated pipeline value based on buy & reservation leads
    const highIntentLeads = await leadRepo.find({
      where: [{ type: "buy" }, { type: "reserve" }],
    });

    const unitPriceMap: Record<string, number> = {};
    units.forEach((u) => {
      unitPriceMap[u.id] = Number(u.numericPrice) || 0;
    });

    let estimatedPipeline = 0;
    highIntentLeads.forEach((lead) => {
      if (lead.status !== "archived") {
        const unitCost = lead.unitType ? unitPriceMap[lead.unitType] || 82500000 : 82500000;
        estimatedPipeline += unitCost * (lead.numberOfUnits || 1);
      }
    });

    const recentLeads = await leadRepo.find({
      order: { createdAt: "DESC" },
      take: 6,
    });

    return toPlain({
      overview: {
        totalLeads,
        newLeads,
        scheduledInspections,
        closedLeads,
        totalUnits,
        availableUnits,
        soldUnits,
        estimatedPipeline,
      },
      byType: {
        inspections,
        reservations,
        buyRequests,
        openHouse,
        contacts,
      },
      recentLeads,
      units,
    });
  } catch (err) {
    console.warn("Could not fetch DB dashboard stats:", err);
    const units = DEFAULT_PROPERTY_UNITS;
    const totalUnits = units.reduce((acc, u) => acc + (u.unitsCount || 0), 0);
    const availableUnits = units.reduce((acc, u) => acc + (u.availableUnits || 0), 0);
    return toPlain({
      overview: {
        totalLeads: 0,
        newLeads: 0,
        scheduledInspections: 0,
        closedLeads: 0,
        totalUnits,
        availableUnits,
        soldUnits: totalUnits - availableUnits,
        estimatedPipeline: 0,
      },
      byType: {
        inspections: 0,
        reservations: 0,
        buyRequests: 0,
        openHouse: 0,
        contacts: 0,
      },
      recentLeads: [],
      units,
    });
  }
}

export async function getLeadsList(params?: {
  type?: string;
  status?: string;
  search?: string;
}): Promise<LeadInquiry[]> {
  await requireAuth();
  try {
    const ds = await getDatabaseConnection();
    const leadRepo = ds.getRepository<LeadInquiry>("lead_inquiries");

    const whereClause: Record<string, unknown> = {};

    if (params?.type && params.type !== "all") {
      whereClause.type = params.type;
    }
    if (params?.status && params.status !== "all") {
      whereClause.status = params.status;
    }

    let leads: LeadInquiry[];
    if (params?.search && params.search.trim() !== "") {
      const q = `%${params.search.trim()}%`;
      leads = await leadRepo.find({
        where: [
          { ...whereClause, fullName: ILike(q) },
          { ...whereClause, email: ILike(q) },
          { ...whereClause, phone: ILike(q) },
        ],
        order: { createdAt: "DESC" },
      });
    } else {
      leads = await leadRepo.find({
        where: whereClause,
        order: { createdAt: "DESC" },
      });
    }

    return toPlain(leads);
  } catch (err) {
    console.warn("Could not fetch DB leads:", err);
    return [];
  }
}

export async function updateLeadStatusAction(id: string, status: InquiryStatus) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const leadRepo = ds.getRepository<LeadInquiry>("lead_inquiries");

  await leadRepo.update(id, { status });
  revalidatePath("/admin");
  return { success: true };
}

export async function updateLeadNotesAction(id: string, notes: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const leadRepo = ds.getRepository<LeadInquiry>("lead_inquiries");

  await leadRepo.update(id, { notes });
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteLeadAction(id: string) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const leadRepo = ds.getRepository<LeadInquiry>("lead_inquiries");

  await leadRepo.delete(id);
  revalidatePath("/admin");
  return { success: true };
}

export async function getPropertyUnitsList() {
  try {
    const ds = await getDatabaseConnection();
    const unitRepo = ds.getRepository<PropertyUnit>("property_units");
    const units = await unitRepo.find({ order: { id: "ASC" } });
    if (!units || units.length === 0) {
      return toPlain(DEFAULT_PROPERTY_UNITS);
    }
    return toPlain(units);
  } catch (err) {
    console.warn("Could not fetch DB property units, returning fallback units:", err);
    return toPlain(DEFAULT_PROPERTY_UNITS);
  }
}

export async function updatePropertyUnitAction(
  id: string,
  data: Partial<
    Pick<
      PropertyUnit,
      "price" | "availableUnits" | "unitsCount" | "status" | "description"
    >
  >
) {
  await requireAuth();
  const ds = await getDatabaseConnection();
  const unitRepo = ds.getRepository<PropertyUnit>("property_units");

  const existing = await unitRepo.findOne({ where: { id } });
  const fallback = DEFAULT_PROPERTY_UNITS.find((unit) => unit.id === id);
  if (!existing && !fallback) {
    throw new Error("This estate unit was not found. Refresh the inventory and try again.");
  }

  const unit = existing
    ? existing
    : fallback
      ? unitRepo.create(fallback)
      : null;
  if (!unit) {
    throw new Error("This estate unit was not found. Refresh the inventory and try again.");
  }
  const updated = { ...unit, ...data };
  if (
    !Number.isInteger(updated.unitsCount) ||
    updated.unitsCount < 0 ||
    !Number.isInteger(updated.availableUnits) ||
    updated.availableUnits < 0 ||
    updated.availableUnits > updated.unitsCount
  ) {
    throw new Error(
      "Available units must be a whole number between zero and the total units."
    );
  }
  if (typeof updated.price !== "string" || updated.price.length > 100) {
    throw new Error("Enter a valid listing price.");
  }
  if (typeof updated.description !== "string") {
    throw new Error("Enter a valid unit description.");
  }
  if (!["available", "limited", "sold_out"].includes(updated.status)) {
    throw new Error("Choose a valid inventory status.");
  }

  const saved = await unitRepo.save(updated);
  revalidatePath("/admin");
  revalidatePath("/admin/units");
  revalidatePath("/fideliscourt");
  revalidatePath("/fidelis-court");
  revalidatePath("/pricing");
  return {
    success: true,
    unit: {
      id: saved.id,
      price: saved.price,
      availableUnits: saved.availableUnits,
      unitsCount: saved.unitsCount,
      status: saved.status,
      description: saved.description,
    },
  };
}

// Public API for submitting inquiries directly to PostgreSQL
export async function submitLeadInquiry(data: {
  type: InquiryType;
  fullName: string;
  phone: string;
  email: string;
  unitType?: string;
  numberOfUnits?: number;
  paymentOption?: string;
  preferredDate?: string;
  attendees?: number;
  message?: string;
}) {
  try {
    const ds = await getDatabaseConnection();
    const leadRepo = ds.getRepository<LeadInquiry>("lead_inquiries");

    const newLead = leadRepo.create({
      type: data.type || "contact",
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      unitType: data.unitType || null,
      numberOfUnits: data.numberOfUnits || 1,
      paymentOption: data.paymentOption || null,
      preferredDate: data.preferredDate || null,
      attendees: data.attendees || 1,
      message: data.message || null,
      status: "new",
    });

    const saved = await leadRepo.save(newLead);
    return { success: true, leadId: saved.id };
  } catch (err: unknown) {
    console.error("Failed to store lead inquiry:", err);
    return { success: false, error: "Database error saving inquiry" };
  }
}

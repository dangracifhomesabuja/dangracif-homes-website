import "reflect-metadata";
import bcrypt from "bcrypt";
import { getDatabaseConnection } from "./data-source";
import { User } from "./entities/User";
import { PropertyUnit } from "./entities/PropertyUnit";
import { LeadInquiry } from "./entities/LeadInquiry";

export async function runSeed() {
  console.log("🌱 Starting database seeding...");
  const dataSource = await getDatabaseConnection();

  // 1. Seed Admin User
  const userRepo = dataSource.getRepository<User>("User");
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@dangracifhomes.com";
  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || "AdminPassword2026!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const admin = userRepo.create({
      email: adminEmail,
      password: hashedPassword,
      name: "Dangracif Administrator",
      role: "admin",
      isActive: true,
    });
    await userRepo.save(admin);
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${adminEmail}`);
  }

  // 2. Seed Property Units
  const unitRepo = dataSource.getRepository<PropertyUnit>("PropertyUnit");
  const defaultUnits = [
    {
      id: "1-bed",
      title: "1-Bedroom Apartment",
      unitsCount: 32,
      availableUnits: 24,
      description: "Compact, efficient city living with premium finishes.",
      price: "₦55,500,000",
      numericPrice: 55500000,
      imageSrc: "/fidelis-court/Bright Renovation Room with Window Views.png",
      status: "available",
    },
    {
      id: "2-bed",
      title: "2-Bedroom Apartment",
      unitsCount: 48,
      availableUnits: 31,
      description: "Ideal for young families & professionals. Spacious living.",
      price: "₦82,500,000",
      numericPrice: 82500000,
      imageSrc: "/fidelis-court/Sunlit Unfinished Room Renovation.png",
      status: "available",
    },
    {
      id: "4-bed-terrace",
      title: "4-Bedroom Terrace (Shell)",
      unitsCount: 8,
      availableUnits: 4,
      description: "Shell option — finish to your bespoke taste & architectural flair.",
      price: "₦127,500,000",
      numericPrice: 127500000,
      imageSrc: "/fidelis-court/Vibrant Mid-Rise Construction Site.png",
      status: "limited",
    },
  ];

  for (const u of defaultUnits) {
    const existing = await unitRepo.findOne({ where: { id: u.id } });
    if (!existing) {
      const unit = unitRepo.create(u);
      await unitRepo.save(unit);
      console.log(`✅ Unit seeded: ${u.title}`);
    } else {
      console.log(`ℹ️ Unit already exists: ${u.title}`);
    }
  }

  // 3. Seed Sample Leads (if none exist)
  const leadRepo = dataSource.getRepository<LeadInquiry>("LeadInquiry");
  const leadsCount = await leadRepo.count();

  if (leadsCount === 0) {
    const sampleLeads = [
      {
        type: "buy" as const,
        fullName: "Dr. Oladipo Adeleke",
        phone: "+234 803 555 0192",
        email: "oladipo.adeleke@example.com",
        unitType: "2-bed",
        numberOfUnits: 1,
        paymentOption: "Outright payment",
        status: "new" as const,
        message: "Interested in outright purchase for unit on 2nd floor.",
        notes: "Called client. Preparing invoice for review.",
      },
      {
        type: "inspection" as const,
        fullName: "Mrs. Chioma Eze",
        phone: "+234 812 444 8821",
        email: "chioma.eze@example.com",
        unitType: "4-bed-terrace",
        numberOfUnits: 1,
        preferredDate: "2026-10-25",
        status: "scheduled" as const,
        message: "Requesting Saturday afternoon site walkthrough with family.",
        notes: "Confirmed for Saturday 2:00 PM with estate guide.",
      },
      {
        type: "reserve" as const,
        fullName: "Alhaji Ibrahim Musa",
        phone: "+234 705 999 3321",
        email: "ibrahim.m@example.com",
        unitType: "1-bed",
        numberOfUnits: 2,
        paymentOption: "12-month installment",
        status: "contacted" as const,
        message: "Looking to reserve 2 units as investment rentals.",
        notes: "Sent payment milestone breakdown.",
      },
      {
        type: "open-house" as const,
        fullName: "Barrister Anthony Udoh",
        phone: "+234 809 111 7765",
        email: "anthony.udoh@example.com",
        unitType: "2-bed",
        attendees: 3,
        status: "new" as const,
        message: "Attending open house next Saturday with partners.",
      },
    ];

    for (const lead of sampleLeads) {
      const entity = leadRepo.create(lead);
      await leadRepo.save(entity);
    }
    console.log(`✅ Sample lead inquiries seeded (${sampleLeads.length})`);
  } else {
    console.log(`ℹ️ Lead inquiries already exist (${leadsCount})`);
  }

  console.log("✨ Seeding completed successfully!");
}

// Allow direct CLI execution
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed error:", err);
      process.exit(1);
    });
}

export interface CareerOpening {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  location: string;
}

export const DEFAULT_CAREER_OPENINGS: CareerOpening[] = [
  {
    id: "social-media-officer",
    title: "Social Media Officer",
    description:
      "Help grow Dangracif Homes’ digital presence by planning and creating engaging social content, managing our social channels, and supporting campaigns that showcase our developments.\n\nQualifications / experience\nExperience managing social media accounts or creating digital content.\n\nResponsibilities\n• Plan and publish engaging content across the company’s social media channels.\n• Create and coordinate photo, video, and written content that showcases our projects.\n• Monitor audience engagement and report on content performance.\n• Respond to comments and messages in a professional and timely manner.\n\nRequirements\n• Strong writing, communication, and creative skills.\n• Familiarity with major social media platforms and content tools.\n• A portfolio or examples of previous social media work is an advantage.",
    employmentType: "Full-time",
    location: "Abuja, Nigeria",
  },
  {
    id: "sales-officer",
    title: "Sales Officer",
    description:
      "Build relationships with prospective buyers, guide them through our homes and payment plans, and support customers from their first inquiry through the sales process.\n\nQualifications / experience\nExperience in sales or customer-facing roles; real estate experience is an advantage.\n\nResponsibilities\n• Respond to prospective buyers and understand their housing needs.\n• Present available properties, pricing, and payment plans accurately.\n• Coordinate property visits and follow up with interested customers.\n• Maintain clear records of leads, customer interactions, and sales progress.\n\nRequirements\n• Strong interpersonal, presentation, and negotiation skills.\n• Customer-focused, organized, and motivated to meet sales targets.\n• Ability to communicate professionally in person, by phone, and online.",
    employmentType: "Full-time",
    location: "Abuja, Nigeria",
  },
];

export function normalizeCareerOpenings(
  value: unknown
): CareerOpening[] | null {
  if (!Array.isArray(value)) return null;

  const openings: CareerOpening[] = [];
  for (const opening of value) {
    if (!opening || typeof opening !== "object") return null;
    const item = opening as Record<string, unknown>;
    if (
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.description !== "string" ||
      (item.employmentType !== undefined &&
        typeof item.employmentType !== "string") ||
      (item.location !== undefined && typeof item.location !== "string") ||
      (item.qualifications !== undefined &&
        typeof item.qualifications !== "string") ||
      (item.responsibilities !== undefined &&
        (!Array.isArray(item.responsibilities) ||
          !item.responsibilities.every((line) => typeof line === "string"))) ||
      (item.requirements !== undefined &&
        (!Array.isArray(item.requirements) ||
          !item.requirements.every((line) => typeof line === "string")))
    ) {
      return null;
    }

    const descriptionParts = [item.description.trim()];
    if (typeof item.qualifications === "string" && item.qualifications.trim()) {
      descriptionParts.push(
        `Qualifications / experience\n${item.qualifications.trim()}`
      );
    }
    if (Array.isArray(item.responsibilities) && item.responsibilities.length) {
      descriptionParts.push(
        `Responsibilities\n${item.responsibilities
          .map((line) => `• ${line.trim()}`)
          .join("\n")}`
      );
    }
    if (Array.isArray(item.requirements) && item.requirements.length) {
      descriptionParts.push(
        `Requirements\n${item.requirements
          .map((line) => `• ${line.trim()}`)
          .join("\n")}`
      );
    }

    const normalized = {
      id: item.id.trim(),
      title: item.title.trim(),
      description: descriptionParts.join("\n\n"),
      employmentType:
        typeof item.employmentType === "string"
          ? item.employmentType.trim()
          : "Full-time",
      location:
        typeof item.location === "string" ? item.location.trim() : "Abuja, Nigeria",
    };
    if (!normalized.id || !normalized.title || !normalized.description) {
      return null;
    }
    openings.push(normalized);
  }

  if (new Set(openings.map((opening) => opening.id)).size !== openings.length) {
    return null;
  }

  return openings;
}

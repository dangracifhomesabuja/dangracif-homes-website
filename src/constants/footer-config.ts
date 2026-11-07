export type FooterSocialLink = {
  label: string;
  href: string;
  platform: "instagram" | "youtube" | "facebook" | "website";
};

export type FooterConfig = {
  companyName: string;
  registrationNumber: string;
  officeName: string;
  officeAddress: string;
  email: string;
  officePhones: string[];
  projectName: string;
  projectAddress: string;
  marketingPhones: string[];
  socialLinks: FooterSocialLink[];
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  companyName: "Dangracif Homes",
  registrationNumber: "RC-1896142",
  officeName: "Dangracif Homes Limited",
  officeAddress:
    "Suite B5, Bricks ‘N’ More Plaza, 6th Avenue, Gwarimpa, Abuja, FCT, Nigeria",
  email: "info@dangracif.com",
  officePhones: ["+234 706 624 9077", "+234 805 947 4405"],
  projectName: "Fidelis Court",
  projectAddress:
    "21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria",
  marketingPhones: [
    "+234 813 318 7860",
    "+234 813 891 1937",
    "+234 707 132 2002",
  ],
  socialLinks: [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/dangracifhomes?rpxt=dWxueWs1MXYzcnUy&utm_source=qr",
    },
    {
      platform: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@dangracifhomesabuja?si=WeanGoaxK_SB5EAg",
    },
    {
      platform: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61595924164485",
    },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  value: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  const field = value[key];
  return typeof field === "string" ? field : fallback;
}

function readStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [...fallback];
}

function readSocialLinks(value: unknown): FooterSocialLink[] {
  if (!Array.isArray(value)) {
    return DEFAULT_FOOTER_CONFIG.socialLinks.map((link) => ({ ...link }));
  }

  const platforms = ["instagram", "youtube", "facebook", "website"] as const;
  return value.flatMap((item) =>
    isRecord(item) &&
    platforms.includes(item.platform as (typeof platforms)[number]) &&
    typeof item.label === "string" &&
    typeof item.href === "string"
      ? [
          {
            platform: item.platform as FooterSocialLink["platform"],
            label: item.label,
            href: item.href,
          },
        ]
      : []
  );
}

export function normalizeFooterConfig(value: unknown): FooterConfig {
  if (!isRecord(value)) {
    return {
      ...DEFAULT_FOOTER_CONFIG,
      officePhones: [...DEFAULT_FOOTER_CONFIG.officePhones],
      marketingPhones: [...DEFAULT_FOOTER_CONFIG.marketingPhones],
      socialLinks: DEFAULT_FOOTER_CONFIG.socialLinks.map((link) => ({
        ...link,
      })),
    };
  }

  return {
    companyName: readString(value, "companyName", DEFAULT_FOOTER_CONFIG.companyName),
    registrationNumber: readString(
      value,
      "registrationNumber",
      DEFAULT_FOOTER_CONFIG.registrationNumber
    ),
    officeName: readString(value, "officeName", DEFAULT_FOOTER_CONFIG.officeName),
    officeAddress: readString(
      value,
      "officeAddress",
      DEFAULT_FOOTER_CONFIG.officeAddress
    ),
    email: readString(value, "email", DEFAULT_FOOTER_CONFIG.email),
    officePhones: readStringArray(
      value.officePhones,
      DEFAULT_FOOTER_CONFIG.officePhones
    ),
    projectName: readString(value, "projectName", DEFAULT_FOOTER_CONFIG.projectName),
    projectAddress: readString(
      value,
      "projectAddress",
      DEFAULT_FOOTER_CONFIG.projectAddress
    ),
    marketingPhones: readStringArray(
      value.marketingPhones,
      DEFAULT_FOOTER_CONFIG.marketingPhones
    ),
    socialLinks: readSocialLinks(value.socialLinks),
  };
}

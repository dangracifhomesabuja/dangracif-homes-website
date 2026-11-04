export interface OtherProject {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  imageUrl: string;
}

export const DEFAULT_OTHER_PROJECTS: OtherProject[] = [
  {
    id: "dangracif-mall",
    title: "Commercial Development — Dangracif Mall, Kubwa, Abuja, FCT",
    description: `Dangracif Mall is a commercial property development by Dangracif Homes Limited, strategically located in Kubwa, Abuja, Federal Capital Territory. The development is conceived as a modern commercial destination designed to provide functional, accessible and well-organised business spaces for retailers, entrepreneurs, corporate organisations, professional service providers and other commercial enterprises.

The project reflects Dangracif Homes Limited’s commitment to developing properties that respond to the evolving residential and commercial needs of growing communities. By providing dedicated spaces for commercial activities, Dangracif Mall is intended to contribute to the expansion of business opportunities, improve access to goods and services, and support the economic vitality of Kubwa and its surrounding neighbourhoods.

Designed with emphasis on functionality, accessibility, convenience and commercial value, the Mall aims to provide an environment where businesses can establish, operate and grow. Its commercial spaces are intended to accommodate a range of business activities, including retail outlets, supermarkets, boutiques, restaurants, food and beverage businesses, pharmacies, financial and professional services, technology-related businesses, showrooms and other customer-oriented enterprises, subject to the approved use and configuration of the available spaces.

The development offers prospective business owners and investors an opportunity to position their enterprises within an established and expanding urban community. Its location in Kubwa provides access to a broad market of residents, households, professionals, traders and other consumers within the district and neighbouring areas. This creates opportunities for businesses seeking greater market visibility, customer accessibility and a suitable base for their commercial operations.

Beyond providing commercial premises, Dangracif Mall is envisioned as a business environment that encourages enterprise, convenience and commercial interaction. It is intended to bring different categories of businesses together within an organised development, making it easier for customers to access a variety of products and services in one location.

For retailers, entrepreneurs, investors and established organisations seeking commercial space in Kubwa, Dangracif Mall represents an opportunity to participate in the area's growing economic activities while establishing a presence within a purpose-designed commercial development.

Dangracif Mall; Creating Space for Business, Enterprise and Commercial Growth.`,
    location: "Kubwa, Abuja",
    status: "Commercial Development",
    imageUrl: "",
  },
  {
    id: "dangracif-nest",
    title: "Residential Development — Dangracif Nest, Jabi, Abuja, FCT",
    description: `Dangracif Nest is an established residential estate developed by Dangracif Homes Limited, located in Jabi, Abuja, Federal Capital Territory. The estate provides a residential environment for homeowners and families, with residents currently living within the development.

Situated in one of Abuja's recognised urban districts, Dangracif Nest offers residents the convenience of living within an established part of the Federal Capital Territory, with access to the wider city's commercial, business, educational, healthcare and recreational facilities.

The estate reflects Dangracif Homes Limited's commitment to providing quality residential accommodation and developing communities that respond to the housing needs of individuals and families. Its established residential character makes it more than a property development; it is a living community where residents enjoy the benefits of an organised estate environment.

Dangracif Nest also represents the company's contribution to residential property development and investment in Abuja. As an existing and occupied estate, it demonstrates Dangracif Homes Limited's involvement in providing residential spaces that serve practical housing needs while contributing to the growth of the city's built environment.

Dangracif Nest; A Place to Belong, A Community to Call Home.`,
    location: "Jabi, Abuja",
    status: "Residential Development",
    imageUrl: "",
  },
];

export function normalizeOtherProjects(value: unknown): OtherProject[] | null {
  if (!Array.isArray(value)) return null;

  const projects: OtherProject[] = [];
  for (const project of value) {
    if (!project || typeof project !== "object") return null;
    const item = project as Record<string, unknown>;
    if (
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.description !== "string" ||
      typeof item.location !== "string" ||
      typeof item.status !== "string" ||
      (item.imageUrl !== undefined && typeof item.imageUrl !== "string")
    ) {
      return null;
    }

    const normalized = {
      id: item.id.trim(),
      title: item.title.trim(),
      description: item.description.trim(),
      location: item.location.trim(),
      status: item.status.trim(),
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl.trim() : "",
    };
    const isLocalImagePath =
      normalized.imageUrl.startsWith("/") && !normalized.imageUrl.startsWith("//");
    let isCloudinaryImageUrl = false;
    if (normalized.imageUrl) {
      try {
        const imageUrl = new URL(normalized.imageUrl);
        isCloudinaryImageUrl =
          imageUrl.protocol === "https:" &&
          imageUrl.hostname === "res.cloudinary.com";
      } catch {
        isCloudinaryImageUrl = false;
      }
    }
    if (
      !normalized.id ||
      !normalized.title ||
      !normalized.description ||
      !normalized.location ||
      !normalized.status ||
      (normalized.imageUrl && !isLocalImagePath && !isCloudinaryImageUrl)
    ) {
      return null;
    }
    projects.push(normalized);
  }

  if (new Set(projects.map((project) => project.id)).size !== projects.length) {
    return null;
  }
  return projects;
}

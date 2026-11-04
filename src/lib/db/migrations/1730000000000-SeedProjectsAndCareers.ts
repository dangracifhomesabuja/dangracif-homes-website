import { MigrationInterface, QueryRunner } from "typeorm";

export const DEFAULT_OTHER_PROJECTS = JSON.stringify([
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
]);

const DEFAULT_CAREER_OPENINGS = JSON.stringify([
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
]);

export class SeedProjectsAndCareers1730000000000
  implements MigrationInterface
{
  name = "SeedProjectsAndCareers1730000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "site_config" ("key", "value")
       VALUES ($1, $2), ($3, $4)
       ON CONFLICT ("key") DO NOTHING`,
      [
        "other_projects",
        DEFAULT_OTHER_PROJECTS,
        "career_openings",
        DEFAULT_CAREER_OPENINGS,
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "site_config"
       WHERE ("key" = $1 AND "value" = $2)
          OR ("key" = $3 AND "value" = $4)`,
      [
        "other_projects",
        DEFAULT_OTHER_PROJECTS,
        "career_openings",
        DEFAULT_CAREER_OPENINGS,
      ]
    );
  }
}

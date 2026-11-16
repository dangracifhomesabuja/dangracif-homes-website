import { MigrationInterface, QueryRunner } from "typeorm";

export class ContentSchema1729000000000 implements MigrationInterface {
  name = "ContentSchema1729000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Blog posts
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "blog_posts" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" VARCHAR(255) NOT NULL,
        "summary" TEXT NOT NULL DEFAULT '',
        "expandedContent" TEXT NOT NULL DEFAULT '',
        "imageSrc" VARCHAR(500) NOT NULL DEFAULT '',
        "imageAlt" VARCHAR(255) NOT NULL DEFAULT '',
        "imageCaption" VARCHAR(255) NOT NULL DEFAULT '',
        "date" VARCHAR(100) NOT NULL DEFAULT '',
        "linkText" VARCHAR(255) NOT NULL DEFAULT '',
        "linkHref" VARCHAR(500) NOT NULL DEFAULT '',
        "published" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // FAQ items
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "faq_items" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "question" TEXT NOT NULL,
        "answer" TEXT NOT NULL,
        "sortOrder" INT NOT NULL DEFAULT 0,
        "published" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Construction milestones
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "construction_milestones" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "phaseNumber" INT NOT NULL DEFAULT 0,
        "date" VARCHAR(100) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Site config (key/value)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "site_config" (
        "key" VARCHAR(100) PRIMARY KEY,
        "value" TEXT NOT NULL DEFAULT '',
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Media assets
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "media_assets" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL DEFAULT '',
        "cloudinaryPublicId" VARCHAR(500) NOT NULL,
        "url" VARCHAR(1000) NOT NULL,
        "secureUrl" VARCHAR(1000) NOT NULL,
        "resourceType" VARCHAR(50) NOT NULL DEFAULT 'image',
        "format" VARCHAR(20) NOT NULL DEFAULT '',
        "width" INT NOT NULL DEFAULT 0,
        "height" INT NOT NULL DEFAULT 0,
        "bytes" INT NOT NULL DEFAULT 0,
        "folder" VARCHAR(100) NOT NULL DEFAULT 'general',
        "altText" VARCHAR(255) NOT NULL DEFAULT '',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Seed default site config
    await queryRunner.query(`
      INSERT INTO "site_config" ("key", "value") VALUES
        ('stats', '{"units":"88","sqm":"9,900","months":"14","security":"24/7"}'),
        ('contact', '{"phone":"+234 813 318 7860","email":"sales@dangracifhomes.com","whatsapp":"2348000000000","inspectionHours":"Inspections hold Monday – Saturday, 9am – 5pm."}'),
        ('estate', '{"name":"Fidelis Court","address":"21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria","description":"A gated residential community on approximately 9,900 sqm.","deliveryDate":"December 2027","youtubeUrl":"https://youtube.com"}'),
        ('open_house', '{"enabled":true,"status":"Ongoing Event","headline":"Fidelis Court Open House","description":"Visit the estate, meet our sales team and explore your next home."}')
      ON CONFLICT ("key") DO NOTHING;
    `);

    // Seed default FAQs
    await queryRunner.query(`
      INSERT INTO "faq_items" ("question", "answer", "sortOrder") VALUES
        ('Where is Fidelis Court located?', '21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja. Site inspections and the open house hold at the estate.', 1),
        ('What title will the buyer receive?', 'Buyers receive a Deed of Assignment backed by the global Certificate of Occupancy (C of O) covering the entire estate development.', 2),
        ('When will the project be completed?', 'The projected delivery timeline is 14 months, scheduled for completion by December 2027.', 3),
        ('How does the payment plan work?', 'You can start with a 40% initial commitment deposit and spread the remaining balance conveniently across 12 monthly installments.', 4),
        ('Are there fees on top of the price?', 'All primary infrastructure, power connection, water reticulation, and documentation fees are transparently itemized with zero hidden charges.', 5),
        ('Where can I buy?', 'You can purchase directly through our sales team on-site at Fidelis Court, at our head office in Gwarimpa, or online via our portal.', 6),
        ('Can I become a sales agent?', 'Yes, we welcome certified realtors and registered sales partners. Contact our partnerships desk or register through the Become an Agent link.', 7)
      ON CONFLICT DO NOTHING;
    `);

    // Seed default construction milestones
    await queryRunner.query(`
      INSERT INTO "construction_milestones" ("phaseNumber", "date", "title") VALUES
        (1, '01 December 2025', 'Groundbreaking & site mobilisation'),
        (2, 'January 2026 – May 2027', 'Substructure & superstructure works'),
        (3, 'Jul – Nov 2027', 'Roofing, services & finishes'),
        (4, 'Dec 2027', 'Infrastructure completion & handover')
      ON CONFLICT DO NOTHING;
    `);

    // Seed default blog posts
    await queryRunner.query(`
      INSERT INTO "blog_posts" ("title", "summary", "expandedContent", "imageSrc", "imageAlt", "imageCaption", "date", "linkText", "linkHref") VALUES
        ('Groundbreaking at Fidelis Court', 'Site mobilisation began in April 2026, marking the start of our journey to deliver 88 homes in Kubwa F01.', 'We broke ground at 21, Josephat Mojeckwu Avenue, Kubwa F01. The 14-month construction programme runs from October 2026 to December 2027.', '/images/fidelis-court-hero.jpg', 'Groundbreaking at Fidelis Court estate in Kubwa', 'Actual site photos', 'APRIL 2026', 'View construction updates', 'https://youtube.com'),
        ('How our 12-month payment plan works', 'Own a home with a 40% deposit and spread the balance over 12 months.', 'Start with a minimum 40% deposit, then pay 20% after 3 months, 20% after another 3 months, and the final 20% within 12 months (with charges).', '/images/apartment-2bed.jpg', 'Interior living room of apartment', 'Actual site photos', 'SEPTEMBER 2026', 'View prices & payment plan', '/pricing'),
        ('Join our open house at the estate', 'Tour the site, meet our sales team and see the plans in person.', 'Our open house is ongoing at the Fidelis Court estate in Kubwa. Register on our home page and our team will walk you through the units, pricing and payment plan.', '/images/terrace-duplex.jpg', 'Terrace duplex units', 'Actual site photos', 'OCTOBER 2026', 'Register for the open house', '/#contact')
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "media_assets";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "site_config";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "construction_milestones";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "faq_items";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "blog_posts";`);
  }
}

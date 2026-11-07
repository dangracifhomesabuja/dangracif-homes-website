import { MigrationInterface, QueryRunner } from "typeorm";

const SEEDED_SAMPLE_INQUIRIES = [
  {
    name: "Dr. Oladipo Adeleke",
    email: "oladipo.adeleke@example.com",
    message: "Interested in outright purchase for unit on 2nd floor.",
  },
  {
    name: "Mrs. Chioma Eze",
    email: "chioma.eze@example.com",
    message: "Requesting Saturday afternoon site walkthrough with family.",
  },
  {
    name: "Alhaji Ibrahim Musa",
    email: "ibrahim.m@example.com",
    message: "Looking to reserve 2 units as investment rentals.",
  },
  {
    name: "Barrister Anthony Udoh",
    email: "anthony.udoh@example.com",
    message: "Attending open house next Saturday with partners.",
  },
];

export class RemoveSeededSampleInquiries1734000000000
  implements MigrationInterface
{
  name = "RemoveSeededSampleInquiries1734000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const inquiry of SEEDED_SAMPLE_INQUIRIES) {
      await queryRunner.query(
        `DELETE FROM "lead_inquiries"
         WHERE "fullName" = $1 AND "email" = $2 AND "message" = $3`,
        [inquiry.name, inquiry.email, inquiry.message]
      );
    }
  }

  public async down(): Promise<void> {
    // Sample inquiries are intentionally not restored.
  }
}

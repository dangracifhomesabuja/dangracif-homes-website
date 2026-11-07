import { MigrationInterface, QueryRunner } from "typeorm";

export class SetPropertyUnitsAvailable1733000000000
  implements MigrationInterface
{
  name = "SetPropertyUnitsAvailable1733000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "property_units"
       SET "availableUnits" = "unitsCount",
           "status" = 'available',
           "updatedAt" = now()`
    );
  }

  public async down(): Promise<void> {
    // Availability is managed by admins after this migration and cannot be safely rolled back.
  }
}

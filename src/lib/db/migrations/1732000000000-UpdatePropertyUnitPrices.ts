import { MigrationInterface, QueryRunner } from "typeorm";

const UNIT_PRICES = [
  { id: "1-bed", price: "₦55,500,000", numericPrice: 55_500_000 },
  { id: "2-bed", price: "₦82,500,000", numericPrice: 82_500_000 },
  { id: "4-bed-terrace", price: "₦127,500,000", numericPrice: 127_500_000 },
];

export class UpdatePropertyUnitPrices1732000000000
  implements MigrationInterface
{
  name = "UpdatePropertyUnitPrices1732000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const unit of UNIT_PRICES) {
      await queryRunner.query(
        `UPDATE "property_units"
         SET "price" = $1, "numericPrice" = $2, "updatedAt" = now()
         WHERE "id" = $3`,
        [unit.price, unit.numericPrice, unit.id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const previousPrices = [
      { id: "1-bed", price: "₦53,000,000", numericPrice: 53_000_000 },
      { id: "2-bed", price: "₦80,000,000", numericPrice: 80_000_000 },
      { id: "4-bed-terrace", price: "₦125,000,000", numericPrice: 125_000_000 },
    ];

    for (const unit of previousPrices) {
      await queryRunner.query(
        `UPDATE "property_units"
         SET "price" = $1, "numericPrice" = $2, "updatedAt" = now()
         WHERE "id" = $3`,
        [unit.price, unit.numericPrice, unit.id]
      );
    }
  }
}

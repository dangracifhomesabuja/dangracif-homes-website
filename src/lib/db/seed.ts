import "reflect-metadata";
import bcrypt from "bcrypt";
import { getDatabaseConnection } from "./data-source";
import { User } from "./entities/User";
import { PropertyUnit } from "./entities/PropertyUnit";

export async function runSeed() {
  console.log("🌱 Starting database seeding...");
  const dataSource = await getDatabaseConnection();

  // 1. Seed Admin User
  const userRepo = dataSource.getRepository<User>("users");
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
  const unitRepo = dataSource.getRepository<PropertyUnit>("property_units");
  const defaultUnits = [
    {
      id: "1-bed",
      title: "1-Bedroom Apartment",
      unitsCount: 32,
      availableUnits: 32,
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
      availableUnits: 48,
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
      availableUnits: 8,
      description: "Shell option — finish to your bespoke taste & architectural flair.",
      price: "₦127,500,000",
      numericPrice: 127500000,
      imageSrc: "/fidelis-court/Vibrant Mid-Rise Construction Site.png",
      status: "available",
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

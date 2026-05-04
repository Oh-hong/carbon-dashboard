import { PrismaClient, Category } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://hongjungi@localhost:5432/carbon_dashboard",
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 배출계수 데이터 (과제 제공)
const emissionFactors = [
  {
    category: Category.ELECTRICITY,
    name: "한국전력",
    unit: "kWh",
    currentValue: 0.456, // kgCO₂e / kWh
  },
  {
    category: Category.RAW_MATERIAL,
    name: "플라스틱 1",
    unit: "kg",
    currentValue: 2.3, // kgCO₂e / kg
  },
  {
    category: Category.RAW_MATERIAL,
    name: "플라스틱 2",
    unit: "kg",
    currentValue: 3.2, // kgCO₂e / kg
  },
  {
    category: Category.TRANSPORT,
    name: "트럭",
    unit: "ton-km",
    currentValue: 3.5, // kgCO₂e / ton-km
  },
];

// 활동 데이터 (과제 제공)
const activities = [
  // 전기 (Scope 2)
  { date: "2025-01-01", category: Category.ELECTRICITY, name: "한국전력", amount: 110, unit: "kWh", scope: 2 },
  { date: "2025-02-01", category: Category.ELECTRICITY, name: "한국전력", amount: 112, unit: "kWh", scope: 2 },
  { date: "2025-03-01", category: Category.ELECTRICITY, name: "한국전력", amount: 115, unit: "kWh", scope: 2 },
  { date: "2025-04-01", category: Category.ELECTRICITY, name: "한국전력", amount: 130, unit: "kWh", scope: 2 },
  { date: "2025-05-01", category: Category.ELECTRICITY, name: "한국전력", amount: 120, unit: "kWh", scope: 2 },
  { date: "2025-06-01", category: Category.ELECTRICITY, name: "한국전력", amount: 110, unit: "kWh", scope: 2 },
  { date: "2025-07-01", category: Category.ELECTRICITY, name: "한국전력", amount: 120, unit: "kWh", scope: 2 },
  { date: "2025-08-01", category: Category.ELECTRICITY, name: "한국전력", amount: 111, unit: "kWh", scope: 2 },
  { date: "2025-05-01", category: Category.ELECTRICITY, name: "한국전력", amount: 101, unit: "kWh", scope: 2 },

  // 원소재 (Scope 3)
  { date: "2025-01-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 230, unit: "kg", scope: 3 },
  { date: "2025-02-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 340, unit: "kg", scope: 3 },
  { date: "2025-03-01", category: Category.RAW_MATERIAL, name: "플라스틱 2", amount: 23, unit: "kg", scope: 3 },
  { date: "2025-03-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 430, unit: "kg", scope: 3 },
  { date: "2025-04-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 510, unit: "kg", scope: 3 },
  { date: "2025-05-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 424, unit: "kg", scope: 3 },
  { date: "2025-05-01", category: Category.RAW_MATERIAL, name: "플라스틱 2", amount: 40, unit: "kg", scope: 3 },
  { date: "2025-06-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 450, unit: "kg", scope: 3 },
  { date: "2025-07-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 340, unit: "kg", scope: 3 },
  { date: "2025-07-01", category: Category.RAW_MATERIAL, name: "플라스틱 2", amount: 43, unit: "kg", scope: 3 },
  { date: "2025-08-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 230, unit: "kg", scope: 3 },
  { date: "2025-05-01", category: Category.RAW_MATERIAL, name: "플라스틱 1", amount: 232, unit: "kg", scope: 3 },

  // 운송 (Scope 3)
  { date: "2025-01-01", category: Category.TRANSPORT, name: "트럭", amount: 41, unit: "ton-km", scope: 3 },
  { date: "2025-02-01", category: Category.TRANSPORT, name: "트럭", amount: 211, unit: "ton-km", scope: 3 },
  { date: "2025-03-01", category: Category.TRANSPORT, name: "트럭", amount: 123, unit: "ton-km", scope: 3 },
  { date: "2025-04-01", category: Category.TRANSPORT, name: "트럭", amount: 42, unit: "ton-km", scope: 3 },
  { date: "2025-05-01", category: Category.TRANSPORT, name: "트럭", amount: 123, unit: "ton-km", scope: 3 },
  { date: "2025-06-01", category: Category.TRANSPORT, name: "트럭", amount: 123, unit: "ton-km", scope: 3 },
  { date: "2025-07-01", category: Category.TRANSPORT, name: "트럭", amount: 41, unit: "ton-km", scope: 3 },
  { date: "2025-08-01", category: Category.TRANSPORT, name: "트럭", amount: 123, unit: "ton-km", scope: 3 },
  { date: "2025-05-01", category: Category.TRANSPORT, name: "트럭", amount: 12, unit: "ton-km", scope: 3 },
];

async function main() {
  console.log("Seeding database...");

  // 기존 데이터 삭제
  await prisma.activity.deleteMany();
  await prisma.emissionFactorVersion.deleteMany();
  await prisma.emissionFactor.deleteMany();

  // 배출계수 생성
  const factorMap = new Map<string, string>();

  for (const factor of emissionFactors) {
    const created = await prisma.emissionFactor.create({
      data: {
        ...factor,
        versions: {
          create: {
            value: factor.currentValue,
            validFrom: new Date("2025-01-01"),
            createdBy: "system",
          },
        },
      },
    });
    factorMap.set(`${factor.category}-${factor.name}`, created.id);
    console.log(`Created emission factor: ${factor.name}`);
  }

  // 활동 데이터 생성
  for (const activity of activities) {
    const factorId = factorMap.get(`${activity.category}-${activity.name}`);
    const factor = emissionFactors.find(
      (f) => f.category === activity.category && f.name === activity.name
    );
    const calculatedEmission = factor
      ? activity.amount * factor.currentValue
      : null;

    await prisma.activity.create({
      data: {
        date: new Date(activity.date),
        category: activity.category,
        name: activity.name,
        amount: activity.amount,
        unit: activity.unit,
        scope: activity.scope,
        emissionFactorId: factorId,
        calculatedEmission,
      },
    });
  }

  console.log(`Created ${activities.length} activities`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

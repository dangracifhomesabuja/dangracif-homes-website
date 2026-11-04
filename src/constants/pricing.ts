// Shared pricing data — single source of truth used across components
export interface UnitPlan {
  id: string;
  label: string;
  units: number;
  basePrice: number; // in Naira
  instalments: Instalment[];
  additionalCharges: AdditionalCharge[];
  note?: string;
}

export interface Instalment {
  percentage: number;
  title: string;
  subtitle: string;
  amount: number;
}

export interface AdditionalCharge {
  label: string;
  sublabel: string;
  amount: number;
  isTotal?: boolean;
  isTotalOwnership?: boolean;
}

export const UNIT_PLANS: UnitPlan[] = [
  {
    id: "1-bed",
    label: "1-Bedroom Apartment",
    units: 32,
    basePrice: 55_500_000,
    instalments: [
      { percentage: 40, title: "Initial deposit", subtitle: "On subscription (minimum)", amount: 22_200_000 },
      { percentage: 20, title: "2nd instalment", subtitle: "After 3 months", amount: 11_100_000 },
      { percentage: 20, title: "3rd instalment", subtitle: "After 6 months", amount: 11_100_000 },
      { percentage: 20, title: "Final instalment", subtitle: "Within 12 months, with charges", amount: 11_100_000 },
    ],
    additionalCharges: [
      { label: "Legal, Admin & Survey Fee", sublabel: "2% of Basic Price", amount: 1_110_000 },
      { label: "Infrastructure Fee", sublabel: "Per unit", amount: 300_000 },
      { label: "Asset Replacement Deposit", sublabel: "Remitted to the Owners' Association on completion", amount: 300_000 },
      { label: "Service Charge Deposit", sublabel: "Subject to review at completion", amount: 600_000 },
      { label: "Total charges", sublabel: "", amount: 2_310_000 },
      { label: "Total cost of ownership", sublabel: "", amount: 57_810_000, isTotalOwnership: true },
    ],
    note: "Final instalment attracts applicable charges.",
  },
  {
    id: "2-bed",
    label: "2-Bedroom Apartment",
    units: 48,
    basePrice: 82_500_000,
    instalments: [
      { percentage: 40, title: "Initial deposit", subtitle: "On subscription (minimum)", amount: 33_000_000 },
      { percentage: 20, title: "2nd instalment", subtitle: "After 3 months", amount: 16_500_000 },
      { percentage: 20, title: "3rd instalment", subtitle: "After 6 months", amount: 16_500_000 },
      { percentage: 20, title: "Final instalment", subtitle: "Within 12 months, with charges", amount: 16_500_000 },
    ],
    additionalCharges: [
      { label: "Legal, Admin & Survey Fee", sublabel: "2% of Basic Price", amount: 1_650_000 },
      { label: "Infrastructure Fee", sublabel: "Per unit", amount: 300_000 },
      { label: "Asset Replacement Deposit", sublabel: "Remitted to the Owners' Association on completion", amount: 300_000 },
      { label: "Service Charge Deposit", sublabel: "Subject to review at completion", amount: 600_000 },
      { label: "Total charges", sublabel: "", amount: 2_850_000 },
      { label: "Total cost of ownership", sublabel: "", amount: 85_350_000, isTotalOwnership: true },
    ],
    note: "Final instalment attracts applicable charges.",
  },
  {
    id: "4-bed",
    label: "4-Bedroom Terrace (Shell)",
    units: 8,
    basePrice: 127_500_000,
    instalments: [
      { percentage: 40, title: "Initial deposit", subtitle: "On subscription (minimum)", amount: 51_000_000 },
      { percentage: 20, title: "2nd instalment", subtitle: "After 3 months", amount: 25_500_000 },
      { percentage: 20, title: "3rd instalment", subtitle: "After 6 months", amount: 25_500_000 },
      { percentage: 20, title: "Final instalment", subtitle: "Within 12 months, with charges", amount: 25_500_000 },
    ],
    additionalCharges: [
      { label: "Legal, Admin & Survey Fee", sublabel: "2% of Basic Price", amount: 2_550_000 },
      { label: "Infrastructure Fee", sublabel: "Per unit", amount: 300_000 },
      { label: "Asset Replacement Deposit", sublabel: "Remitted to the Owners' Association on completion", amount: 300_000 },
      { label: "Service Charge Deposit", sublabel: "Subject to review at completion", amount: 600_000 },
      { label: "Total charges", sublabel: "", amount: 3_750_000 },
      { label: "Total cost of ownership", sublabel: "", amount: 131_250_000, isTotalOwnership: true },
    ],
    note: "Final instalment attracts applicable charges.",
  },
];

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

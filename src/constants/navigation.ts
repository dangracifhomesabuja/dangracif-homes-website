import { NavItem, UnitOption } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Fidelis Court", href: "/fideliscourt" },
  { label: "Pricing & Plans", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const UNIT_OPTIONS: UnitOption[] = [
  {
    label: "1-Bedroom Apartment — ₦55,500,000",
    value: "1-bed",
    priceFormatted: "₦55,500,000",
  },
  {
    label: "2-Bedroom Apartment — ₦82,500,000",
    value: "2-bed",
    priceFormatted: "₦82,500,000",
  },
  {
    label: "4-Bedroom Terrace Duplex — ₦127,500,000",
    value: "4-bed-terrace",
    priceFormatted: "₦127,500,000",
  },
];

export const ESTATE_CONTACT = {
  phone: "+234 813 318 7860",
  email: "sales@dangracifhomes.com",
  estateName: "Fidelis Court — Estate",
  address: "21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria",
  description:
    "Fidelis Court is the estate development — site inspections are carried out there. Sales offices are available at both the estate and the developer office.",
  inspectionHours: "Inspections hold Monday – Saturday, 9am – 5pm.",
};

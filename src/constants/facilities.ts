export const FACILITY_ICON_OPTIONS = [
  { value: "Building2", label: "Building" },
  { value: "Shield", label: "Security" },
  { value: "Wifi", label: "Wi-Fi" },
  { value: "Zap", label: "Power" },
  { value: "Phone", label: "Phone" },
  { value: "CloudRain", label: "Rainwater" },
  { value: "Droplets", label: "Water" },
  { value: "Lamp", label: "Lighting" },
  { value: "Leaf", label: "Landscaping" },
  { value: "Fence", label: "Fence" },
  { value: "Trash2", label: "Waste" },
  { value: "Settings2", label: "Management" },
  { value: "Gauge", label: "Metering" },
] as const;

export type FacilityIcon = (typeof FACILITY_ICON_OPTIONS)[number]["value"];

export interface Facility {
  icon: FacilityIcon;
  label: string;
}

export const DEFAULT_FACILITIES: Facility[] = [
  { icon: "Building2", label: "Commercial building (G+1)" },
  { icon: "Shield", label: "Security office / gate house" },
  { icon: "Wifi", label: "Fibre internet" },
  { icon: "Zap", label: "Dedicated transformer" },
  { icon: "Zap", label: "Generator for common areas" },
  { icon: "Shield", label: "24-hour security & patrol" },
  { icon: "Phone", label: "Intercom access control" },
  { icon: "CloudRain", label: "Storm water network" },
  { icon: "Droplets", label: "Industrial borehole & reticulation" },
  { icon: "Lamp", label: "Street lighting" },
  { icon: "Leaf", label: "Landscaping" },
  { icon: "Fence", label: "Perimeter fence & paved walkways" },
  { icon: "Trash2", label: "Sewage sanitation network" },
  { icon: "Settings2", label: "Facility management service" },
  { icon: "Gauge", label: "Smart metering / dual power" },
];

export function isFacilityIcon(value: unknown): value is FacilityIcon {
  return FACILITY_ICON_OPTIONS.some((option) => option.value === value);
}

export function normalizeFacilities(value: unknown): Facility[] | null {
  if (!Array.isArray(value) || value.length > 100) {
    return null;
  }

  const facilities: Facility[] = [];
  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("icon" in item) ||
      !("label" in item) ||
      typeof item.icon !== "string" ||
      typeof item.label !== "string"
    ) {
      return null;
    }

    const icon = isFacilityIcon(item.icon) ? item.icon : null;
    const label = item.label.trim();
    if (!icon || !label || label.length > 120) {
      return null;
    }

    facilities.push({ icon, label });
  }

  return facilities;
}

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface UnitOption {
  label: string;
  value: string;
  priceFormatted: string;
}

export interface InspectionFormData {
  fullName: string;
  phone: string;
  email: string;
  unitType: string;
  preferredDate: string;
  message?: string;
}

export interface OpenHouseFormData {
  fullName: string;
  phone: string;
  email: string;
  homeOfInterest: string;
  attendees: number;
  message?: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
}

export interface HomeModel {
  id: string;
  title: string;
  unitsCount: number;
  description: string;
  price: string;
  imageSrc: string;
  galleryImages: {
    src: string;
    caption: string;
  }[];
}

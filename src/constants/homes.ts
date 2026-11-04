import { HomeModel } from "@/types";

export const HOMES_DATA: HomeModel[] = [
  {
    id: "1-bed",
    title: "1-Bedroom Apartment",
    unitsCount: 32,
    description: "Compact, efficient city living",
    price: "₦55.5M",
    imageSrc: "/fidelis-court/Bright Renovation Room with Window Views.png",
    galleryImages: [
      {
        src: "/fidelis-court/Bright Renovation Room with Window Views.png",
        caption: "1-Bedroom living area",
      },
      {
        src: "/fidelis-court/Bright Unfinished Room Under Construction.png",
        caption: "Open kitchen & dining layout",
      },
      {
        src: "/fidelis-court/Bright Unfinished Hallway Renovation.png",
        caption: "Bedroom suite & natural lighting",
      },
    ],
  },
  {
    id: "2-bed",
    title: "2-Bedroom Apartment",
    unitsCount: 48,
    description: "Ideal for young families & professionals",
    price: "₦82.5M",
    imageSrc: "/fidelis-court/Sunlit Unfinished Room Renovation.png",
    galleryImages: [
      {
        src: "/fidelis-court/Sunlit Unfinished Room Renovation.png",
        caption: "2-Bedroom living area",
      },
      {
        src: "/fidelis-court/Unfinished Room Under Renovation.png",
        caption: "Dining area & interior layout",
      },
      {
        src: "/fidelis-court/Bright Unfinished Room with Exposed Wiring.png",
        caption: "Master suite with corner windows",
      },
    ],
  },
  {
    id: "4-bed-terrace",
    title: "4-Bedroom Terrace (Shell)",
    unitsCount: 8,
    description: "Shell option — finish to your taste",
    price: "₦127.5M",
    imageSrc: "/fidelis-court/Vibrant Mid-Rise Construction Site.png",
    galleryImages: [
      {
        src: "/fidelis-court/Vibrant Mid-Rise Construction Site.png",
        caption: "Terrace exterior",
      },
      {
        src: "/fidelis-court/Apartment Building Under Construction.png",
        caption: "Estate street view",
      },
      {
        src: "/fidelis-court/Sunlit Building Under Construction.png",
        caption: "Terrace block progress",
      },
    ],
  },
];

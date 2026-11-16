"use client";

import * as React from "react";
import { MapPin, ExternalLink } from "lucide-react";

const ESTATE_MAP_COORDINATES = "9.1492445,7.3267631";
const MAPS_PIN_URL = "https://maps.app.goo.gl/gRWxx1fef1UsgpE76";

const LOCATIONS = [
  {
    id: "estate",
    title: "Fidelis Court — the estate",
    address: "21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT, Nigeria",
    note: "Fidelis Court is the estate development — site inspections are carried out there. Sales offices are available at both the estate and the developer office.",
  },
  {
    id: "office",
    title: "Developer office",
    address:
      "Dangracif Homes Limited\nSuite B5, Bricks 'N' More Plaza, 6th Avenue, Gwarimpa, Abuja, FCT, Nigeria",
    note: "Sales office available here.",
    mapUrl: null,
  },
];

const MAP_EMBED_URL = `https://www.google.com/maps?q=${ESTATE_MAP_COORDINATES}&output=embed`;

export const LocationSection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAFCFE] py-14 sm:py-18 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <span className={`text-xs mb-2 font-semibold uppercase tracking-[0.2em] text-[#00ABF0]`}>
            Where to find us
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Visit the estate or our developer office
          </h2>
          <p className="text-md text-zinc-600 max-w-3xl">
            Sales offices are available at both locations. Site inspections take
            place at Fidelis Court.
          </p>
        </div>

        {/* Office cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-3"
            >
              <p className="text-[16px] font-bold text-zinc-900">{loc.title}</p>
              <div className="flex items-start gap-2 text-sm text-zinc-700">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-zinc-400" />
                <span className="whitespace-pre-line leading-relaxed">
                  {loc.address}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Map Embed */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
          {/* Open in Maps button overlay */}
          <div className="absolute top-4 left-4 z-10">
            <a
              href={MAPS_PIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              Open in Maps
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
          </div>
          <iframe
            src={MAP_EMBED_URL}
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Fidelis Court Location Map"
          />
        </div>
        <div className="-pt-2 text-[#00ABF0] w-full">
          This is the map to the estate
        </div>
      </div>
    </section>
  );
};

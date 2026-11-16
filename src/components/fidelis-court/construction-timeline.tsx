"use client";

import * as React from "react";
import { getPublicMilestones } from "@/app/actions/public-content";

const MILESTONES = [
  {
    number: "01",
    date: "01 December 2025",
    title: "Groundbreaking & site mobilisation",
  },
  {
    number: "02",
    date: "January 2026 – May 2027",
    title: "Substructure & superstructure works",
  },
  {
    number: "03",
    date: "Jul – Nov 2027",
    title: "Roofing, services & finishes",
  },
  {
    number: "04",
    date: "Dec 2027",
    title: "Infrastructure completion & handover",
  },
];

export const ConstructionTimeline: React.FC = () => {
  const [milestones, setMilestones] = React.useState(MILESTONES);

  React.useEffect(() => {
    getPublicMilestones().then((dbMilestones) => {
      if (dbMilestones && dbMilestones.length > 0) {
        setMilestones(
          dbMilestones.map((m, idx) => ({
            number: String(idx + 1).padStart(2, "0"),
            date: m.date,
            title: m.title,
          }))
        );
      }
    });
  }, []);

  return (
    <section className="w-full bg-white py-14 sm:py-18 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] text-[#00ABF0]`}>
            Construction Timeline
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Indicative milestones
          </h2>
          <p className="text-sm text-zinc-500 max-w-3xl">
            Construction commenced on 01 December 2025, with infrastructure
            completion and handover targeted for December 2027.
          </p>
        </div>

        {/* Timeline cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div
              key={m.number}
              className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-2 hover:border-[#00ABF0]/20 hover:shadow-sm transition-all"
            >
              <span className="text-[13px] font-extrabold text-[#00ABF0] uppercase tracking-wider">
                {String(m.number).padStart(2, "0")} · {m.date}
              </span>
              <p className="text-sm sm:text-base font-semibold text-zinc-900 leading-snug">
                {m.title}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-zinc-600">
          Timeline is indicative and subject to change.
        </p>
      </div>
    </section>
  );
};

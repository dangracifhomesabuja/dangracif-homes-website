import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getPublicCareerOpenings } from "@/app/actions/public-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers | Dangracif Homes",
  description:
    "Explore current career opportunities at Dangracif Homes. We are hiring a Social Media Officer and a Sales Officer.",
};

export default async function CareersPage() {
  const openings = await getPublicCareerOpenings();

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header />
      <main className="flex-1">
        <section className="bg-[#0D1B3E] py-16 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0]">
              Join our team
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Careers at Dangracif Homes
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Help us create thoughtfully designed communities and make the
              journey to finding a home a great experience.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00ABF0]">
                Current openings
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0D1B3E] sm:text-3xl">
                Find your next opportunity
              </h2>
            </div>

            {openings.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {openings.map((role) => {
                  const subject = encodeURIComponent(
                    `Application for ${role.title}`
                  );
                  const body = encodeURIComponent(
                    `Hello Dangracif Homes,\n\nI am interested in applying for the ${role.title} position.\n\nName:\nPhone:\n`
                  );
                  return (
                    <article
                      key={role.id}
                      className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF5FF] text-[#0754C6]">
                        <BriefcaseBusiness
                          aria-hidden="true"
                          className="h-6 w-6"
                        />
                      </div>
                      <h3 className="mt-5 text-xl font-bold tracking-tight text-[#0D1B3E]">
                        {role.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {role.employmentType}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                          <MapPin className="h-3.5 w-3.5 text-[#00ABF0]" />
                          {role.location}
                        </span>
                      </div>
                      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                        {role.description.split("\n\n")[0]}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/careers/${encodeURIComponent(role.id)}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0754C6] hover:text-[#0648AB]"
                        >
                          View job details
                          <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`mailto:info@dangracifhomes.com?subject=${subject}&body=${body}`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0754C6] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0648AB]"
                        >
                          Apply via email
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-4 text-xl font-bold text-slate-800">
                  No current openings
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Please check back for future career opportunities.
                </p>
              </div>
            )}

            {openings.length > 0 && (
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-[#EEF5FF] p-5 text-sm leading-relaxed text-slate-700">
                <BriefcaseBusiness
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#0754C6]"
                />
                <p>
                  To apply, email your CV and a brief introduction to{" "}
                  <a
                    href="mailto:info@dangracifhomes.com"
                    className="font-semibold text-[#0754C6] underline underline-offset-2"
                  >
                    info@dangracifhomes.com
                  </a>{" "}
                  with the role title in the subject line.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

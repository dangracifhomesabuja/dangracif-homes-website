import Link from "next/link";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getPublicCareerOpenings } from "@/app/actions/public-content";

export const dynamic = "force-dynamic";

export default async function CareerOpeningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const openings = await getPublicCareerOpenings();
  const opening = openings.find((item) => item.id === id);
  if (!opening) notFound();

  const subject = encodeURIComponent(`Application for ${opening.title}`);
  const body = encodeURIComponent(
    `Hello Dangracif Homes,\n\nI am interested in applying for the ${opening.title} position.\n\nName:\nPhone:\n`
  );

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header />
      <main className="flex-1">
        <section className="bg-[#0D1B3E] py-12 text-white sm:py-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All career openings
            </Link>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0]">
              Join our team
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              {opening.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full bg-white/10 px-3 py-1">
                {opening.employmentType}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                <MapPin className="h-4 w-4 text-[#00ABF0]" />
                {opening.location}
              </span>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:px-6 lg:grid-cols-3 lg:px-8">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
              <h2 className="text-xl font-bold tracking-tight text-[#0D1B3E]">
                Job description
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                {opening.description}
              </p>
            </article>

            <aside className="h-fit rounded-3xl border border-blue-100 bg-[#EEF5FF] p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0754C6]">
                <BriefcaseBusiness aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-[#0D1B3E]">
                Interested in this role?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Email your CV and a brief introduction to apply.
              </p>
              <Link
                href={`mailto:info@dangracifhomes.com?subject=${subject}&body=${body}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0754C6] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0648AB]"
              >
                Apply via email
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

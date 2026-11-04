import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getPublicOtherProjects } from "@/app/actions/public-content";

export const dynamic = "force-dynamic";

export default async function OtherProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await getPublicOtherProjects();
  const project = projects.find((item) => item.id === id);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header />
      <main className="flex-1">
        <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
            <Link
              href="/other-projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0754C6]"
            >
              <ArrowLeft className="h-4 w-4" />
              All projects
            </Link>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-semibold text-[#0754C6]">
                {project.status}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <MapPin className="h-4 w-4 text-[#00ABF0]" />
                {project.location}
              </span>
            </div>
            <h1 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-[#0D1B3E] sm:text-5xl">
              {project.title}
            </h1>
          </div>
        </section>

        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
            <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B3E] to-[#0754C6] sm:rounded-3xl">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
              ) : (
                <Building2
                  aria-hidden="true"
                  className="h-20 w-20 text-white/70"
                />
              )}
            </div>
            <div className="mt-10 grid gap-8 border-b border-slate-200 pb-10 sm:mt-14 sm:grid-cols-3 sm:gap-12">
              <div className="sm:col-span-1">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00ABF0]">
                  Project overview
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0D1B3E]">
                  About the project
                </h2>
              </div>
              <div className="sm:col-span-2">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-8">
                  {project.description}
                </p>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center justify-center rounded-full bg-[#0754C6] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0648AB]"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

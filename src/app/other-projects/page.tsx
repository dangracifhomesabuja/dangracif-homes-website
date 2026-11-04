import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getPublicOtherProjects } from "@/app/actions/public-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Other Projects | Dangracif Homes",
  description: "Explore other developments by Dangracif Homes.",
};

export default async function OtherProjectsPage() {
  const projects = await getPublicOtherProjects();

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-zinc-900 flex flex-col antialiased">
      <Header />
      <main className="flex-1">
        <section className="bg-[#0D1B3E] text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ABF0]">
              Dangracif Homes
            </p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Other Projects
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-200">
              Explore commercial and other developments from Dangracif Homes.
              Project details will be updated as they become available.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D1B3E] to-[#0754C6]">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <Building2
                          aria-hidden="true"
                          className="h-16 w-16 text-white/70"
                        />
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#0754C6]">
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-4 p-6 sm:p-8">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0D1B3E]">
                          {project.title}
                        </h2>
                        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                          <MapPin className="h-4 w-4 text-[#00ABF0]" />
                          {project.location}
                        </p>
                      </div>
                      <p className="line-clamp-3 text-sm sm:text-base leading-relaxed text-slate-600">
                        {project.description}
                      </p>
                      <Link
                        href={`/other-projects/${encodeURIComponent(project.id)}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0754C6] hover:text-[#0648AB]"
                      >
                        View project
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <Building2 className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  More projects coming soon
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Please check back for updates on our other developments.
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

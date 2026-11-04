import { getOtherProjects } from "@/app/actions/admin-content";
import { AdminProjectsClient } from "@/components/admin/admin-projects-client";

export const metadata = {
  title: "Other Projects | Dangracif Homes Admin",
};

export default async function AdminProjectsPage() {
  const projects = await getOtherProjects();
  return <AdminProjectsClient initialProjects={projects} />;
}

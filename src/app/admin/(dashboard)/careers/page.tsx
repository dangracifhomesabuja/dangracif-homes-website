import { getCareerOpenings } from "@/app/actions/admin-content";
import { AdminCareersClient } from "@/components/admin/admin-careers-client";

export const metadata = {
  title: "Careers | Dangracif Homes Admin",
};

export default async function AdminCareersPage() {
  const openings = await getCareerOpenings();
  return <AdminCareersClient initialOpenings={openings} />;
}

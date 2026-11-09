import { AdminHeader } from "@/components/organisms/AdminHeader";
import { AdminTemplate } from "@/components/templates/AdminTemplate";

export const instant = false;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminTemplate header={<AdminHeader />}>{children}</AdminTemplate>;
}

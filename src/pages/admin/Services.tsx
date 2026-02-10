import AdminLayout from "@/components/admin/AdminLayout";
import { Briefcase } from "lucide-react";

const AdminServices = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          Layanan
        </h1>
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground text-lg">Fitur ini sedang dalam pengembangan.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;

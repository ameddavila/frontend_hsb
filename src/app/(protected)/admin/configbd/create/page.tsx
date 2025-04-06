// src/app/(protected)/admin/configbd/create/page.tsx
"use client";

import ConfigForm from "@/components/configbd/ConfigForm";
import FormContainer from "@/components/ui/FormContainer";
import { Card } from "primereact/card";
import { useConfigActions } from "@/hooks/useConfigActions";
import { useRouter } from "next/navigation";
import { DbConnectionInput } from "@/types/DbConnection";
import { toast } from "sonner";

export default function CreateConfigPage() {
  const router = useRouter();

  const { handleCreateConfig } = useConfigActions({
    onFinish: () => router.push("/admin/configbd"),
  });

  const handleSubmit = async (data: DbConnectionInput) => {
    try {
      await handleCreateConfig(data);
    } catch (error) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      toast.error(err.response?.data?.mensaje || "Error al crear la conexión");
    }
  };

  return (
    <div className="p-4">
      <div className="p-grid p-justify-center">
        <div className="p-col-12 md:p-col-10 lg:p-col-6">
          <Card>
            <FormContainer title="🆕 Nueva Conexión Remota">
              <ConfigForm onSubmit={handleSubmit} />
            </FormContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

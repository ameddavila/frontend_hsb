// src/app/(protected)/admin/configbd/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getConnectionById } from "@/services/dbConnectionService";
import { useConfigActions } from "@/hooks/useConfigActions";
import { DbConnectionInput } from "@/types/DbConnection";
import ConfigForm from "@/components/configbd/ConfigForm";
import FormContainer from "@/components/ui/FormContainer";
import { Card } from "primereact/card";

export default function EditConfigPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<DbConnectionInput>();

  const { handleUpdateConfig } = useConfigActions({
    onFinish: () => router.push("/admin/configbd"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getConnectionById(Number(id));
        setInitialData(res);
      } catch {
        toast.error("Error al cargar la conexión");
        router.push("/admin/configbd");
      }
    };
    fetchData();
  }, [id, router]);

  if (!initialData) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="p-4">
      <div className="p-grid p-justify-center">
        <div className="p-col-12 md:p-col-10 lg:p-col-6">
          <Card>
            <FormContainer title="✏️ Editar Conexión Remota">
              <ConfigForm onSubmit={(data) => handleUpdateConfig(Number(id), data)} defaultValues={initialData} />
            </FormContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

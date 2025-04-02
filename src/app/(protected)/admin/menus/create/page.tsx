"use client";

import MenuForm from "@/components/menus/MenuForm";
import { Card } from "primereact/card";
import FormContainer from "@/components/ui/FormContainer";
import { useMenuActions } from "@/hooks/useMenuActions";


  export default function CreateMenuPage() {
    const { handleCreateMenu } = useMenuActions();

  return (
    <div className="p-4">
      <div className="p-grid p-justify-center">
        <div className="p-col-12 md:p-col-10 lg:p-col-6">
          <Card>
          <FormContainer title="🆕 Crear Nuevo Menú">
              <MenuForm onSubmit={handleCreateMenu} />
          </FormContainer>

          </Card>
        </div>
      </div>
    </div>
  );
}

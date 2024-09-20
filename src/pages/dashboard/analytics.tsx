import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  CustomTable,
  CustomColumn,
  DataRow,
} from "@/components/core/custom-table";
import {
  useGetAccountingPlan,
  useCreateAccountingPlan,
} from "@/api/accounting_plan/accountRequest";
import {
  AccountingPlanRequestType,
  AccountingPlanResponseType,
} from "@/api/accounting_plan/account.types";
import { dayjs } from "@/lib/dayjs";

// Definimos AccountingPlanRow para que coincida con AccountingPlanResponseType
type AccountingPlanRow = AccountingPlanResponseType;

export function Page(): React.JSX.Element {
  const columns: CustomColumn<AccountingPlanRow>[] = [
    { name: "Code", field: "code" as keyof AccountingPlanRow, type: "number" },
    { name: "Name", field: "name" as keyof AccountingPlanRow, type: "string" },
    {
      name: "Created_At",
      field: "createdAt" as keyof AccountingPlanRow,
      type: "string",
    },
  ];

  const { data, isLoading, isError, error, refetch } = useGetAccountingPlan();

  const rows = data?.map((row) => ({
    code: row.code,
    name: row.name,
    createdAt: dayjs(row.createdAt).format("YYYY-MM-DD"),
  }));

  const createAccountingPlan = useCreateAccountingPlan();

  const saveNewRows = async (newRows: Partial<AccountingPlanRow>[]) => {
    // Creamos un array con las filas válidas
    const rowsToSave: AccountingPlanRequestType[] = newRows
      .filter((row) => row.code?.trim() && row.name?.trim()) // Filtramos las filas que tengan los campos requeridos
      .map((row) => ({
        code: row.code!,
        name: row.name!,
        // Añade aquí otros campos si son necesarios
      }));

    if (rowsToSave.length > 0) {
      try {
        // Pasamos el array de filas válidas a mutateAsync
        await createAccountingPlan.mutateAsync(rowsToSave);
        console.log("Saved rows:", rowsToSave);
      } catch (error) {
        console.error("Error saving rows:", error);
      }
    } else {
      console.error("No valid rows to save");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <Stack spacing={4}>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <CustomTable<AccountingPlanRow>
            columns={columns}
            rows={rows ?? []}
            title="Accounting Plan"
            fetchData={useGetAccountingPlan}
            onSaveNewRows={saveNewRows}
            editableFields={["code", "name"]}
            visibleFields={["code", "name", "createdAt"]}
            refetch={() => refetch().then(() => {})}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        )}
      </Stack>
    </Box>
  );
}

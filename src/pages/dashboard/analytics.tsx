import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataTable, type ColumnDef } from '@/components/core/data-table';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { addFetchedRows, addRow, updateRow } from '@/state/slices/tableSlice';
import { v4 as uuidv4 } from 'uuid';
import { useCreateAccountingPlan, useGetAccountingPlan } from '@/api/accounting_plan/accountRequest';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { CustomTable } from '@/components/core/custom-table';


interface Accounting {
  id: number | null;
  code: string;
  name: string;
}

export function Page(): React.JSX.Element {

  const [localRows, setLocalRows] = useState<Accounting[]>([]);

  const { data: fetchedRows = [], isLoading, isError, error, refetch } = useGetAccountingPlan();

  const columns = [
    { name: 'ID', field: 'id' },
    { name: 'Codigo', field: 'code' },
    { name: 'Nombre', field: 'name' },
  ];

  const addEmptyRow = () => {
    setLocalRows((prevRows) => [
      ...prevRows,
      { id: null, code: '', name: '' } // Nueva fila vacía
    ]);
  };

  const { mutateAsync: save_data } = useCreateAccountingPlan();

  const handleSubmit = async () => {
    const validRows = localRows.filter(row => row.code && row.name);
    console.log(validRows)
    if (validRows.length > 0) {
      try {
        // Llamada a la mutación con los datos mapeados
        await save_data(validRows);
        console.log('Data saved successfully');
        // Resetear las filas locales si se guardaron correctamente
      setLocalRows([]);
      await refetch();
      } catch (error) {
        // Manejar errores aquí
        console.error("Error al guardar:", error);
      }
    }
  }

  const handleChange = (index: number, field: keyof Omit<Accounting, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: e.target.value } : row
      )
    );
  };
  


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Row) => {
  //   dispatch(updateRow({ index, field, value: e.target.value }));
  // };

  // const handleAddRow = () => {
  //   dispatch(addRow({ id: uuidv4(), code: '', name: '', isNew: true }));
  // };

  // const handleSubmit = async () => {
  //   try {
  //     // Filter only new or edited rows
  //     const newOrEditedRows = rows.filter(row => row.isNew || row.isEdited);

  //     // Remove the `id`, `isNew`, and `isEdited` fields
  //     const sanitizedRows = newOrEditedRows.map(({ id, isNew, isEdited, ...rest }) => rest);

  //     console.log(sanitizedRows);

  //     // Save only the sanitized rows
  //     await Promise.all(sanitizedRows.map(row => save_data(row)));
  //     console.log('Data saved successfully');
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //   }
  // };

  if (isLoading) return <Typography>Cargando...</Typography>;
  if (isError) return <Typography>Error: {error instanceof Error ? error.message : 'Unknown error'}</Typography>;

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">Plan de Cuentas</Typography>
            <CustomTable columns={columns} rows={fetchedRows.map(row => ({ ...row }))} title='Analytics' isAddButtonInHeader />
            {/* <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Codigo</TableCell>
                  <TableCell>Nombre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedRows.map((accounting) => (
                  <TableRow key={accounting.id}>
                    <TableCell>{accounting.id}</TableCell>
                    <TableCell>{accounting.code}</TableCell>
                    <TableCell>{accounting.name}</TableCell>
                  </TableRow>
                ))}

                {localRows.map((accounting, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell>{accounting.id !== null ? accounting.id : '---'}</TableCell>
                    <TableCell>
                      <TextField
                        value={accounting.code}
                        onChange={handleChange(index, 'code')}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={accounting.name}
                        onChange={handleChange(index, 'name')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
              Save to Database
            </Button>
          </Box>
        </Stack>
      </Box>
    </React.Fragment>
  );
}

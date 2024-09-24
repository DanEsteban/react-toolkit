import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { useCreateAccountingPlan, useGetAccountingPlan } from '@/api/accounting_plan/accountRequest';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';


interface Accounting {
  id: number | null;
  code: string;
  name: string;
}

export function Page(): React.JSX.Element {


  // Estado local para manejar filas vacías
  // const [localRows, setLocalRows] = useState<Accounting[]>([]);
  // // Usar React Query para obtener los datos
  // const { data: fetchedRows = [], isLoading, isError, error } = useGetAccountingPlan();
  // // Usar React Query para guardar los datos en la base de datos.
  // const { mutateAsync: save_data } = useCreateAccountingPlan();

  
  const addEmptyRow = () => {
    setLocalRows((prevRows) => [
      ...prevRows,
      { id: null, code: '', name: '' } // Nueva fila vacía
    ]);
  };

  const handleChange = (index: number, field: keyof Omit<Accounting, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [field]: e.target.value } : row
      )
    );
  };

  const handleSubmit = async () => {
    const validRows = localRows.filter(row => row.code && row.name);
    console.log(validRows)
    if (validRows.length > 0) {
      try {
        // Llamada a la mutación con los datos mapeados
        await save_data(validRows);
        console.log('Data saved successfully');
        // Resetear las filas locales si se guardaron correctamente
        //setLocalRows([]);
      } catch (error) {
        // Manejar errores aquí
        console.error("Error al guardar:", error);
      }
    }
  }
  
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Analytics</Typography>
            </Box>
            <div>
              <Button startIcon={<PlusIcon />} variant="contained" onClick={addEmptyRow}>
                Add Row
              </Button>
            </div>
          </Stack>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">Plan de Cuentas</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Codigo</TableCell>
                  <TableCell>Nombre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Mapeamos los datos obtenidos de la API */}
                {fetchedRows.map((accounting) => (
                  <TableRow key={accounting.id}>
                    <TableCell>{accounting.id}</TableCell>
                    <TableCell>{accounting.code}</TableCell>
                    <TableCell>{accounting.name}</TableCell>
                  </TableRow>
                ))}

                {/* Mapeamos las filas vacías locales */}
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
            </Table>
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
              Save to Database
            </Button>
          </Box>
        </Stack>
      </Box>
    </React.Fragment>
  );
}

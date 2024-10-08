import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAccounts, useAddAccount, useUpdateAccount } from '@/api/accounting_plan/accountRequest';

import { Account } from '@/api/accounting_plan/account.types';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { FloppyDisk as FloppyDiskIcon } from '@phosphor-icons/react/dist/ssr/FloppyDisk';
import InfiniteScroll from 'react-infinite-scroll-component';


export function Page(): React.JSX.Element {
  const { data: accounts = [], isLoading, isError } = useAccounts(0, 100);
  const { mutate: addAccount } = useAddAccount();
  const { mutate: updateAccount } = useUpdateAccount(); // Mutación para actualizar cuenta

  const [newRow, setNewRow] = React.useState<Account>({ code: '', name: '', level: 0 });
  const [validationError, setValidationError] = React.useState<string | null>(null);
  
  const [editRow, setEditRow] = React.useState<string | null>(null); // Para editar
  const [editedAccount, setEditedAccount] = React.useState<Partial<Account>>({}); // Valores temporales para edición

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'code') {
      const regex = /^[0-9.]*$/;
      if (regex.test(value)) {
        setNewRow({ ...newRow, code: value });
        setValidationError(null);
      } else {
        setValidationError('El código solo puede contener números y puntos. Ej: 1.1, 2.1.1');
      }
    } else if (name === 'name') {
      setNewRow({ ...newRow, name: value });
    }
  };

  const getAncestor = (i: number) => {
    return codeParts.slice(0, i).join('.') + '.';
  }

  const validateNewAccount = (newAccount: Account): boolean => {
    const { code } = newAccount;
    if (accounts.some(account => account.code === code)) {
      setValidationError(`Ya existe una cuenta con el código ${code}`);
      return false;
    }

    if (code.endsWith('.')) {
      const codeWithoutDot = code.slice(0, -1);
      if (accounts.some(account => account.code === codeWithoutDot)) {
        setValidationError(`Ya existe una cuenta con el código ${codeWithoutDot}. Debes editarla para agregar el punto.`);
        return false;
      }
    }

    const codeParts = code.split('.').filter(Boolean);
    if (codeParts.length === 1) return true;  // Es de nivel raíz, no necesita validación de padres
    const ancestorCodes = [];


    // Generar todos los códigos de las cuentas padre
    for (let i = 1; i < codeParts.length; i++) {
      const ancestorCode = getAncestor(i);
      ancestorCodes.push(ancestorCode);
    }

    // Verificar la existencia de cada cuenta padre
    for (const ancestorCode of ancestorCodes) {
      if (!accounts.some(account => account.code === ancestorCode)) {
        setValidationError(`Falta la cuenta Padre: ${ancestorCode}`);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleAddAccount = () => {
    if (!newRow.code || !newRow.name) {
      setValidationError('Tanto el código como el nombre son requeridos');
      return;
    }

    if (!validateNewAccount(newRow)) {
      return;
    }

    // Calcular el nivel de la cuenta basado en los puntos en el código
    const level = (newRow.code.match(/\./g) || []).length - (newRow.code.endsWith('.') ? 1 : 0);

    // Obtener el código del padre (todos los subniveles menos el último)
    const codeParts = newRow.code.split('.').filter(Boolean);
    let parent_code: string | undefined = undefined;

    if (codeParts.length > 1) {
      const parentCode = getAncestor(-1);
      const parentAccount = accounts.find(account => account.code === parentCode);

      if (parentAccount) {
        parent_code = parentAccount.code;
      }
    }

    addAccount({ ...newRow, parent_code, level });
    setNewRow({ code: '', name: '', level: 0 });
  };

  // Funciones para edición
  const handleEditClick = (account: Account) => {
    setEditRow(account.id?.toString() || null); // Activar modo edición para esta fila
    setEditedAccount(account); // Copiar los valores actuales a la cuenta editada
  };

  const handleCancelClick = () => {
    setEditRow(null); // Desactivar modo edición
    setEditedAccount({}); // Limpiar valores temporales
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedAccount({ ...editedAccount, [name]: value });
  };

  const handleSaveClick = (id: string) => {
    updateAccount({ id, updatedAccount: editedAccount });
    setEditRow(null); // Desactivar modo edición
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error al cargar las cuentas</Typography>;


  return (
    <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
      <Stack spacing={4}>
        <Typography variant="h4">Gestión de Cuentas</Typography>

        {/* Formulario para agregar cuentas */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Código"
            name="code"
            value={newRow.code}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            autoFocus
          />
          <TextField
            label="Nombre"
            name="name"
            value={newRow.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handleAddAccount}>
            Agregar Cuenta
          </Button>
        </Stack>

        {/* Mensaje de error de validación */}
        {validationError && <Typography color="error">{validationError}</Typography>}

        {/* Tabla de cuentas dentro del InfiniteScroll */}
        <TableContainer component={Paper} style={{ marginTop: '10px', maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre de la Cuenta</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account: Account) => (
                <TableRow key={account.code}>
                  {editRow === account.id?.toString() ? (
                    // Modo edición
                    <>
                      <TableCell>
                        <TextField
                          name="code"
                          value={editedAccount.code}
                          onChange={handleEditInputChange}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="name"
                          value={editedAccount.name}
                          onChange={handleEditInputChange}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleSaveClick(account.id?.toString()!)}><FloppyDiskIcon color='yellow' size={32}/></Button>
                        <Button onClick={() => handleCancelClick()}>Salir</Button>
                      </TableCell>
                    </>
                  ) : (
                    // Modo visualización
                    <>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditClick(account)}><PencilSimpleIcon color='green' size={32} /></Button>
                        <Button onClick={() => {}}>Borrar</Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
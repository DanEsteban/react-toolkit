import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  TablePagination,
  IconButton, // Importar TablePagination
} from '@mui/material';
import { Pencil, Plus as PlusIcon, Trash } from '@phosphor-icons/react';
import { useGetAccountingPlan, useCreateAccountingPlan, useUpdateAccountingPlan, useDeleteAccountingPlan } from '@/api/accounting_plan/accountRequest';
import { AccountingPlanRequestType, AccountingPlanResponseType } from '@/api/accounting_plan/account.types';

export function Page(): React.JSX.Element {
  return (
    <Box sx={{ p: 4 }}>
      <PlanCuentasContable />
    </Box>
  );
}

const validateCode = (code: string): boolean => {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(code);
};

const checkCodeIsRepetead = (code: string, accounts: AccountingPlanResponseType[]): boolean => {
  const currentCode = code.split('.');
  const isRepeated = accounts.some((account) => {
    const accountCode = account.code.split('.');

    if(accountCode.length === 1 && currentCode.length === 1 && accountCode[0] === currentCode[0]) {
      return true;
    }

    if(accountCode.length === 2 && currentCode.length === 1 && accountCode[0] === currentCode[0]) {
      return true;
    }

    if(accountCode.length === 3 && currentCode.length === 3 && accountCode[2] === currentCode[2]) {
      return true;
    }

    if(accountCode.length === 4 && currentCode.length === 3 && accountCode[2] === currentCode[2]) {
      return true;
    }

    return false;
  });
  return isRepeated;
}

const PlanCuentasContable: React.FC = () => {
  const [nuevaCuenta, setNuevaCuenta] = useState<AccountingPlanRequestType>({ code: '', name: '' });
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [editingAccountCode, setEditingAccountCode] = useState<string | null>(null);
  const [editingAccountName, setEditingAccountName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [page, setPage] = useState(0);  // El índice de página empieza en 0
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Cantidad de filas por página

  // Obtener datos paginados
  const { data: cuentas, isLoading, isError, refetch } = useGetAccountingPlan(page + 1, rowsPerPage);  // La paginación del backend comienza en 1

  const createAccountingPlan = useCreateAccountingPlan();
  const updateAccountingPlan = useUpdateAccountingPlan();
  const deleteAccountingPlan = useDeleteAccountingPlan();

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Resetear a la primera página
  };

  const agregarCuenta = async () => {
    if (!validateCode(nuevaCuenta.code)) {
      setError('El código solo debe contener números y puntos.');
      setNuevaCuenta((prev) => ({ ...prev, code: '' }));
      return;
    }

    if (nuevaCuenta.code && nuevaCuenta.name) {
      const codigoExistente = cuentas?.data.some((cuenta: AccountingPlanResponseType) => cuenta.code === nuevaCuenta.code);

      if (codigoExistente) {
        setError('El código de cuenta ya existe. Por favor, use un código diferente.');
        setNuevaCuenta((prev) => ({ ...prev, code: '' })); // Vaciar el campo de código
        return;
      }

      try {
        await createAccountingPlan.mutateAsync(nuevaCuenta);
        setNuevaCuenta({ code: '', name: '' });
        setSuccess('Cuenta agregada exitosamente.');
        refetch(); // Refetch para obtener las cuentas actualizadas
      } catch (error) {
        setError('Error al crear la nueva cuenta');
      }
    } else {
      setError('Por favor, ingrese tanto el código como el nombre de la cuenta.');
    }
  };

  const startEditingAccount = (account: AccountingPlanResponseType) => {
    setEditingAccountId(account.id);
    setEditingAccountCode(account.code);
    setEditingAccountName(account.name);
  };

  const cancelEditingAccount = () => {
    setEditingAccountId(null);
    setEditingAccountCode(null);
    setEditingAccountName(null);
  };

  const guardarCambiosCuenta = async () => {
    if (editingAccountCode === null || editingAccountName === null) return;

    if (!validateCode(editingAccountCode)) {
      setError('El código solo debe contener números y puntos.');
      return;
    }

    try {
      await updateAccountingPlan.mutateAsync({ id: editingAccountId!, data: { code: editingAccountCode, name: editingAccountName } });
      cancelEditingAccount();
      setSuccess('Cambios guardados exitosamente.');
      refetch();
    } catch (error) {
      setError('Error al actualizar la cuenta');
    }
  };

  const eliminarCuenta = async (account: AccountingPlanResponseType) => {
    try {
      await deleteAccountingPlan.mutateAsync(account.code);
      setSuccess('Cuenta eliminada exitosamente.');
      refetch();
    } catch (error) {
      setError('Error al eliminar la cuenta');
    }
  };

  const calcularNivel = (codigo: string): number => {
    return codigo.split('.').length - 1;
  };


  const renderCuenta = (cuenta: AccountingPlanResponseType) => {
    const isEditing = editingAccountId === cuenta.id;

    return (
      <TableRow key={cuenta.id}>
        <TableCell sx={{ paddingLeft: `${calcularNivel(cuenta.code) * 20}px` }}>
          {isEditing ? (
            <TextField
              value={editingAccountCode || ''}
              onChange={(e) => setEditingAccountCode(e.target.value)}
              variant="standard"
              fullWidth
              error={!!error}
            />
          ) : (
            <TextField
              value={cuenta.code}
              variant="standard"
              fullWidth
              onClick={() => startEditingAccount(cuenta)}
            />
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <TextField
              value={editingAccountName || ''}
              onChange={(e) => setEditingAccountName(e.target.value)}
              variant="standard"
              fullWidth
            />
          ) : (
            <TextField
              value={cuenta.name}
              variant="standard"
              fullWidth
              onClick={() => startEditingAccount(cuenta)}
            />
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <>
              <IconButton onClick={guardarCambiosCuenta}>
                <Pencil size={20} />
              </IconButton>
              <IconButton onClick={cancelEditingAccount}>
                <Trash size={20} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => startEditingAccount(cuenta)}>
                <Pencil size={20} />
              </IconButton>
              <IconButton onClick={() => eliminarCuenta(cuenta)}>
                <Trash size={20} />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
    );
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Error al cargar las cuentas</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>COMERCIAL CO, S.A.</Typography>
      <Typography variant="h5" gutterBottom>PLAN DE CUENTAS</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cuentas?.data.map(renderCuenta)}
          <TableRow>
            <TableCell>
              <TextField
                placeholder="Nuevo código"
                value={nuevaCuenta.code}
                onChange={(e) => setNuevaCuenta({ ...nuevaCuenta, code: e.target.value })}
                variant="standard"
                fullWidth
                error={!!error}
              />
            </TableCell>
            <TableCell>
              <TextField
                placeholder="Nuevo nombre"
                value={nuevaCuenta.name}
                onChange={(e) => setNuevaCuenta({ ...nuevaCuenta, name: e.target.value })}
                variant="standard"
                fullWidth
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        onClick={agregarCuenta}
        startIcon={<PlusIcon />}
        sx={{ mt: 2 }}
        disabled={createAccountingPlan.isLoading}
      >
        {createAccountingPlan.isLoading ? <CircularProgress size={24} /> : 'Agregar Cuenta'}
      </Button>

      {/* Controles de paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cuentas?.total || 0} // Asegúrate de que el backend devuelva el total
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Page;

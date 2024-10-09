import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAccounts, useAddAccount, useUpdateAccount } from '@/api/accounting_plan/accountRequest';

import { Account } from '@/api/accounting_plan/account.types';
import { CircularProgress} from '@mui/material';
// import InfiniteScroll from 'react-infinite-scroll-component';
import AccountForm from './accountForm';
import AccountsTable from './accountTable';


export function Page(): React.JSX.Element {
  const { data: accounts = [], isLoading, isError } = useAccounts(0, 10);
  const { mutate: addAccount } = useAddAccount();
  const { mutate: updateAccount } = useUpdateAccount();

  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Estado de edición
  const [editRow, setEditRow] = React.useState<string | null>(null);
  const [editedAccount, setEditedAccount] = React.useState<Partial<Account>>({});

  // Validación de cuentas
  const validateNewAccount = (newAccount: Account): boolean => {
    const { code } = newAccount;

    // Evitar guardar códigos que son solo un número sin un punto
    const rootCodeRegex = /^[0-9]+$/; // Detecta códigos como "1", "2", "3"
    if (rootCodeRegex.test(code)) {
      setValidationError('Las cuentas Padres! deben tener un punto. Ej: 1., 2., 3.');
      return false;
    }

    if (accounts.some(account => account.code === code)) {
      setValidationError(`Ya existe una cuenta con el código ${code}`);
      return false;
    }

    const codeParts = code.split('.').filter(Boolean);
    if (codeParts.length > 1) {
      for (let i = codeParts.length - 1; i > 0; i--) {
        const ancestorCode = codeParts.slice(0, i).join('.') + '.';
        if (!accounts.some(account => account.code === ancestorCode)) {
          setValidationError(`Falta la cuenta Padre: ${ancestorCode}`);
          return false;
        }
      }
    }

    setValidationError(null);
    return true;
  };

  const handleAddAccount = (newAccount: Account) => {
    if (!validateNewAccount(newAccount)) return;
    addAccount(newAccount);
  };

  const handleSaveEdit = (id: string, updatedAccount: Partial<Account>) => {
    updateAccount({ id, updatedAccount });
    setEditRow(null);
    setEditedAccount({});
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error al cargar las cuentas</Typography>;

  return (
    <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
      <Stack spacing={4}>
        <Typography variant="h4">Gestión de Cuentas</Typography>

        {/* Componente de Formulario */}
        <AccountForm onAddAccount={handleAddAccount} validationError={validationError} onValidationError={setValidationError}/>

        {/* Componente de Tabla */}
        <AccountsTable
          accounts={accounts}
          editRow={editRow}
          setEditRow={setEditRow}
          editedAccount={editedAccount}
          setEditedAccount={setEditedAccount}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditRow(null)}
        />
      </Stack>
    </Box>
  );
}
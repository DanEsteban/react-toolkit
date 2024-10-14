// AccountForm.tsx
import React from 'react';
import { Stack, TextField, Button } from '@mui/material';
import { Account } from '@/api/accounting_plan/account-types';


interface AccountFormProps {
     onAddAccount: (newAccount: Account) => void;
     onValidationError: (error: string | null) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onAddAccount, onValidationError }) => {
     const [newRow, setNewRow] = React.useState<Account>({ code: '', name: '', level: 0, parent_code: '' });

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;

          if (name === 'code') {
               const regex = /^[0-9.]*$/;
               if (!regex.test(value)) {
                    onValidationError('El código solo puede contener números y puntos. Ej: 1.1, 2.1.1');
                    
               } else {
                    onValidationError(null);

                    const codeParts = value.split('.').filter(Boolean);
                    const level = codeParts.length - 1;
                    const parent_code = level === 0 ? undefined  : codeParts.slice(0, codeParts.length - 1).join('.') + '.';

                    setNewRow({ ...newRow, code: value, level, parent_code });
               }
          } else if (name === 'name') {
               setNewRow({ ...newRow, name: value });
          }
     };

     const handleSubmit = () => {
          if (!newRow.code || !newRow.name) {
               onValidationError('Tanto el código como el nombre son requeridos');
               return; 
          }

          onValidationError(null); 
          onAddAccount(newRow);
          setNewRow({ code: '', name: '', level: 0 });
     };

     return (
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
               <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Agregar Cuenta
               </Button>
          </Stack>
     );
};

export default AccountForm;

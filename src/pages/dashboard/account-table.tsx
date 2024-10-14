// AccountsTable.tsx
import React, { useEffect, useRef } from 'react';
import {
     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Paper,
} from '@mui/material';
import { PencilSimple, FloppyDisk, XCircle, Trash } from '@phosphor-icons/react';
import { Account } from '@/api/accounting_plan/account-types';

interface AccountsTableProps {
     accounts: Account[];
     editRow: string | null;
     setEditRow: (id: string | null) => void;
     editedAccount: Partial<Account>;
     setEditedAccount: (account: Partial<Account>) => void;
     onSaveEdit: (id: string, updatedAccount: Partial<Account>) => void;
     onCancelEdit: () => void;
     onValidationError: (error: string | null) => void;
     onDeleteAccount: (id: string) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
     accounts,
     editRow,
     setEditRow,
     editedAccount,
     setEditedAccount,
     onSaveEdit,
     onCancelEdit,
     onValidationError,
     onDeleteAccount
}) => {
     // Referencia al campo "code" cuando esté en edición
     const codeInputRef = useRef<HTMLInputElement>(null);

     const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;

          if (name === 'code') {
               const regex = /^[0-9.]*$/;
               if (!regex.test(value)) {
                    onValidationError('El código solo puede contener números y puntos. Ej: 1.1, 2.1.1');
                    return;
               } else {
                    onValidationError(null);
               }
          }

          setEditedAccount({ ...editedAccount, [name]: value });
     };

     const handleEditClick = (account: Account) => {
          setEditRow(account.id?.toString() || null);
          setEditedAccount({
               code: account.code,
               name: account.name,
               level: account.level,
          });
     };

     const handleDeleteClick = (accountId: string) => {

          if (window.confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
               onDeleteAccount(accountId);
          }
     };

     //const isRootCode = (code: string) => /^[0-9]+\.$/.test(code);

     useEffect(() => {
          if (editRow && codeInputRef.current) {
               codeInputRef.current.focus();
          }
     }, [editRow]);

     return (
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
                         {accounts.length > 0 ? (
                              accounts.map((account: Account) => (
                                   <TableRow key={account.id}>
                                        {editRow === account.id?.toString() ? (
                                             <>
                                                  <TableCell>
                                                       <TextField
                                                            name="code"
                                                            value={editedAccount.code || ''}
                                                            onChange={handleEditInputChange}
                                                            variant="outlined"
                                                            size="small"
                                                            inputRef={codeInputRef}
                                                       // disabled={isRootCode(account.code)}
                                                       />
                                                  </TableCell>
                                                  <TableCell>
                                                       <TextField
                                                            name="name"
                                                            value={editedAccount.name || ''}
                                                            onChange={handleEditInputChange}
                                                            variant="outlined"
                                                            size="small"
                                                       />
                                                  </TableCell>
                                                  <TableCell>
                                                       <Button onClick={() => onSaveEdit(account.id?.toString()!, editedAccount)}>
                                                            <FloppyDisk color="green" size={20} />
                                                       </Button>
                                                       <Button onClick={onCancelEdit}><XCircle color="gray" size={20} /></Button>
                                                  </TableCell>
                                             </>
                                        ) : (
                                             <>
                                                  <TableCell>{account.code}</TableCell>
                                                  <TableCell>{account.name}</TableCell>
                                                  <TableCell>
                                                       <Button onClick={() => handleEditClick(account)}>
                                                            <PencilSimple color="blue" size={20} />
                                                       </Button>
                                                       <Button onClick={() => handleDeleteClick(account.id?.toString()!)}>
                                                            <Trash color="red" size={20} />
                                                       </Button>
                                                  </TableCell>
                                             </>
                                        )}
                                   </TableRow>
                              ))
                         ) : (
                              <TableRow>
                                   <TableCell colSpan={3} align="center">
                                        No hay datos disponibles
                                   </TableCell>
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
          </TableContainer>
     );
};

export default AccountsTable;

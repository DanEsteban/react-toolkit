// AccountsTable.tsx
import React from 'react';
import {
     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Paper,
} from '@mui/material';
import { PencilSimple, FloppyDisk, XCircle, Trash } from '@phosphor-icons/react';
import { Account } from '@/api/accounting_plan/account.types';

interface AccountsTableProps {
     accounts: Account[];
     editRow: string | null;
     setEditRow: (id: string | null) => void;
     editedAccount: Partial<Account>;
     setEditedAccount: (account: Partial<Account>) => void;
     onSaveEdit: (id: string, updatedAccount: Partial<Account>) => void;
     onCancelEdit: () => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
     accounts,
     editRow,
     setEditRow,
     editedAccount,
     setEditedAccount,
     onSaveEdit,
     onCancelEdit,
}) => {

     const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
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
                                                       <Button onClick={() => handleEditClick(account)}>
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

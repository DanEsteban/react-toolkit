import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus, Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useAccountTree, useCreateAccount, useDeleteAccount, useUpdateAccount } from '@/api/accounting_plan/accountRequest';
import { useState } from 'react';
import { CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, TextField } from '@mui/material';

import { Account } from '@/api/accounting_plan/account.types';
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { Trash } from '@phosphor-icons/react';

export function Page(): React.JSX.Element {
  const { data: accounts, error, isLoading } = useAccountTree();
  // const createAccountMutation = useCreateAccount();
  // const deleteAccountMutation = useDeleteAccount();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{ name: string; code: string; parentId?: number }>({
    name: '',
    code: '',
    parentId: undefined,
  });

  const [openAccounts, setOpenAccounts] = useState<{ [key: number]: boolean }>({});

  // const handleCreateAccount = async () => {
  //     await createAccountMutation.mutateAsync(formData);
  //     setFormData({ name: '', code: '', parentId: undefined });
  //     setDialogOpen(false);
  // };

  // const handleDeleteAccount = (id: number) => {
  //     deleteAccountMutation.mutate(id);
  // };

  // const handleToggle = (id: number) => {
  //     setOpenAccounts((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  // const renderTree = (node: Account) => (
  //   <div key={node.id}>
  //       <ListItem onClick={() => handleToggle(node.id)}>
  //           {openAccounts[node.id] ? (
  //               <CaretDown size={20} />
  //           ) : (
  //               <CaretRight size={20} />
  //           )}
  //           <ListItemText primary={node.name} />
  //           <Button onClick={(e) => { e.stopPropagation(); handleDeleteAccount(node.id); }}>
  //               <Trash size={16} />
  //           </Button>
  //       </ListItem>
  //       <Collapse in={openAccounts[node.id]} timeout="auto" unmountOnExit>
  //           <List component="div" disablePadding>
  //               {Array.isArray(node.children) && node.children.map(renderTree)}
  //           </List>
  //       </Collapse>
  //   </div>
  // );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error al cargar las cuentas</Typography>;
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
              <Typography variant="h4">Plan de Cuentas</Typography>
            </Box>
            <div>
              <Button startIcon={<PlusIcon />} variant="contained">
                Action
              </Button>
            </div>
          </Stack>
          <>
            <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                <Plus size={20} /> Crear Cuenta
            </Button>
            {/* <List>
                {accounts && accounts.map(renderTree)}
            </List> */}

            {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Crear Nueva Cuenta</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Código"
                        fullWidth
                        variant="outlined"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="ID del Padre (opcional)"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={formData.parentId || ''}
                        onChange={(e) => setFormData({ ...formData, parentId: Number(e.target.value) || undefined })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleCreateAccount} color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
        
        </Stack>
      </Box>
    </React.Fragment>
  );
}

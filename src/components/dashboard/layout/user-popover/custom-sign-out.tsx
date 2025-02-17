'use client';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useLogoutUser } from '@/api/user-request';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/state/slices/authSlice';
import { useQueryClient } from 'react-query';
import { resetEmpresaState } from '@/state/slices/empresaSlice';

export function CustomSignOut(): React.JSX.Element {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync: logoutUser } = useLogoutUser();
  const queryClient = useQueryClient();
  
  const handleSignOut = async () => {
    try {
      
      //const { error } = await authClient.signOut();
      // if (error) {
      //   logger.error('Sign out error', error);
      //   toast.error('Something went wrong, unable to sign out');
      //   return;
      // }

      await logoutUser();
      dispatch(logout());
      dispatch(resetEmpresaState());
      queryClient.clear();
      navigate('/login');
      //window.location.reload(); 


    } catch (err) {
      logger.error('Sign out error', err);
      toast.error('Something went wrong, unable to sign out');
    }
  };

  return (
    <MenuItem component="div" onClick={handleSignOut} sx={{ justifyContent: 'center' }}>
      Sign out
    </MenuItem>
  );
}

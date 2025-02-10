'use client';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { logger } from '@/lib/default-logger';
import { useLogoutUser } from '@/api/user-request';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/state/actions/authActions';
// import { logout } from '@/state/slices/authSlice';

export function CustomSignOut(): React.JSX.Element {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync: logoutUser } = useLogoutUser();

  const handleSignOut = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate('/login');

    } catch (err: any) {
      logger.error('Sign out error', err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error al cerrar sesión: ${err.response.data.message}`);
      } else {
        alert('Algo salió mal. No se pudo cerrar la sesión.');
      }
    }
  };

  return (
    <MenuItem component="div" onClick={handleSignOut} sx={{ justifyContent: 'center' }}>
      Cerrar Sesión
    </MenuItem>
  );
}

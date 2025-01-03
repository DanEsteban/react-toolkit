import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';


export function Page(): React.JSX.Element {
  const location = useLocation();
  const empresa = location.state?.empresa;
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
              <Typography variant="h4">Dashboard</Typography>
            </Box>
            {empresa ? (
                <div>
                    <p><strong>Código:</strong> {empresa.codigo}</p>
                    <p><strong>Nombre:</strong> {empresa.nombre}</p>
                    <p><strong>RUC:</strong> {empresa.ruc}</p>
                </div>
            ) : (
                <p>No se seleccionó ninguna empresa.</p>
            )}
          </Stack>
        </Stack>
      </Box>
    </React.Fragment>
  );
}

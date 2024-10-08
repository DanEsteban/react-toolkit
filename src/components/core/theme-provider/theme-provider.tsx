'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';

import { Rtl } from './rtl';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {

  const theme = createTheme({
    primaryColor: 'neonBlue',
    colorScheme: 'light',
    direction: 'ltr',
  });

  return (
    <CssVarsProvider defaultColorScheme='light' defaultMode='light' theme={theme}>
      {/* <Helmet>
        <meta content={settings.colorScheme} name="color-scheme" />
      </Helmet> */}
      <CssBaseline />
      <Rtl direction="ltr">{children}</Rtl>
    </CssVarsProvider>
  );
}

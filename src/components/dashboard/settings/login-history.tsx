import * as React from 'react';

import { Avatar, Box, Card, CardContent, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { Timer as TimerIcon } from '@phosphor-icons/react/dist/ssr/Timer';
import { LoginHistoryItem } from '@/api/security/login-history-types';
import { formatLoginDate } from '@/utils/formatLoginDate';

interface LoginHistoryProps {
     logins: LoginHistoryItem[];
     total: number;
     page: number;
     rowsPerPage: number;
     onPageChange: (event: unknown, newPage: number) => void;
     onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}



export default function LoginHistory({
     logins,
     total,
     page,
     rowsPerPage,
     onPageChange,
     onRowsPerPageChange,
}: LoginHistoryProps): React.JSX.Element {

     return (
          <Card>
               <CardHeader
                    avatar={
                         <Avatar>
                              <TimerIcon fontSize="var(--Icon-fontSize)" />
                         </Avatar>
                    }
                    title="Historial de Acceso"
               />
               <CardContent>
                    <Paper variant="outlined" sx={{ maxHeight: 700, overflow: 'auto' }}>
                         <TableContainer>
                              <Table stickyHeader>
                                   <TableHead>
                                        <TableRow>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Usuario</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Fecha y Hora</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>IP</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Ubicacion</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Navegador/SO</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Dispositivo</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody>
                                        {logins.map((login) => (
                                             <TableRow key={login.id}>
                                                  {/* <TableCell>
                                                       <Box display="flex" flexDirection="column">
                                                            <Typography variant="subtitle2">{login.userName}</Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                            {formatLoginDate(login.timestamp)}                                                            </Typography>
                                                       </Box>
                                                  </TableCell> */}
                                                  <TableCell>{login.userName}</TableCell>
                                                  <TableCell>{formatLoginDate(login.timestamp)}</TableCell>
                                                  <TableCell>{login.ip}</TableCell>
                                                  <TableCell>{login.location}</TableCell>
                                                  <TableCell>{login.browser}, {login.os}</TableCell>
                                                  <TableCell>{login.deviceType}</TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </TableContainer>
                         <TablePagination
                              component="div"
                              count={total}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              onPageChange={onPageChange}
                              onRowsPerPageChange={onRowsPerPageChange}
                              rowsPerPageOptions={[5, 10, 25]} // Opciones estándar
                         />
                    </Paper>
               </CardContent>
          </Card>
     );
}
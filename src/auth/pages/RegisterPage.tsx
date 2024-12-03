import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUser } from '../../state/slices/authSlice';
import { useCreateUser } from '../../api/user-request';
import { Card, CardContent, CardHeader, FormControl, InputLabel, OutlinedInput, Stack } from '@mui/material';

// function Copyright(props: any) {
//      return (
//           <Typography variant="body2" color="text.secondary" align="center" {...props}>
//                {'Copyright ©  VisualJob '}
//                {new Date().getFullYear()}
//                {'.'}
//           </Typography>
//      );
// }

export default function RegisterPage() {

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const createUser = useCreateUser();

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          try {
               event.preventDefault();
               const data = new FormData(event.currentTarget);
               const name = data.get('name') as string;
               const lastname = data.get('lastname') as string;
               const email = data.get('email') as string;
               const password = data.get('password') as string;
               const password2 = data.get('password2') as string;
               const validPassword = password && password2 && validatePassword(password, password2)
               const role = 'USER';
               const active = true;

               if(validPassword){
                    const response = await createUser.mutateAsync({email, name, lastname, password, role, active});
                    localStorage.setItem("token", response.data.tokens);
                    console.log('Create successful:', response.data);
                    dispatch(setUser({
                         id: response.data.id,
                         email: response.data.email,
                         name: response.data.name,
                         lastname: response.data.lastname,
                         role: response.data.role,
                    }));
                    // dispatch(setAuthenticated({ isAuthenticated: true }));
               
                    navigate('/auth/empresa');
               }
          } catch (error) {
               console.log(error);
          }    
     };

     const validatePassword = (password: string, confirmationPassword : string): boolean =>{
          return password === confirmationPassword 
     }

     return (
          <Stack spacing={4}>
               <Card>
                    <CardHeader
                         subheader={
                              <Typography color="text.secondary" variant="body2">
                                   Ya tiene una cuenta? <Link href="/auth/login" variant="subtitle2">Iniciar Sesión</Link>
                              </Typography>
                         }
                         title="Registrarse"
                    />
                    <CardContent>
                         <form onSubmit={handleSubmit}>
                              <Stack spacing={2}>
                                   <FormControl>
                                        <InputLabel>Nombre</InputLabel>
                                        <OutlinedInput name="name" />
                                   </FormControl>
                                   <FormControl>
                                        <InputLabel>Apellido</InputLabel>
                                        <OutlinedInput name="lastname" />
                                   </FormControl>
                                   <FormControl>
                                        <InputLabel>Correo</InputLabel>
                                        <OutlinedInput name="email" type="email" />
                                   </FormControl>
                                   <FormControl>
                                        <InputLabel>Contraseña</InputLabel>
                                        <OutlinedInput name="password" type="password" />
                                   </FormControl>
                                   <FormControl>
                                        <InputLabel>Confirmar Contraseña</InputLabel>
                                        <OutlinedInput name="password2" type="password" />
                                   </FormControl>
                                   {/* <div>
                                        <FormControlLabel
                                             control={<Checkbox name="terms" />}
                                             label={
                                                  <React.Fragment>
                                                       I have read the <Link>terms and conditions</Link>
                                                  </React.Fragment>
                                             }
                                        />
                                   </div> */}
                                   <Button type="submit" variant="contained">
                                        Registrarse
                                   </Button>
                              </Stack>
                         </form>
                    </CardContent>
               </Card>
          </Stack>
     );
}
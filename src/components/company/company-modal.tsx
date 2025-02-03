import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     Typography,
     Box,
     IconButton,
     TextField,
     Button,
     DialogActions,
     Stack,
     Avatar,
     FormControl,
     InputLabel,
     FormHelperText,
     OutlinedInput
} from '@mui/material';
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { EmpresaRequestType } from '@/api/empresas/empresa-types';
import { Controller, UseFormReturn } from 'react-hook-form';
import { EmpresaForm } from './company-form';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';

interface CreateEmpresaDialogProps {
     open: boolean;
     onClose: () => void;
     form: UseFormReturn<EmpresaRequestType>;
     preview: string | null;
     onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
     onSubmit: (data: EmpresaRequestType) => Promise<void>;
}

export const CreateEmpresaDialog: React.FC<CreateEmpresaDialogProps> = ({
     open,
     onClose,
     form,
     preview,
     onFileChange,
     onSubmit,
}) => {
     const {
          register,
          handleSubmit,
          control,
          formState: { errors },
          watch,
          trigger
     } = form;

     const [avatarSrc, setAvatarSrc] = React.useState("defaultValues.logo");
     

     const rucValue = watch("ruc");
     const telefonoValue = watch("telefono");

     return (
          <Dialog
               open={open}
               onClose={onClose}
               maxWidth="sm"
               fullWidth
               scroll="paper"
          >
               <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>
                         <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="h6">Crear Empresa</Typography>
                              <IconButton onClick={onClose}>
                                   <XIcon />
                              </IconButton>
                         </Box>
                    </DialogTitle>
                    <DialogContent>
                         {/* <Box sx={{ disp b  lay: "flex", flexDirection: "column", gap: 2 }}>
                              <TextField
                                   label="Codigo"
                                   {...register("codigo")}
                                   fullWidth
                                   size="small"
                                   error={!!errors.codigo}
                                   helperText={errors.codigo?.message}
                              />
                              <TextField
                                   label="RUC"
                                   {...register("ruc", {
                                        validate: {
                                             isNotEmpty: (value) =>
                                                  value.trim() !== "" ||
                                                  "El RUC es obligatorio y solo puede contener números!",
                                             isExactLength: (value) =>
                                                  value.length === 13 ||
                                                  "El RUC debe tener exactamente 13 dígitos",
                                        },
                                   })}
                                   value={rucValue}
                                   onChange={(e) => {
                                        const value = e.target.value
                                             .replace(/[^0-9]/g, "")
                                             .slice(0, 13);
                                        form.setValue("ruc", value, { shouldValidate: true });
                                   }}
                                   fullWidth
                                   size="small"
                                   error={!!errors.ruc}
                                   helperText={errors.ruc?.message}
                              />
                              <TextField
                                   label="Nombre"
                                   {...register("nombre", {
                                        required: "El nombre es obligatorio.",
                                   })}
                                   fullWidth
                                   size="small"
                                   error={!!errors.nombre}
                                   helperText={errors.nombre?.message}
                              />
                              <TextField
                                   label="Correo"
                                   {...register("correo", {
                                        pattern: {
                                             value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                             message: "El correo no tiene un formato válido",
                                        },
                                   })}
                                   fullWidth
                                   size="small"
                                   error={!!errors.correo}
                                   helperText={errors.correo?.message}
                              />
                              <TextField
                                   label="Teléfono"
                                   {...register("telefono", {
                                        validate: {
                                             isNotEmpty: (value) =>
                                                  value.trim() !== "" ||
                                                  "El teléfono solo puede contener números!",
                                             isExactLength: (value) =>
                                                  value.length === 10 ||
                                                  "El teléfono solo puede tener 10 dígitos",
                                        },
                                   })}
                                   value={telefonoValue}
                                   onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                        form.setValue("telefono", value, { shouldValidate: true });
                                   }}
                                   fullWidth
                                   size="small"
                                   error={!!errors.telefono}
                                   helperText={errors.telefono?.message}
                              />
                              <TextField
                                   label="Direccion"
                                   {...register("direccion")}
                                   fullWidth
                                   size="small"
                              />
                              <Controller
                                   name="logo"
                                   control={control}
                                   render={({ field }) => (
                                        <div>
                                             <label htmlFor="logo-upload">Logo</label>
                                             <br />
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  id="logo-upload"
                                                  onChange={onFileChange}
                                             />
                                             {preview && (
                                                  <img
                                                       src={preview}
                                                       alt="Vista previa del logo"
                                                       style={{ maxWidth: "100%", marginTop: "10px" }}
                                                  />
                                             )}
                                        </div>
                                   )}
                              />
                              
                         </Box> */}
                          <Stack spacing={3}>
                              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                   <Box
                                        sx={{
                                             border: '1px dashed var(--mui-palette-divider)',
                                             borderRadius: '50%',
                                             display: 'inline-flex',
                                             p: '4px',
                                        }}
                                   >
                                        <Box sx={{ borderRadius: 'inherit', position: 'relative' }}>
                                             <Box
                                                  sx={{
                                                       alignItems: 'center',
                                                       bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                       borderRadius: 'inherit',
                                                       bottom: 0,
                                                       color: 'var(--mui-palette-common-white)',
                                                       cursor: 'pointer',
                                                       display: 'flex',
                                                       justifyContent: 'center',
                                                       left: 0,
                                                       opacity: 0,
                                                       position: 'absolute',
                                                       right: 0,
                                                       top: 0,
                                                       zIndex: 1,
                                                       '&:hover': { opacity: 1 },
                                                  }}
                                             >
                                                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                       <CameraIcon fontSize="var(--icon-fontSize-md)" />
                                                       <Typography color="inherit" variant="subtitle2">
                                                            Select
                                                       </Typography>
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{
                                                                 position: 'absolute',
                                                                 width: '100%',
                                                                 height: '100%',
                                                                 top: 0,
                                                                 left: 0,
                                                                 opacity: 0,
                                                                 cursor: 'pointer',
                                                            }}
                                                            onChange={(e) => {
                                                                 if (e.target.files && e.target.files[0]) {
                                                                      const reader = new FileReader();
                                                                      reader.onload = (event) => {
                                                                           setAvatarSrc(event.target?.result as string); // Update avatar source
                                                                      };
                                                                      reader.readAsDataURL(e.target.files[0]);
                                                                 }
                                                            }}
                                                       />
                                                  </Stack>
                                             </Box>
                                             <Avatar src={avatarSrc} sx={{ '--Avatar-size': '100px' }} />
                                        </Box>
                                   </Box>
                                   <Button color="secondary" size="small">
                                        Remove
                                   </Button>
                              </Stack>
                              <Stack spacing={2}>
                                   <FormControl error={!!errors.codigo}>
                                        <InputLabel>Codigo</InputLabel>
                                        <Controller
                                             name="codigo"
                                             control={control}
                                             rules={{
                                                  required: 'El Código es obligatorio', // Add required validation rule
                                             }}
                                             render={({ field }) => <OutlinedInput {...field} />}
                                        />
                                        <FormHelperText>{errors.codigo?.message}</FormHelperText>
                                   </FormControl>

                                   <FormControl error={!!errors.ruc}>
                                        <InputLabel>Ruc</InputLabel>
                                        <Controller
                                             name="ruc"
                                             control={control}
                                             rules={{
                                                  required: 'El teléfono es obligatorio', // Required validation
                                                  validate: {
                                                       isNotEmpty: (value) =>
                                                            value.trim() !== '' || 'El teléfono solo puede contener números!',
                                                       isExactLength: (value) =>
                                                            value.length === 10 || 'El teléfono solo puede tener 10 dígitos',
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <OutlinedInput
                                                       {...field}
                                                       placeholder="e.g 1723456789001"
                                                       value={field.value || ''} // Ensure it doesn't show "undefined"
                                                       onChange={(e) => {
                                                            const value = e.target.value
                                                                 .replace(/[^0-9]/g, '') // Allow only numbers
                                                                 .slice(0, 13); // Limit to 13 characters
                                                            field.onChange(value);
                                                            trigger('ruc');
                                                       }}
                                                  />
                                             )}
                                        />
                                        <FormHelperText>{errors.ruc?.message}</FormHelperText>
                                   </FormControl>

                                   <FormControl error={!!errors.nombre}>
                                        <InputLabel>Nombre</InputLabel>
                                        <Controller
                                             name="nombre"
                                             control={control}
                                             rules={{
                                                  required: 'El Nombre es obligatorio'
                                             }}
                                             render={({ field }) => <OutlinedInput {...field} placeholder="e.g Company Name" />}
                                        />
                                        <FormHelperText>{errors.nombre?.message}</FormHelperText>
                                   </FormControl>
                                   <FormControl error={!!errors.correo}>
                                        <InputLabel>Correo</InputLabel>
                                        <Controller
                                             name="correo"
                                             control={control}
                                             rules={{
                                                  required: 'El correo es obligatorio', // Required validation
                                                  pattern: {
                                                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                       message: 'Ingrese un correo válido', // Error message if email is invalid
                                                  },
                                             }}
                                             render={({ field }) => <OutlinedInput {...field} placeholder="e.g email@example.com" />}
                                        />
                                        <FormHelperText>{errors.correo?.message}</FormHelperText>
                                   </FormControl>

                                   <Stack direction="row" spacing={2}>
                                        <FormControl sx={{ flex: '1 1 auto' }} error={!!errors.telefono}>
                                             <InputLabel>Telefono</InputLabel>
                                             <Controller
                                                  name="telefono"
                                                  control={control}
                                                  rules={{
                                                       required: 'El teléfono es obligatorio',
                                                       validate: {
                                                            isNotEmpty: (value) =>
                                                                 value.trim() !== '' || 'El teléfono solo puede contener números!',
                                                            isExactLength: (value) =>
                                                                 value.length === 10 || 'El teléfono solo puede tener 10 dígitos',
                                                       },
                                                  }}
                                                  render={({ field }) => (
                                                       <OutlinedInput
                                                            {...field}
                                                            placeholder="e.g 0989890946"
                                                            value={field.value || ''} // Ensure it doesn't show "undefined"
                                                            onChange={(e) => {
                                                                 const value = e.target.value
                                                                      .replace(/[^0-9]/g, '') // Allow only numbers
                                                                      .slice(0, 10); // Limit to 13 characters
                                                                 field.onChange(value);
                                                                 trigger('telefono');
                                                            }}
                                                       />
                                                  )}
                                             />
                                             <FormHelperText>{errors.telefono?.message}</FormHelperText>
                                        </FormControl>
                                   </Stack>
                                   <FormControl error={!!errors.direccion}>
                                        <InputLabel>Direccion</InputLabel>
                                        <Controller
                                             name="direccion"
                                             control={control}
                                             rules={{
                                                  required: 'La dirección es obligatoria',
                                                  maxLength: {
                                                       value: 400,
                                                       message: 'La dirección no puede tener más de 400 caracteres',
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <OutlinedInput
                                                       {...field}
                                                       placeholder="Ingrese la direccion de su empresa..."
                                                       multiline
                                                       rows={4}
                                                  />
                                             )}
                                        />
                                        <FormHelperText>
                                             {`${watch('direccion', '').length}/400 characters`} {/* Dynamically track the value */}                                        
                                        </FormHelperText>
                                        <FormHelperText>{errors.direccion?.message}</FormHelperText> {/* Shows error if validation fails */}
                                   </FormControl>
                              </Stack>
                         </Stack>
                    </DialogContent>
                    <DialogActions>
                         <Box display="flex" justifyContent="flex-end" p={2}>
                              <Button variant="contained" color="primary" type="submit">
                                   Guardar
                              </Button>
                         </Box>
                    </DialogActions>
               </form>
          </Dialog>
     );
};

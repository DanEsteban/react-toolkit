import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Input,
    FormControl,
    InputLabel
} from '@mui/material';
import { EmpresaRequestType, EmpresaResponseType } from '@/api/empresas/empresa-types';

interface EmpresaModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (empresa: EmpresaRequestType) => void;
    empresa: EmpresaResponseType | null;
}

const EmpresaModal: React.FC<EmpresaModalProps> = ({
    open,
    onClose,
    onSave,
    empresa
}) => {
    const [formData, setFormData] = React.useState<EmpresaRequestType>({
        codigo: empresa?.codigo || '',
        ruc: empresa?.ruc || '',
        nombre: empresa?.nombre || '',
        correo: empresa?.correo || '',
        telefono: empresa?.telefono || '',
        direccion: empresa?.direccion || '',
        logo: null,
        ...(empresa?.id ? { id: empresa.id } : {})
    });

    React.useEffect(() => {
        setFormData(current => ({
            ...current,
            codigo: empresa?.codigo || current.codigo,
            ruc: empresa?.ruc || current.ruc,
            nombre: empresa?.nombre || current.nombre,
            correo: empresa?.correo || current.correo,
            telefono: empresa?.telefono || current.telefono,
            direccion: empresa?.direccion || current.direccion,
            logo: null,
            ...(empresa?.id ? { id: empresa.id } : {})
        }));
    }, [empresa]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(current => ({ ...current, [name]: value }));
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFormData(current => ({ ...current, logo: files[0] }));
        }
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{empresa ? 'Editar Empresa' : 'Agregar Empresa'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Código"
                    name="codigo"
                    fullWidth
                    margin="normal"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="RUC"
                    name="ruc"
                    fullWidth
                    margin="normal"
                    value={formData.ruc}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Nombre"
                    name="nombre"
                    fullWidth
                    margin="normal"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Correo"
                    name="correo"
                    fullWidth
                    margin="normal"
                    value={formData.correo}
                    onChange={handleChange}
                    type="email"
                />
                <TextField
                    label="Teléfono"
                    name="telefono"
                    fullWidth
                    margin="normal"
                    value={formData.telefono}
                    onChange={handleChange}
                />
                <TextField
                    label="Dirección"
                    name="direccion"
                    fullWidth
                    margin="normal"
                    value={formData.direccion}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Logo</InputLabel>
                    <Input
                        type="file"
                        onChange={handleLogoChange}
                        inputProps={{ accept: 'image/*' }}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSubmit} color="primary">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmpresaModal;
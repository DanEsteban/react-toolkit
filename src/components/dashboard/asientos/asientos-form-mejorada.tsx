import React from 'react'

import { useCreateAsiento } from '@/api/asientos/asientos-request';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { paths } from '@/paths';
import { CreateAsientoDto } from '@/api/asientos/asientos-types';

export const AsientosFormMejorada = () => {
     const navigate = useNavigate();
     const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);

     const { mutate, isLoading } = useCreateAsiento(selectedEmpresa.id);

     const { 
          register, 
          handleSubmit, 
          formState: { errors } 
     } = useForm<CreateAsientoDto>();


     const onSubmit = (data: CreateAsientoDto) => {
          const payload = { ...data, selectedEmpresa.id }; // Nos aseguramos de enviar empresa_id también
          mutate(payload, {
               onSuccess: () => {
                    navigate(paths.dashboard.asientos.list(selectedEmpresa.id));
               },
          });
     };

     return (
          <form onSubmit={handleSubmit(onSubmit)}>
               {/* Ejemplo de campos */}
               <input
                    {...register('nro_asiento', { required: true })}
                    placeholder="Número de Asiento"
               />
               {errors.nro_asiento && <span>Este campo es requerido</span>}

               <input
                    {...register('codigo_transaccion', { required: true })}
                    placeholder="Código de Transacción"
               />
               {errors.codigo_transaccion && <span>Este campo es requerido</span>}

               <input
                    {...register('codigo_centro', { required: true })}
                    placeholder="Código de Centro"
               />
               {errors.codigo_centro && <span>Este campo es requerido</span>}

               {/* Si quieres, puedes mapear lineItems aquí como un array dinámico */}

               <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Crear Asiento'}
               </button>
          </form>
     );
}

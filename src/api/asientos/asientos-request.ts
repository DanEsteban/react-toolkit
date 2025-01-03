import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Asiento } from "./asientos-types";

// const getDatCentro = async () => {
//      const response = await http.get(`dat-centro`)
//      return response.data;
// }
// export const useAccounts = () => {
//      return useQuery<DatCentro[]>({
//           queryKey: ['dat-centro'],
//           queryFn: getDatCentro,
//           onError: (error) => {
//                console.error('Error al obtener las cuentas:', error);
//           }
//      });
// };

const getAsientos = async () => {
  const response = await http.get(`asientos`);
  return response.data;
};

export const useAsientos = () => {
  return useQuery<Asiento[]>({
    queryKey: ["asientos"],
    queryFn: getAsientos,
    onError: (error) => {
      console.error("Error al obtener los asientos:", error);
    },
  });
};

const getAsiento = async (id: number) => {
  const response = await http.get(`asientos/${id}`);
  return response.data;
};

export const useAsiento = (id: number) => {
  return useQuery<Asiento>({
    queryKey: ["asiento", id],
    queryFn: () => getAsiento(id),
    onError: (error) => {
      console.error("Error al obtener los asientos:", error);
    },
  });
};

const createAsiento = async (data: Asiento) => {
  //console.log(data)
  const response = await http.post("/asientos", data);
  return response.data;
};

export const useCreateAsiento = () => {
  const queryClient = useQueryClient();

  return useMutation(createAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);

      console.log("Asiento creado exitosamente");
    },
    onError: (error) => {
      console.error("Error al crear el asiento:", error);
    },
  });
};

const updateAsiento = async ({ id, data }: { id: number; data: Asiento }) => {
  const response = await http.put(`/asientos/${id}`, data);
  return response.data;
};

export const useUpdateAsiento = () => {
  const queryClient = useQueryClient();

  return useMutation(updateAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);

      console.log("Asiento actualizado exitosamente");
    },
    onError: (error) => {
      console.error("Error al actualizar el asiento:", error);
    },
  });
};

const deleteAsiento = async (id: number) => {
  const response = await http.delete(`asientos/${id}`);
  return response.data;
};

export const useDeleteAsiento = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);
      console.log("Asiento eliminado exitosamente");
    },
    onError: (error) => {
      console.error("Error al eliminar el asiento:", error);
    },
  });
};


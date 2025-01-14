import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Asiento } from "./asientos-types";

const getAsientos = async () => {
  const response = await http.get("asientos");
  return response.data;
};

export const useAsientos = () => {
  const queryClient = useQueryClient();
  return useQuery<Asiento[]>({
    queryKey: ["asientos"],
    queryFn: getAsientos,
    onSuccess: () => {
      queryClient.invalidateQueries(["asiento"]);
    },
    onError: (error) => {
      console.error("Error al obtener los asientos:", error);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

const getAsiento = async (id: number) => {
  const response = await http.get(`asientos/${id}`);
  return response.data;
};

export const useAsiento = (id: number) => {
  return useQuery<Asiento>({
    queryKey: ["asiento"],
    queryFn: () => getAsiento(id),
    onError: (error) => {
      console.error("Error al obtener los asientos:", error);
    },
    // This helps to refresh the page when fetching the data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale
    cacheTime: 0,
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

export const useUpdateAsiento = (
  onSuccessF: () => void,
  onErrorF: (error: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(updateAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);
      onSuccessF();

      console.log("Asiento actualizado exitosamente");
    },
    onError: (error) => {
      onErrorF(error);
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

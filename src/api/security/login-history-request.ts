import { useMutation, useQuery } from "react-query";
import http from "../http";
import { CreateLoginHistory } from "./login-history-types";

const saveLoginHistory = async (data: CreateLoginHistory) => {
     const response = await http.post('/login-history', data);
     return response.data;
};

export const useSaveLoginHistory = () => {
     return useMutation(saveLoginHistory);
};

const getAuthToken = () => {
     return localStorage.getItem('token');
};

const getLoginHistory = async () => {

     try {
          const token = getAuthToken();
          const response = await http.get("login-history", {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });
          console.log(response.data)
          return response.data;
     } catch (error) {

          throw error;
     }
};

export const useLoginHistory = () => {
     return useQuery(['login-history'], getLoginHistory);
};




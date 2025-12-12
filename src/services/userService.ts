import { apiClient } from "@/lib/apiClient"
import type { LoginForm } from "@/schemas/login"
import type { UserType } from "@/types/users"
import { useState } from "react"

export const useUserService = () => {
    const [loading, setLoading] = useState(false);

    const login = (data : LoginForm) => {
        setLoading(true);
        return apiClient.post("/stateless/login", data)
        .then((response) => {
            return response.data as {token : string, user : UserType, message : string};
        }).catch((error)=>{
            console.log("Ha habido un error al intentar hacer login ..", error)
            throw error;
        }).finally(()=>setLoading(false))
    }

    const logout = () => {
        setLoading(true);
        return apiClient.post("/stateless/logout")
        .then((response)=>{
            return response.data;
        }).finally(()=>setLoading(false))
    }
      function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const register = (data) => {
        setLoading(true);
        return apiClient.post("/register", data)
            .then((response)=> response.data as {message:string, data: {tenant_id : number, user: UserType, token: string}})
            .finally(()=>setLoading(false))
    }

    const resetPassword = (data) => {
        setLoading(true);
        return apiClient.post("/stateless/set-password", data)
            .then(response=> response.data as {message : string, user : UserType, tkn : string})
            .finally(()=>setLoading(false))
    }

    
    const forgotPassword = (data) => {
        setLoading(true);
        return apiClient.post("/forgot-password", data)
            .then(response=> response.data as {message : string, email : string})
            .finally(()=>setLoading(false))
    }

    const getUser = async () => {
        setLoading(true);
        return apiClient.get('user')
            .then((response)=> response.data as {user : UserType} )
            .finally(()=>setLoading(false))
    }

    return {login, getUser, logout, loading, register, resetPassword, forgotPassword}
}
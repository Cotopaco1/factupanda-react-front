import { apiClient } from "@/lib/apiClient"
import type { LoginForm } from "@/schemas/login"
import type { UserType } from "@/types/users"

export const useUserService = () => {
    // const {apiClient} = useApiClient();

    const login = (data : LoginForm) => {
        return apiClient.post("/stateless/login", data)
        .then((response) => {
            return response.data as {token : string, user : UserType, message : string};
        }).catch((error)=>{
            console.log("Ha habido un error al intentar hacer login ..", error)
            throw error;
        })
    }

    const getUser = () => {
        return apiClient.get('user')
            .then((response)=> response.data as {user : UserType} )
    }

    return {login, getUser}
}
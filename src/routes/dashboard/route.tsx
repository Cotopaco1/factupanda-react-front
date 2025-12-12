import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'
import { AppSidebar } from '../../components/app-sidebar'
import { useUserStore } from '@/stores/userStore'
import { useEffect, useState } from 'react'
import { useUserService } from '@/services/userService'
import { DialogLoading } from '@/components/DialogLoading'
import { PasswordSetupAlertBanner } from '@/components/banners/PasswordSetupAlertBanner'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useUserStore((state)=> state.user);
  const isLogin = useUserStore((state)=> state.isLogin);
  const setUser = useUserStore((state)=> state.setUser);
  const setToken = useUserStore((state)=> state.setToken);
  const setIsLogin = useUserStore((state)=> state.setIsLogin);
  const {getUser, loading} = useUserService();
  
  useEffect(() => {
    const token = localStorage.getItem('tkn');
    if(user === undefined && token){
      getUser()
      .then((data)=> {
        setIsLogin(true);
        setUser(data.user);
        setToken(token);
      })
      .catch(()=>console.log("User is not authenticated"))
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      {isLogin && !user?.password_setup && (
        <PasswordSetupAlertBanner/>
      )}
      {loading && (
        <DialogLoading/>
      )}
      <main className='p-4 w-full'>
        <SidebarTrigger />
        <Outlet/>
      </main>
    </SidebarProvider>
)
}

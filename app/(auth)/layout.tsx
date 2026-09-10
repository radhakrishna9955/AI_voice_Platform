import { isAuthenticated } from '@/lib/actions/auth.actions';
import { redirect } from 'next/dist/client/components/navigation';
import React, { ReactNode } from 'react'

const Authlayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if(isUserAuthenticated){
        redirect('/');
    }
  return (
    <div>{ children }</div>
  )
}

export default Authlayout
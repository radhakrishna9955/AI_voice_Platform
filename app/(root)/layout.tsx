import Header from '@/components/Header'
import { isAuthenticated } from '@/lib/actions/auth.actions'
import { redirect } from 'next/dist/client/components/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if(!isUserAuthenticated){
        redirect('/sign-in');
    }
    
  return (
    <div className='root-layout'>
        <nav>
            <div className='flex'>
                <Link href="/" className='flex items-center gap-2'>
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className='text-primary-100'>InterviewIQ</h2>
                </Link>
                <div className='ml-180'>
                    <Header/>
                </div>
            </div>
            { children }
        </nav>
    </div>
  )
}

export default RootLayout
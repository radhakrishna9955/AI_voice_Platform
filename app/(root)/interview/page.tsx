import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
    <>
        <h3 className='mt-10 mb-10'>Interview Generation</h3>
        <Agent userName="John Doe" userId="123" type="generate" workflowId="1cb3698d-b3a0-40d7-8d82-3042a777461c" />
    </>
  )
}

export default page
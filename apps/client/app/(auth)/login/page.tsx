import LoginCard from '@/components/Auth/LoginCard';
import React, { useState } from 'react'

const Login = () => {
  
  return (
      <div className='max-w-5xl min-h-[80vh] m-auto px-4 py-1 grid grid-cols-1 md:grid-cols-2'>
          <div className='flex flex-col justify-center gap-y-4 p-2'>
              <div className='text-4xl font-semibold'>Automate across your teams</div>
              <div><p className='whitespace-pre-line text-slate-500'>{"Zapier Enterprise empowers everyone in your business to \n securely automate their work in minutes, not months—no coding \n required."}</p></div>
              <button className='p-2 rounded-md bg-blue-900 text-white font-semibold size-max'>Explore Zapier Enterprise</button>
          </div>
          <div className="flex items-center justify-center h-full w-full p-2">
            <LoginCard />
          </div>
      </div>
  )
}

export default Login;
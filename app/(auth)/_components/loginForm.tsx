"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect } from 'react'
import { loginAction } from '../_actions/authAction'
import { toast } from 'sonner'


const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, null)

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "You are Login successfully")
    }
    if (!state.success) {
      toast.error(state.message || "Login Faild")
    }

  }, [state])

  return (
    <div>
      <form action={action} className='space-y-4'>
        <Card className='space-y-4 p-5' >
          <Input name='email' type='email' placeholder='Enter Your Name' required></Input>
          <Input name='password' type='password' placeholder='Enter Your Password' required></Input>
          <Button type='submit'>
            {
              pending ? "Submitting...." : "Login"
            }
          </Button>
        </Card>
      </form>
    </div>
  )
}

export default LoginForm

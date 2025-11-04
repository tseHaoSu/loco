import React from 'react'

const Billing = () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plans & Billing</h1>
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground">
          Manage your subscription plans and billing information.
        </p>
      </div>
    </div>
  )
}

export default Billing

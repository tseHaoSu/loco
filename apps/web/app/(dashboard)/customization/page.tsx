import React from 'react'

const Customization = () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Widget Customization</h1>
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground">
          Customize your widget appearance and behavior.
        </p>
      </div>
    </div>
  )
}

export default Customization

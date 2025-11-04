import React from 'react'

const VoiceAssistant = () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Voice Assistant</h1>
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground">
          Configure and manage your AI voice assistant settings.
        </p>
      </div>
    </div>
  )
}

export default VoiceAssistant

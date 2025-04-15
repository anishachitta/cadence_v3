"use client"
import ConfigForm from "@/components/ConfigForm"
import { useRetellConfig } from "@/hooks/useRetellConfig"
import { Toaster } from "sonner"

export default function RetellCallerPage() {
  const { config, isLoading, validationError, saveConfig, resetConfig, hasConfig } = useRetellConfig()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-8 text-center">Retell Phone Caller</h1>

      {!hasConfig ? (
        <ConfigForm onConfigSaved={saveConfig} validationError={validationError} />
      ) : (
        <PhoneCallForm config={config!} onResetConfig={resetConfig} />
      )}
    </div>
  )
}

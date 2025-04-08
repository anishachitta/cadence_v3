"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { RetellConfig } from "@/types"
import { makePhoneCall } from "@/services/retellService"
import { Phone } from "lucide-react"

interface PhoneCallFormProps {
  config: RetellConfig
  onResetConfig: () => void
}

const PhoneCallForm = ({ config, onResetConfig }: PhoneCallFormProps) => {
  const [toNumber, setToNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!toNumber) {
      toast.error("Please enter a phone number to call")
      return
    }

    setIsLoading(true)
    try {
      const success = await makePhoneCall(toNumber)
      if (success) {
        toast.success(`Call initiated to ${toNumber}`)
        setToNumber("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while making the call")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Make a Phone Call</span>
          <Button variant="ghost" size="sm" onClick={onResetConfig}>
            Change Config
          </Button>
        </CardTitle>
        <CardDescription>Using number: {config.fromNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toNumber">To Phone Number</Label>
            <Input
              id="toNumber"
              type="text"
              placeholder="+15551234567"
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              "Initiating Call..."
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" /> Make Call
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 flex flex-col items-start">
        <p>Note: If you encounter issues with the Retell API, please check:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Your API key is valid and active</li>
          <li>The phone number is in E.164 format (e.g., +15551234567)</li>
          <li>Your agent ID is correct</li>
        </ul>
      </CardFooter>
    </Card>
  )
}

export default PhoneCallForm

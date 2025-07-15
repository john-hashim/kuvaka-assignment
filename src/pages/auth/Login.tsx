import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Shield, Loader2 } from "lucide-react"
import { commonService } from "@/api/services/common"
import { Country } from "@/types/common"
import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom"

type LoginStep = "credentials" | "otp"

 const Login: React.FC = () => {
  const [step, setStep] = useState<LoginStep>("credentials")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    execute: executeLogin,
    loading,
    error: serverError,
  } = useApi<Country[], []>(commonService.getCountryData)

  const { login } = useAuth()

  useEffect(() => {
    const loadContries = async () => {
        const data = await executeLogin()
        setCountries(data)

        const defaultCountry = data.find((country) => country.cca2 === "IN")
        if (defaultCountry) {
            setSelectedCountry(defaultCountry)
        }
    } 
    loadContries()
  }, [executeLogin])

  useEffect(() => {
        console.error("Failed to fetch countries:", serverError)
  }, [serverError])


  const getCountryCode = (country: Country) => {
    if (!country.idd?.root) return ""
    const suffix = country.idd.suffixes?.[0] || ""
    return `${country.idd.root}${suffix}`
  }

  const getFullPhoneNumber = () => {
    if (!selectedCountry || !phoneNumber) return ""
    return `${getCountryCode(selectedCountry)}${phoneNumber}`
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || !selectedCountry) return
    setIsLoading(true)

    // Simulating api call using new promise
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep("otp")
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    setIsLoading(true)
    const mockLogin = (): Promise<{ token: string }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ token: "mock_token_123" })
        }, 1500)
      })
    }
    const response = await mockLogin()
    login(response.token, true)
    setIsLoading(false)
    navigate('/chat')
  }

  const handleBackToCredentials = () => {
    setStep("credentials")
    setOtp("")
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <span className="font-medium">{getFullPhoneNumber()}</span>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">
                  Enter verification code
                </Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col mt-4 space-y-3">
              <Button type="submit" className="w-full" disabled={otp.length !== 6 || isLoading}>
                {isLoading ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={handleBackToCredentials}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSendOTP}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              {loading ? (
                <div className="flex items-center justify-center h-10 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading countries...</span>
                </div>
              ) : (
                <Select
                  value={selectedCountry?.cca2 || ""}
                  onValueChange={(value) => {
                    const country = countries.find((c) => c.cca2 === value)
                    setSelectedCountry(country || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country">
                      {selectedCountry && (
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedCountry.flags.png || "/placeholder.svg"}
                            alt={selectedCountry.flags.alt}
                            className="w-5 h-4 object-cover rounded-sm"
                          />
                          <span>{selectedCountry.name.common}</span>
                          <span className="text-muted-foreground">({getCountryCode(selectedCountry)})</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country.cca2} value={country.cca2}>
                        <div className="flex items-center gap-2">
                          <img
                            src={country.flags.png || "/placeholder.svg"}
                            alt={country.flags.alt}
                            className="w-5 h-4 object-cover rounded-sm"
                          />
                          <span>{country.name.common}</span>
                          <span className="text-muted-foreground">({getCountryCode(country)})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-2 border rounded-md bg-muted min-w-20 justify-center">
                  <span className="text-sm font-medium">
                    {selectedCountry ? getCountryCode(selectedCountry) : "+1"}
                  </span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={!phoneNumber || !selectedCountry || isLoading || loading}
            >
              {isLoading ? "Sending..." : "Send verification code"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


export default Login
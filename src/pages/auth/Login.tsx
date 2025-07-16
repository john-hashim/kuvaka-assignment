import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { toast } from "sonner";

// Validation schemas
const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number must be at most 15 digits"),
})

const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
})

type LoginFormData = z.infer<typeof loginSchema>
type OTPFormData = z.infer<typeof otpSchema>
type LoginStep = "credentials" | "otp"

const Login: React.FC = () => {
  const [step, setStep] = useState<LoginStep>("credentials")
  const [countries, setCountries] = useState<Country[]>([])
  const [phoneContext, setPhoneContext] = useState<{
    fullPhoneNumber: string
    country: Country
  } | null>(null)
  
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    execute: executeLogin,
    loading: countriesLoading,
    error: serverError,
  } = useApi<Country[], []>(commonService.getCountryData)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: "",
      phoneNumber: "",
    },
  })

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await executeLogin()
        setCountries(data)

        // Set default country to India
        const defaultCountry = data.find((country) => country.cca2 === "IN")
        if (defaultCountry) {
          loginForm.setValue("countryCode", defaultCountry.cca2)
        }
      } catch (error) {
        console.error("Failed to load countries:", error)
      }
    }
    loadCountries()
  }, [executeLogin, loginForm])

  useEffect(() => {
    if (serverError) {
      console.error("Failed to fetch countries:", serverError)
    }
  }, [serverError])

  const getCountryCode = (country: Country) => {
    if (!country.idd?.root) return ""
    const suffix = country.idd.suffixes?.[0] || ""
    return `${country.idd.root}${suffix}`
  }

  const getSelectedCountry = () => {
    const countryCode = loginForm.watch("countryCode")
    return countries.find((country) => country.cca2 === countryCode)
  }

  const getFullPhoneNumber = (country: Country, phoneNumber: string) => {
    return `${getCountryCode(country)}${phoneNumber}`
  }

  // Form handlers
  const handleSendOTP = async (data: LoginFormData) => {
    const selectedCountry = countries.find((c) => c.cca2 === data.countryCode)
    if (!selectedCountry) return

    const fullPhoneNumber = getFullPhoneNumber(selectedCountry, data.phoneNumber)
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setPhoneContext({
        fullPhoneNumber,
        country: selectedCountry
      })
      toast("OTP send successfully");
      setStep("otp")
    } catch (error) {
      console.error("Failed to send OTP:", error)
      // Handle error (show toast, set form error, etc.)
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const mockLogin = (): Promise<{ token: string }> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ token: "mock_token_123" })
          }, 1500)
        })
      }

      const response = await mockLogin()
      login(response.token, true)
      navigate('/chat')
    } catch (error) {
      console.error("Failed to verify OTP:", error)
      otpForm.setError("otp", {
        type: "manual",
        message: "Invalid OTP. Please try again."
      })
    }
  }

  const handleBackToCredentials = () => {
    setStep("credentials")
    otpForm.reset()
    setPhoneContext(null)
  }

  // OTP Step Component
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
              We've sent a 6-digit code to{" "}
              <span className="font-medium">{phoneContext?.fullPhoneNumber}</span>
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">
                  Enter verification code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpForm.watch("otp")}
                    onChange={(value) => {
                      otpForm.setValue("otp", value)
                      // Trigger validation
                      otpForm.trigger("otp")
                    }}
                  >
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
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-red-500 text-center">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col mt-4 space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={otpForm.watch("otp").length !== 6 || otpForm.formState.isSubmitting}
              >
                {otpForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBackToCredentials}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  // Login Step Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        
        <form onSubmit={loginForm.handleSubmit(handleSendOTP)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              {countriesLoading ? (
                <div className="flex items-center justify-center h-10 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading countries...</span>
                </div>
              ) : (
                <Select
                  value={loginForm.watch("countryCode")}
                  onValueChange={(value) => loginForm.setValue("countryCode", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country">
                      {(() => {
                        const selectedCountry = getSelectedCountry()
                        return selectedCountry ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={selectedCountry.flags.png || "/placeholder.svg"}
                              alt={selectedCountry.flags.alt}
                              className="w-5 h-4 object-cover rounded-sm"
                            />
                            <span>{selectedCountry.name.common}</span>
                            <span className="text-muted-foreground">
                              ({getCountryCode(selectedCountry)})
                            </span>
                          </div>
                        ) : null
                      })()}
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
                          <span className="text-muted-foreground">
                            ({getCountryCode(country)})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {loginForm.formState.errors.countryCode && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.countryCode.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-2 border rounded-md bg-muted min-w-20 justify-center">
                  <span className="text-sm font-medium">
                    {(() => {
                      const selectedCountry = getSelectedCountry()
                      return selectedCountry ? getCountryCode(selectedCountry) : "+1"
                    })()}
                  </span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...loginForm.register("phoneNumber")}
                  className="flex-1"
                />
              </div>
              {loginForm.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={!loginForm.formState.isValid || loginForm.formState.isSubmitting || countriesLoading}
            >
              {loginForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send verification code"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
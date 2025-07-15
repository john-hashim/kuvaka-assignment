import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Chat: React.FC = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            logout()
            navigate('/login')
        } catch (e) {
            logout()
            console.log(e)
            navigate('/login')
        }
    }
    return <>
              <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
    </>
}

export default Chat
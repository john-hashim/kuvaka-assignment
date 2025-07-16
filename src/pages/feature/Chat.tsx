import { useAuth } from "@/contexts/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import ThreadSidebar from "./ThreadSidebar";
import ChatInterface from "./ChatInterface";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/store/chatStore";

const Chat: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  const { logout: storeLogout } = useChatStore()
  
  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
      storeLogout()
    } catch (e) {
      logout();
      console.log(e);
      navigate("/login");
      storeLogout()
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="h-full">
          <SidebarContent className="p-0 h-full overflow-hidden">
            <div className="h-full w-full">
              <ThreadSidebar currentThreadId={threadId} onLogout={handleLogout} />
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full">
          <div className="border-b p-2 flex-shrink-0">
            <SidebarTrigger />
          </div>
          
          <div className="flex-1 min-h-0">
            <ChatInterface threadId={threadId} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
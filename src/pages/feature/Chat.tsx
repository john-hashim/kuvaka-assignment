import { useAuth } from "@/contexts/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import ThreadSidebar from "./ThreadSidebar";
import ChatInterface from "./ChatInterface";
// import ChatInterface from "./ChatInterface"

const Chat: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (e) {
      logout();
      console.log(e);
      navigate("/login");
    }
  };
  return (
    <>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <ThreadSidebar currentThreadId={threadId} onLogout={handleLogout} />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatInterface threadId={threadId} />
        </div>
      </div>
    </>
  );
};

export default Chat;

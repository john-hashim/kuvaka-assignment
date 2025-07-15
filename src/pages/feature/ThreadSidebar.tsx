import { Thread, ApiResponse, Role } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {
  MessageSquarePlus,
  MessageSquare,
  LogOut,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/store/chatStore";

interface ThreadSidebarProps {
  currentThreadId?: string;
  onLogout: () => void;
}

const mockThreadsData: Thread[] = [
  {
    id: "cmd4srqyf0007oo8fxkcgcj3q",
    userId: "cmck53t7a000ioopn5rpmdfvt",
    title: "India: Ten Word Description",
    createdAt: "2025-07-15T17:19:29.079Z",
    message: [
      {
        id: "cmd4srqyf0008oo8ftgd8fh15",
        threadId: "cmd4srqyf0007oo8fxkcgcj3q",
        content: "10 words description about india",
        role: Role.User,
        createdAt: "2025-07-15T17:19:29.079Z",
      },
      {
        id: "cmd4srqyf0009oo8fu10x0g6x",
        threadId: "cmd4srqyf0007oo8fxkcgcj3q",
        content:
          "Diverse, vibrant, spiritual, historical, populous, flavorful, colorful, cultural, technological, and beautiful.\n",
        role: Role.Assistant,
        createdAt: "2025-07-15T17:19:29.079Z",
      },
    ],
  },
  {
    id: "cmckmcdem0011oozpr0po8kml",
    userId: "cmck53t7a000ioopn5rpmdfvt",
    title: "Samsung: A 10 message",
    createdAt: "2025-07-01T14:24:10.462Z",
    message: [
            {
                "id": "cmckmcdem0012oozpg5yqc776",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "Explain about samusung company in 10 words",
                "role": Role.User,
                "createdAt": "2025-07-01T14:24:10.462Z"
            },
            {
                "id": "cmckmcdem0013oozphxjeyiuc",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "Samsung: South Korean multinational conglomerate specializing in electronics, technology, and construction.\n",
                "role": Role.Assistant,
                "createdAt": "2025-07-01T14:24:10.462Z"
            },
            {
                "id": "cmckn8nzx001boozpbsx75olx",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "what are thier latest 2 products",
                "role": Role.User,
                "createdAt": "2025-07-01T14:49:17.179Z"
            },
            {
                "id": "cmckn8qgq001doozpqjugy1jp",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "As of November 2023, two of Samsung's latest prominent products are:\n\n1.  **Samsung Galaxy S23 FE (Fan Edition):** A more affordable version of the flagship S23 series, offering many of the key features at a lower price point.\n2.  **Samsung Bespoke AI Laundry Combo:** A smart washer and dryer combo with AI-powered features for optimized laundry cycles.\n\nIt's worth noting that product releases are frequent, so there might be newer products depending on when you're asking.\n",
                "role": Role.Assistant,
                "createdAt": "2025-07-01T14:49:20.378Z"
            },
            {
                "id": "cmcknjesj001foozpjc8go8qb",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "where are they based",
                "role": Role.User,
                "createdAt": "2025-07-01T14:57:38.465Z"
            },
            {
                "id": "cmcknjgeb001hoozpdxj83zok",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "Samsung is based in **Seoul, South Korea**.\n",
                "role": Role.Assistant,
                "createdAt": "2025-07-01T14:57:40.548Z"
            },
            {
                "id": "cmcknjnbt001joozpa8fcb8k4",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "who is the founder",
                "role": Role.User,
                "createdAt": "2025-07-01T14:57:49.529Z"
            },
            {
                "id": "cmcknjowb001loozpu6f194oq",
                "threadId": "cmckmcdem0011oozpr0po8kml",
                "content": "The founder of Samsung is **Lee Byung-chul**.\n",
                "role": Role.Assistant,
                "createdAt": "2025-07-01T14:57:51.563Z"
            }
        ],
  },
  {
    id: "cmclhkpd8001tooczzy0cst1e",
    userId: "cmck53t7a000ioopn5rpmdfvt",
    title: "Kerala: Ten Word Description",
    createdAt: "2025-07-02T04:58:27.306Z",
    message: [
      {
        id: "cmcneyais002ioocz2ov5hcep",
        threadId: "cmcneyais002hooczmnal5bgg",
        content: "tell me about kerala in 10 words",
        role: Role.User,
        createdAt: "2025-07-03T13:20:34.756Z",
      },
      {
        id: "cmcneyais002joocz0xuv8uya",
        threadId: "cmcneyais002hooczmnal5bgg",
        content:
          "Kerala: Lush greenery, beautiful beaches, backwaters, and vibrant culture.\n",
        role: Role.Assistant,
        createdAt: "2025-07-03T13:20:34.756Z",
      },
    ],
  },
];

const ThreadSidebar: React.FC<ThreadSidebarProps> = ({
  currentThreadId,
  onLogout,
}) => {
  const navigate = useNavigate();
  //   const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const {
    isLoading: storeLoading,
    error,
    setThreads,
    setLoading,
    setError,
    clearError,
    deleteThread,
  } = useChatStore();

  const threads = useChatStore((state) => state.threads);

  const handleNewChat = () => {
    navigate("/chat/new");
  };

  const handleThreadClick = (threadId: string) => {
    navigate(`/chat/${threadId}`);
  };

  const handleDeleteThread = async (threadId: string) => {
    const threadToDelete = mockThreadsData.find(
      (thread) => thread.id === threadId
    );
    if (!threadToDelete) {
      return toast("error in finding thread");
    }
    try {
      const mockDeleteThread = (
        threadToDelete: Thread
      ): Promise<ApiResponse<Thread>> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: threadToDelete,
              message: "Thread has been deleted",
            });
          }, 1500);
        });
      };
      const res = await mockDeleteThread(threadToDelete);
      if (res?.success) {
        deleteThread(res.data.id);
        toast("Chat successfully deleted");
        if (currentThreadId === threadId) {
          handleNewChat();
        }
      } else {
        toast("Error in deleting chat");
      }
    } catch (error) {
      console.error("Delete thread error:", error);
      toast("Error in deleting chat");
    }
  };

  // Load threads on component mount
  useEffect(() => {
    const loadThreads = async () => {
      try {
        clearError();
        setLoading(true);
        const mockThreads = (
          mockThreadsData: Thread[]
        ): Promise<ApiResponse<Thread[]>> => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                success: true,
                data: mockThreadsData,
                message: "Threads retrieved successfully",
              });
            }, 1500);
          });
        };
        const response = await mockThreads(mockThreadsData);
        setThreads(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load threads");
      } finally {
        setLoading(false);
      }
    };

    loadThreads();
  }, [setThreads, setLoading, setError, clearError]);

  const isLoading = storeLoading;

  return (
    <>
      <div className="w-80 border-r border-border bg-card flex flex-col h-screen">
        <div className="p-4 border-b border-border">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2"
            variant={
              currentThreadId === undefined || currentThreadId === "new"
                ? "default"
                : "outline"
            }
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Show general errors */}
        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}

        {isLoading && threads.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading threads...
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {threads.map((thread: Thread) => (
              <div
                key={thread.id}
                className={`group relative p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                  currentThreadId === thread.id ? "bg-accent" : ""
                }`}
                onClick={() => handleThreadClick(thread.id)}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {thread.title}
                    </div>
                  </div>
                  <DropdownMenu
                    open={openDropdownId === thread.id}
                    onOpenChange={(open) =>
                      setOpenDropdownId(open ? thread.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteThread(thread.id);
                        }}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && threads.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a new chat to begin
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default ThreadSidebar;

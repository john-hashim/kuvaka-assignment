import React, { useEffect, useState, useRef } from "react";
import { Send, Copy, Check } from "lucide-react";
import { Message, Role, Thread } from "@/types/chat";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chatStore";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInterfaceProps {
  threadId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ threadId = null }) => {
  const [newThreadFlag, setNewThreadFlag] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { updateThread, unshiftThread } = useChatStore();

  const thread = useChatStore((state) =>
    state.threads.find((t) => t.id === threadId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (threadId) {
      setNewThreadFlag(false);
    } else {
      setNewThreadFlag(true);
    }
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [thread?.message, loading]);

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  const handleSendMessage = async () => {
    try {
      const dateAndTime = new Date().toString();
      if (messageText && thread) {
        const userMessage: Message = {
          id: Math.floor(100000 + Math.random() * 900000).toString(),
          threadId: thread.id,
          content: messageText,
          role: Role.User,
          createdAt: dateAndTime,
        };
        const newMessageArray = [...thread.message, userMessage];
        updateThread({ ...thread, message: newMessageArray });
        setLoading(true);
        setMessageText("");
        const response = await mockAIResponce(thread.id);
        updateThread({ ...thread, message: [...newMessageArray, response] });
        setLoading(false);
      } else {
        const newThreadId = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        const mockThreadValue: Thread = {
          id: newThreadId,
          userId: "cmck53t7a000ioopn5rpmdfvt",
          title: messageText,
          createdAt: dateAndTime,
          message: [
            {
              id: Math.floor(100000 + Math.random() * 900000).toString(),
              threadId: newThreadId,
              content: messageText,
              role: Role.User,
              createdAt: "2025-07-01T14:24:10.462Z",
            },
          ],
        };

        unshiftThread(mockThreadValue);
        setMessageText("");
        navigate(`/chat/${mockThreadValue.id}`);
        setLoading(true);
        const response = await mockAIResponce(newThreadId);
        updateThread({
          ...mockThreadValue,
          message: [...mockThreadValue.message, response],
        });
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (messageText.trim()) {
        handleSendMessage();
      }
    }
  };

  const mockAIResponce = (threadId: string): Promise<Message> => {
    const date = new Date().toString();
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          threadId: threadId,
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
          role: Role.Assistant,
          createdAt: date,
        });
      }, 3000);
    });
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="border-t border-b border-border bg-muted/30 p-4 sticky top-0 z-10">
        <div className="flex items-end space-x-3">
          <div className="flex-1 text-foreground font-medium">
            {thread?.title}
          </div>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {newThreadFlag ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                Start a new conversation
              </h2>
              <p className="text-muted-foreground">
                Type a message below to begin
              </p>
            </div>
          </div>
        ) : (
          <>
            {thread?.message?.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl relative group ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-card-foreground rounded-bl-md border border-border"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap pr-8">
                      {formatContent(message.content)}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div
                        className={`text-xs ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <button
                        onClick={() =>
                          handleCopyMessage(message.content, message.id)
                        }
                        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-accent ${
                          message.role === "user"
                            ? "text-primary-foreground/70 hover:text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced Loading skeleton */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-[70%] px-4 py-3 rounded-2xl bg-card text-card-foreground rounded-bl-md border border-border">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div>Gemini is thinking</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center justify-start space-x-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent max-h-32 bg-background text-foreground placeholder-muted-foreground"
            rows={1}
            style={{
              minHeight: "48px",
              height: "auto",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground rounded-full p-3 transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

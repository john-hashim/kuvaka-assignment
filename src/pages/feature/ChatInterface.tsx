import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { Message, Role, Thread } from "@/types/chat";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chatStore";

interface ChatInterfaceProps {
  threadId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ threadId = null }) => {
  const [newThreadFlag, setNewThreadFlag] = useState(true);
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { updateThread, unshiftThread } = useChatStore();

  const thread = useChatStore((state) =>
    state.threads.find((t) => t.id === threadId)
  );

  // Auto-scroll to bottom function
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

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [thread?.message, loading]);

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
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="border-t border-gray-500 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">{thread?.title}</div>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {newThreadFlag ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Start a new conversation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Type a message below to begin
              </p>
            </div>
          </div>
        ) : (
          <>
            {thread?.message?.map((message, index) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-md"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatContent(message.content)}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-blue-100 dark:text-blue-200"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                {loading && index === thread.message.length - 1 && (
                  <div
                    className="max-w-[70%] px-4 py-3 rounded-2xl
                        bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      Loading....
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent max-h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer text-white rounded-full p-3 transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
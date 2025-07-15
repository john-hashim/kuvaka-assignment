import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Thread } from '@/types/chat'

interface ChatStore {
  threads: Thread[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setThreads: (threads: Thread[]) => void
  unshiftThread: (thread: Thread) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  deleteThread: (threadId: string) => void
  updateThread: (thread: Thread) => void
  getThread: (threadId: string) => Thread | undefined
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        threads: [],
        isLoading: false,
        error: null,

        // Actions
        setThreads: (threads: Thread[]) =>
          set({ threads, error: null }, false, 'setThreads'),
        
        unshiftThread: (thread: Thread) =>
          set(
            state => ({
              threads: [thread, ...state.threads],
            }),
            false,
            'unshiftThread'
          ),
        
        setLoading: (isLoading: boolean) => 
          set({ isLoading }, false, 'setLoading'),
        
        setError: (error: string | null) => 
          set({ error }, false, 'setError'),
        
        clearError: () => 
          set({ error: null }, false, 'clearError'),
        
        deleteThread: (threadId: string) =>
          set(
            state => ({
              threads: state.threads.filter(thread => thread.id !== threadId)
            }),
            false,
            'deleteThread'
          ),
        
        updateThread: (thread: Thread) =>
          set(
            state => ({
              threads: state.threads.map(t => (t.id === thread.id ? thread : t))
            }),
            false,
            'updateThread'
          ),
        
        getThread: (threadId: string) => {
          const state = get()
          return state.threads.find(thread => thread.id === threadId)
        },
      }),
      {
        name: 'chat-storage',
        partialize: state => ({
          threads: state.threads,
        }),
      }
    ),
    {
      name: 'ChatStore',
      serialize: {
        options: {
          function: false,
        },
      },
    }
  )
)
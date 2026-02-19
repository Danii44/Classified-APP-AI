'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, Package2, Send } from 'lucide-react'

export default function MessagesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) {
        router.push('/auth/login')
      } else {
        setUser(data.session.user)
        await fetchConversations()
      }
    }
    checkAuth()
  }, [supabase, router])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data)
      if (data.length > 0) {
        setActiveConversation(data[0].id)
        await fetchMessages(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation) return

    try {
      await fetch(`/api/conversations/${activeConversation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })
      setNewMessage('')
      await fetchMessages(activeConversation)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package2 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">NexusMarket</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex gap-6">
        {/* Conversations List */}
        <div className="w-full md:w-80 flex flex-col">
          <Card className="bg-slate-800 border-slate-700 flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id)
                      fetchMessages(conv.id)
                    }}
                    className={`w-full text-left p-4 border-b border-slate-700 transition hover:bg-slate-700/50 ${
                      activeConversation === conv.id ? 'bg-slate-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium truncate">
                        {user.id === conv.seller_id ? conv.buyer_id : conv.seller_id}
                      </p>
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-400 truncate">{conv.listings?.title}</p>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            <Card className="bg-slate-800 border-slate-700 flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_id === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-300'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="bg-slate-700 border-slate-600 text-white"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a conversation to start messaging</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

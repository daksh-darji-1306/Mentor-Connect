'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Clock,
  CheckCheck,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/sidebar';

interface Conversation {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    mentorId: 'm1',
    mentorName: 'Sarah Chen',
    mentorRole: 'Senior Product Manager',
    mentorAvatar: 'SC',
    lastMessage: "That's a great approach! Let's discuss it in our next session.",
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '2',
    mentorId: 'm2',
    mentorName: 'John Smith',
    mentorRole: 'Engineering Lead',
    mentorAvatar: 'JS',
    lastMessage: 'Check out this article on system design patterns',
    lastMessageTime: '5 hours ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '3',
    mentorId: 'm3',
    mentorName: 'Emily Rodriguez',
    mentorRole: 'Design Director',
    mentorAvatar: 'ER',
    lastMessage: 'Your wireframes look amazing!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '4',
    mentorId: 'm4',
    mentorName: 'Michael Zhang',
    mentorRole: 'Startup Founder',
    mentorAvatar: 'MZ',
    lastMessage: 'Send me your pitch deck when ready',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    conversationId: '1',
    senderId: 'm1',
    senderName: 'Sarah Chen',
    senderRole: 'Senior Product Manager',
    content: 'Hey! How are you doing with the product metrics?',
    timestamp: '10:30 AM',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'm2',
    conversationId: '1',
    senderId: 'me',
    senderName: 'You',
    content:
      "I've been analyzing the user engagement data. The retention rate improved by 15% this month!",
    timestamp: '10:35 AM',
    isOwn: true,
    status: 'read',
  },
  {
    id: 'm3',
    conversationId: '1',
    senderId: 'm1',
    senderName: 'Sarah Chen',
    content: "That's a great approach! Let's discuss it in our next session.",
    timestamp: '2 hours ago',
    isOwn: false,
    status: 'read',
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.mentorName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      conversationId: selectedConversation.id,
      senderId: 'me',
      senderName: 'You',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      isOwn: true,
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Mark conversation as read
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const currentMessages = messages.filter((m) => m.conversationId === selectedConversation?.id);

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen relative"
    >
      <Sidebar />
      <div className="ml-64 px-6 py-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        </div>

        {/* Main Chat Area */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 flex flex-col border-r border-border/50"
          >
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConversation?.id === conv.id
                      ? 'bg-primary/10 border border-primary/50'
                      : 'hover:bg-secondary/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {conv.mentorAvatar}
                      </div>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border 2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground text-sm">{conv.mentorName}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {conv.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Chat Area */}
          {selectedConversation ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col min-w-0"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {selectedConversation.mentorAvatar}
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">{selectedConversation.mentorName}</h2>
                    <p className="text-xs text-muted-foreground">{selectedConversation.mentorRole}</p>
                  </div>
                  {selectedConversation.isOnline && (
                    <div className="flex items-center gap-1 text-green-500 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Active now
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {currentMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                      {!msg.isOwn && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {msg.senderRole || msg.senderName}
                        </p>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          msg.isOwn
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-secondary/10 text-foreground border border-border/30 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground justify-end">
                        {msg.timestamp}
                        {msg.isOwn && getMessageStatusIcon(msg.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-card border border-border/50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
                <Button type="submit" size="icon" className="gap-2">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

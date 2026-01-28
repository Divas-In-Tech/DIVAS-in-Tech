import { useState, useEffect, useRef } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Send, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  online: boolean;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface ChatPageProps {
  userName: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Sarah Johnson", online: true },
  { id: "2", name: "Michael Chen", online: true },
  { id: "3", name: "Emily Rodriguez", online: false },
  { id: "4", name: "David Park", online: true },
  { id: "5", name: "Jessica Williams", online: false },
];

const initialMessages: Message[] = [
  {
    id: "1",
    userId: "1",
    userName: "Sarah Johnson",
    content: "Hi everyone! Excited about the food drive this weekend!",
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: "2",
    userId: "2",
    userName: "Michael Chen",
    content: "Me too! I've been spreading the word in my neighborhood.",
    timestamp: new Date(Date.now() - 3300000)
  },
  {
    id: "3",
    userId: "4",
    userName: "David Park",
    content: "That's great! We're expecting a good turnout. Don't forget to bring extra boxes if you can.",
    timestamp: new Date(Date.now() - 2700000)
  },
  {
    id: "4",
    userId: "1",
    userName: "Sarah Johnson",
    content: "Will do! I have some spare boxes from my recent move.",
    timestamp: new Date(Date.now() - 1800000)
  },
];

const sampleResponses = [
  "That sounds wonderful!",
  "Count me in!",
  "I'll be there to help.",
  "Great initiative!",
  "Thanks for organizing this.",
  "Looking forward to it!",
  "What time should we arrive?",
  "I can bring some supplies.",
];

export function ChatPage({ userName }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: "current",
      userName: userName,
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate someone else responding
    setIsTyping(true);
    setTimeout(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        userId: randomUser.id,
        userName: randomUser.name,
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 2000 + Math.random() * 2000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Community Chat</h1>
          <p className="text-gray-600">
            Connect with fellow volunteers and team members
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Online Users */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg">Members</h2>
              </div>
              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      {user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col h-[600px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.userId === "current";
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback>{getInitials(message.userName)}</AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm ${isCurrentUser ? 'order-2' : ''}`}>
                              {message.userName}
                            </span>
                            <span className={`text-xs text-gray-500 ${isCurrentUser ? 'order-1' : ''}`}>
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div
                            className={`inline-block px-4 py-2 rounded-lg max-w-md ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>...</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Chat Info */}
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {mockUsers.filter(u => u.online).length} members online
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {messages.length} messages
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//random comment
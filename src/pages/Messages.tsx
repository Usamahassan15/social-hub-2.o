import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: number;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

interface Message {
  id: number;
  sender: "user" | "other";
  content: string;
  time: string;
}

const conversations: Conversation[] = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Hey! How's your project going?",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    lastMessage: "Thanks for the help yesterday!",
    time: "1h ago",
  },
  {
    id: 3,
    user: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessage: "Let's catch up this weekend",
    time: "3h ago",
  },
  {
    id: 4,
    user: "Jake Cooper",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake",
    lastMessage: "Check out this link!",
    time: "5h ago",
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "other",
    content: "Hey! How's your project going?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "user",
    content: "It's going great! Just finished the main features.",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "other",
    content: "That's awesome! Would love to see it when you're ready.",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "user",
    content: "Sure! I'll share the demo link soon.",
    time: "10:35 AM",
  },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [messageInput, setMessageInput] = useState("");
  const [showConversationList, setShowConversationList] = useState(true);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const selectedUser = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-0">
        <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)] flex">
          {/* Conversations List */}
          <div
            className={`${
              showConversationList ? "flex" : "hidden"
            } md:flex w-full md:w-80 flex-col border-r border-border bg-card`}
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-2xl font-bold gradient-text mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedConversation(conversation.id);
                      setShowConversationList(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedConversation === conversation.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.user}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread && (
                          <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xs flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={`${
              showConversationList ? "hidden" : "flex"
            } md:flex flex-1 flex-col bg-background`}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowConversationList(true)}
                >
                  <span className="text-xl">←</span>
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser?.avatar} />
                  <AvatarFallback>{selectedUser?.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {selectedUser?.user}
                  </h3>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {mockMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
                          : "bg-muted text-foreground"
                      } rounded-2xl px-4 py-3`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2 max-w-3xl mx-auto">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Messages;

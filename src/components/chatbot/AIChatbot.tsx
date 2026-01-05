import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    MapPin,
    Calendar,
    Utensils,
    Clock,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { processChatMessage, ChatMessage } from "./ChatbotLogic";

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            role: "assistant",
            content: "Assalamu Alaikum! Welcome to Pak Cuisine. I'm your AI assistant. How can I help you today? 👋🇵🇰",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Fetch response
        const fetchResponse = async () => {
            try {
                const response = await processChatMessage(text);
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.content || "I'm here to help!",
                    type: response.type,
                    data: response.data,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } catch (error) {
                console.error("Chatbot error:", error);
                setMessages((prev) => [...prev, {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: "I'm sorry, I encountered an error. Please try again later.",
                    timestamp: new Date(),
                }]);
            } finally {
                setIsTyping(false);
            }
        };

        fetchResponse();
    };

    const handleAction = (action: string) => {
        if (action === "Book a Table") {
            setIsOpen(false);
            navigate("/reservations");
        } else if (action === "View Menu" || action === "Order Food") {
            setIsOpen(false);
            navigate("/menu");
        } else if (action === "Top Deals" || action === "Hot Deals") {
            setIsOpen(false);
            navigate("/deals");
        } else {
            handleSend(action);
        }
    };

    const quickActions = [
        {
            label: "Hot Deals",
            icon: Sparkles,
            action: () => { setIsOpen(false); navigate("/deals"); }
        },
        {
            label: "Book a Table",
            icon: Calendar,
            action: () => { setIsOpen(false); navigate("/reservations"); }
        },
        {
            label: "Order Food",
            icon: Utensils,
            action: () => { setIsOpen(false); navigate("/menu"); }
        },
        { label: "Our Location", icon: MapPin, action: () => handleSend("Where are you located?") },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-4 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-background/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary via-primary/80 to-secondary text-primary-foreground flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-lg leading-tight">Pak Cuisine AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-xs opacity-80 font-medium">Always Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 text-primary-foreground rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex gap-3",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                                            msg.role === "user" ? "bg-primary/20" : "bg-secondary text-secondary-foreground"
                                        )}>
                                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>

                                        <div className="flex flex-col gap-2 max-w-[80%]">
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                msg.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-white dark:bg-zinc-800 text-foreground border border-border dark:border-white/5 rounded-tl-none"
                                            )}>
                                                {msg.content.split('\n').map((line, i) => (
                                                    <p key={i}>{line}</p>
                                                ))}
                                            </div>

                                            {/* Rich Content: Menu Cards */}
                                            {msg.type === "menu" && msg.data && (
                                                <div className="grid grid-cols-1 gap-2 mt-2">
                                                    {msg.data.map((item: any) => (
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            key={item.id}
                                                            className="flex gap-3 bg-white dark:bg-zinc-800 p-2 rounded-xl border border-border dark:border-white/10 overflow-hidden shadow-sm cursor-pointer"
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                // If it has originalPrice or is explicitly a deal, go to deals page
                                                                if (item.original_price || msg.content.toLowerCase().includes("deal")) {
                                                                    navigate("/deals");
                                                                } else {
                                                                    navigate("/menu");
                                                                }
                                                            }}
                                                        >
                                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-xs font-bold truncate">{item.name}</h4>
                                                                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">{item.description}</p>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <span className="text-xs font-bold text-primary">${item.price}</span>
                                                                    <Button size="icon" variant="ghost" className="h-5 w-5 rounded-full hover:bg-primary/10 text-primary">
                                                                        <ArrowRight className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Quick Action Buttons per message */}
                                            {msg.type === "actions" && msg.data && (
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {msg.data.map((action: string) => (
                                                        <Button
                                                            key={action}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-[10px] h-7 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-full border-primary/20 hover:border-primary transition-colors"
                                                            onClick={() => handleAction(action)}
                                                        >
                                                            {action}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 shadow-sm">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-border dark:border-white/5">
                                            <div className="flex gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce delay-150" />
                                                <span className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce delay-300" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Quick Actions Footer */}
                        {!isTyping && messages.length < 5 && (
                            <div className="px-4 pb-2">
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                    {quickActions.map((action) => (
                                        <Button
                                            key={action.label}
                                            variant="secondary"
                                            size="sm"
                                            onClick={action.action}
                                            className="whitespace-nowrap flex items-center gap-2 rounded-full text-xs bg-secondary/50 hover:bg-secondary border border-border"
                                        >
                                            <action.icon className="w-3 h-3" />
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-background border-t border-border">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-muted/50 dark:bg-zinc-800/50 p-1 rounded-2xl border border-border ring-offset-background focus-within:ring-1 focus-within:ring-primary/20"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim()}
                                    className="shrink-0 h-9 w-9 rounded-xl shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:shadow-primary/20 transition-all active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                            <div className="mt-2 text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" /> Powered by Pak Cuisine AI
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative group",
                    isOpen
                        ? "bg-zinc-800 text-white"
                        : "bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground"
                )}
            >
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:animate-none opacity-50" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {isOpen ? (
                    <X className="w-7 h-7" />
                ) : (
                    <div className="relative">
                        <MessageSquare className="w-7 h-7" />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center text-secondary border-2 border-primary"
                        >
                            1
                        </motion.div>
                    </div>
                )}
            </motion.button>
        </div>
    );
}

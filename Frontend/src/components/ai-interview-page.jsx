"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuthProvider } from "@/context/AuthProvider";
import { useChat, useGenerateReport } from "@/api/queryMutations";
import { useRouter } from "next/navigation";

export function AIInterviewPage({
  jobTitle,
  interviewId,
  initialData,
}) {
  const router = useRouter();
  const initialMessage = [initialData];
  const { user } = useAuthProvider();
  const [messages, setMessages] = useState(initialMessage);
  const [inputValue, setInputValue] = useState("");
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { mutateAsync: chat, isPending: isAITyping } = useChat();
  const { mutateAsync: generateReport } = useGenerateReport();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  console.log(messages);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input field on page load
  useEffect(() => {
    if (inputRef.current && !isInterviewComplete) {
      inputRef.current.focus();
    }
  }, [isInterviewComplete]);

  // Focus input field when AI typing ends
  useEffect(() => {
    if (!isAITyping && !isInterviewComplete && inputRef.current) {
      // Small delay to ensure the UI has updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAITyping, isInterviewComplete]);

  const aiResponse = async (candidateMessage) => {
    try {
      const { data, success } = await chat({
        interviewId,
        message: candidateMessage,
      });

      if (success) {
        const aiResponse = {
          id: data.messageRecord.id,
          content: data.messageRecord.message,
          sender: data.messageRecord.sender || "ai",
          timestamp: data.messageRecord.timestamp,
        };

        setMessages((prev) => [...prev, aiResponse]);

        if (data.isFinished) {
          setIsInterviewComplete(true);
          const { success } = await generateReport(interviewId);
          if (success) {
            router.push(`/candidate/success`);
          } else {
            toast.error("Failed to generate report.");
          }
          return;
        }
      }
    } catch (error) {
      toast("Error", {
        description:
          error?.response?.data?.message ||
          "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isAITyping || isInterviewComplete) return;

    const candidateMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "candidate",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, candidateMessage]);
    setInputValue("");

    aiResponse(inputValue.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    if (!date) return ""; // safety check
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Interview Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky z-40 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">AI Interview</h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Live
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{jobTitle}</p>
              <p className="text-xs text-muted-foreground">
                Candidate: {user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "candidate"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`flex flex-col gap-1 max-w-[70%] ${
                      message.sender === "candidate"
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === "ai"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground px-2">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  {message.sender === "candidate" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage
                        src={
                          user?.avatar || "/placeholder.svg?height=32&width=32"
                        }
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isAITyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          AI is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Complete Message */}
              {isInterviewComplete && (
                <div className="flex justify-center">
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                        <Bot className="h-5 w-5" />
                        <span className="font-semibold">
                          Interview Complete
                        </span>
                      </div>
                      <p className="text-sm text-green-600">
                        Thank you for completing the AI interview! We'll review
                        your responses and get back to you soon.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className=" border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isInterviewComplete
                      ? "Interview completed"
                      : isAITyping
                      ? "AI is responding..."
                      : "Type your response..."
                  }
                  disabled={isAITyping || isInterviewComplete}
                  className="pr-12 h-12 text-base resize-none"
                  maxLength={1000}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-xs text-muted-foreground">
                    {inputValue.length}/1000
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isAITyping || isInterviewComplete}
              size="lg"
              className="h-12 px-6"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>

          {/* Helper Text */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send • Shift + Enter for new line</span>
            <span>
              {messages.filter((m) => m.sender === "candidate").length}{" "}
              responses sent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

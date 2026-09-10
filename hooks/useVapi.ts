"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";

export type CallStatus = "inactive" | "loading" | "active" | "ended";

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("inactive");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [isTimeLimitReached, setIsTimeLimitReached] = useState(false);

  useEffect(() => {
    // Initialize Vapi on the client side
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    console.log("Initializing Vapi with token:", token ? "Token exists" : "No token found");
    
    if (!token) {
      console.error("NEXT_PUBLIC_VAPI_WEB_TOKEN is not set");
      return;
    }
    
    const vapi = new Vapi(token);
    vapiRef.current = vapi;
    // Speech start/end events
    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    // Call status events
    vapi.on("call-start", () => {
      setCallStatus("active");
      setElapsedTime(0);
      setIsTimeLimitReached(false);
    });
    vapi.on("call-end", (callData: any) => {
      console.log("Call ended with data:", callData);
      setCallStatus("ended");
      setIsSpeaking(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    // Message events
    vapi.on("message", (message: any) => {
      if (message.type === "transcript" && message.transcript) {
        setMessages((prev) => [
          ...prev,
          {
            role: message.role,
            content: message.transcript,
          },
        ]);
      }
    });

    // Volume level for visualization
    vapi.on("volume-level", (level: number) => {
      setVolumeLevel(level);
    });

    // Error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapi.on("error", (error: any) => {
      // Ignore "ejected" errors - these are normal call endings
      if (error?.error?.type === "ejected" || error?.errorMsg === "Meeting has ended") {
        console.log("Call ended normally");
        return;
      }
      
      console.error("Vapi error event:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      // Try to extract more details for real errors
      if (error?.error) {
        console.error("Nested error:", error.error);
      }
      if (error?.message) {
        console.error("Error message:", error.message);
      }
      if (error?.statusCode) {
        console.error("Status code:", error.statusCode);
      }
      
      setCallStatus("inactive");
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const start = useCallback(async (assistantId?: string, assistantOverrides?: any) => {
    if (!vapiRef.current) {
      console.error("Vapi not initialized");
      return;
    }
    setCallStatus("loading");
    setElapsedTime(0);
    setIsTimeLimitReached(false);
    
    try {
      console.log("Starting call with:", { assistantId, assistantOverrides });
      if (assistantId) {
        await vapiRef.current.start(assistantId, assistantOverrides);
      } else {
        await vapiRef.current.start(assistantOverrides);
      }
      
      // Start timer after call starts successfully
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          // Check if 6 minutes (360 seconds) reached
          if (newTime >= 360) {
            setIsTimeLimitReached(true);
            // Auto-end call at 6 minutes
            if (vapiRef.current) {
              vapiRef.current.stop();
            }
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error starting call:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      setCallStatus("inactive");
    }
  }, []);

  const stop = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
    setCallStatus("inactive");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const send = useCallback((message: any) => {
    if (!vapiRef.current) return;
    vapiRef.current.send(message);
  }, []);

  return {
    callStatus,
    isSpeaking,
    messages,
    volumeLevel,
    elapsedTime,
    isTimeLimitReached,
    start,
    stop,
    send,
  };
}

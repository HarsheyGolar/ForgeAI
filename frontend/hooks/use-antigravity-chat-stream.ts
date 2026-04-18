import { useState, useCallback, useTransition } from 'react';
import { flushSync } from 'react-dom';

/**
 * useAntigravityChatStream
 * Google Antigravity Protocol v2.0 - 60fps Streaming Engine
 * 
 * Intercepts incoming stream tokens and schedules them via non-blocking
 * transitions during active stream. Dispatches a high-priority flushSync 
 * ONLY upon stream completion to guarantee perfect paint.
 */
export function useAntigravityChatStream(initialMessages: any[] = []) {
    const [messages, setMessages] = useState<any[]>(initialMessages);
    const [isStreaming, startTransition] = useTransition();

    const appendToken = useCallback((messageId: string, token: string) => {
        // Yield main thread during stream loops via startTransition
        // This allows user interaction (scrolling/typing) to remain at 60fps
        startTransition(() => {
            setMessages((prev) =>
                prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, content: msg.content + token }
                        : msg
                )
            );
        });
    }, []);

    const finalizeStream = useCallback((messageId: string, finalContent: string) => {
        // Force immediate synchronized payload lock on completion
        // to prevent any final DOM tear mapping artifacts
        flushSync(() => {
            setMessages((prev) =>
                prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, content: finalContent }
                        : msg
                )
            );
        });
    }, []);

    return {
        messages,
        setMessages,
        appendToken,
        finalizeStream,
        isStreaming
    };
}

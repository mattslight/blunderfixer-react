// src/pages/analyse/hooks/useCoach.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export type Role = 'coach' | 'user' | 'typing';
export interface Msg {
  role: Role;
  text: string;
}

interface UseCoachOpts {
  fen: string;
  apiBase: string;
  heroSide: 'w' | 'b';
}

export function useCoach({ fen, apiBase, heroSide }: UseCoachOpts) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'coach',
      text: 'Hey there! Choose a position and let’s dive in...',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const push = useCallback((m: Msg) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const callCoach = useCallback(
    async (userMessage: string): Promise<string> => {
      setLoading(true);
      // build past_messages from your local thread
      const past_messages = messages
        .filter((m) => m.role !== 'typing')
        .map((m) => ({
          role: m.role === 'coach' ? 'assistant' : m.role,
          content: m.text,
        }));

      const payload = {
        fen,
        past_messages,
        user_message: userMessage,
        hero_side: heroSide,
      };

      console.log('→ /coach payload:', payload);

      const res = await fetch(`${apiBase}/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const { reply } = await res.json();
      setLoading(false);
      return reply;
    },
    [fen, messages, apiBase, heroSide]
  );

  const ask = useCallback(
    async (text: string) => {
      push({ role: 'user', text });
      push({ role: 'typing', text: 'Coach is typing…' });
      try {
        const reply = await callCoach(text);
        // remove the typing indicator
        setMessages((m) => m.filter((x) => x.role !== 'typing'));
        push({ role: 'coach', text: reply });
      } catch {
        setMessages((m) => m.filter((x) => x.role !== 'typing'));
        push({ role: 'coach', text: 'Network error—please try again.' });
      }
    },
    [callCoach, push]
  );

  const onHint = () =>
    ask('Hint: Give me a subtle nudge–without revealing the best move');
  const onFull = () =>
    ask('Full analysis: please show key moves with pros and cons');

  // reset thread when the FEN changes
  const firstFEN = useRef(fen);
  useEffect(() => {
    if (fen !== firstFEN.current) {
      setMessages([
        {
          role: 'coach',
          text: 'Hey there! Choose a position and let’s dive in...',
        },
      ]);
      firstFEN.current = fen;
    }
  }, [fen]);

  return { messages, loading, ask, onHint, onFull };
}

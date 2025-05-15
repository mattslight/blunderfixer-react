// src/pages/analyse/hooks/useCoach.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export type Role = 'coach' | 'user' | 'typing';
export interface Msg {
  role: Role;
  text: string;
}

interface UseCoachOpts {
  fen: string;
  lines: any[];
  features: any;
  legalMoves: string[];
  apiBase: string;
}

export function useCoach({
  fen,
  lines,
  features,
  legalMoves,
  apiBase,
}: UseCoachOpts) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'coach',
      text: 'Hey there! Choose a position and let’s dive in...',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  /** push a chat message */
  const push = useCallback((m: Msg) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  /** build + POST the /coach payload */
  const callCoach = useCallback(
    async (userMessage: string) => {
      setLoading(true);

      const past = messages
        .filter((m) => m.role !== 'typing')
        .map((m) => ({
          role: m.role === 'coach' ? 'assistant' : m.role,
          content: m.text,
        }));

      const payload: any = {
        fen,
        legal_moves: legalMoves,
        past_messages: past,
        user_message: userMessage,
      };

      if (!seeded) {
        payload.lines = lines.map((l: any) => ({
          rank: l.rank,
          depth: l.depth,
          scoreCP: l.scoreCP,
          mateIn: l.mateIn ?? null,
          moves: l.moves,
        }));
        payload.features = features;
        setSeeded(true);
      }

      const res = await fetch(`${apiBase}/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const { reply } = await res.json();

      setLoading(false);
      return reply as string;
    },
    [fen, legalMoves, lines, features, messages, seeded, apiBase]
  );

  /** helpers exposed to UI layer ------------- */

  const ask = useCallback(
    async (text: string) => {
      push({ role: 'user', text });
      push({ role: 'typing', text: 'Coach is thinking…' });
      try {
        const reply = await callCoach(text);
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
    ask('Hint: Give me a subtle nudge-without revealing the best move');

  const onFull = () =>
    ask('Full analysis: please show key moves with pros and cons');

  /** reset on FEN change */
  const firstFEN = useRef(fen);
  useEffect(() => {
    if (fen !== firstFEN.current) {
      setMessages([
        {
          role: 'coach',
          text: 'Hey there! Choose a position and let’s dive in...',
        },
      ]);
      setSeeded(false);
      firstFEN.current = fen;
    }
  }, [fen]);

  return { messages, loading, ask, onHint, onFull };
}

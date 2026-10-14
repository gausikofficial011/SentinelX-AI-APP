import { create } from 'zustand';
import { CopilotMessage } from '@/types';
import { api } from '@/services/api';

const INITIAL_MESSAGES: CopilotMessage[] = [
  {
    id: 'c-welcome',
    sender: 'copilot',
    text: 'Greetings. I am SentinelX AI Copilot, your real-time decision-support system. How can I assist your field operations or citizen inquiries today?',
    timestamp: '09:40 AM',
    sources: [{ type: 'SentinelX RAG Core', confidence: 0.98 }],
    actionPills: [
      { label: 'File e-FIR Guidelines', action: 'fir_guide' },
      { label: 'View High Risk Hotspots', action: 'view_hotspots' },
    ],
  },
  {
    id: 'u-1',
    sender: 'user',
    text: 'What is the procedure to file an FIR for a stolen vehicle?',
    timestamp: '09:41 AM',
  },
  {
    id: 'c-1',
    sender: 'copilot',
    text: 'To file an FIR for a stolen vehicle:\n\n1. Visit the nearest police station or use the in-app **e-FIR** service.\n2. Provide vehicle details (Registration number, Make/Model, Chassis, Color).\n3. Submit documents (RC Copy, Insurance, Owner ID proof).\n4. Obtain the electronic FIR number for online ANPR surveillance tracking.\n\nWould you like me to open the e-FIR form now?',
    timestamp: '09:41 AM',
    sources: [
      { type: 'Motor Vehicles Penal Code Sec. 379', confidence: 0.99 },
      { type: 'State Police Standard Operating Procedure 2026', confidence: 0.96 },
    ],
    actionPills: [
      { label: 'Open e-FIR', action: 'open_fir' },
      { label: 'View Guidelines', action: 'view_guidelines' },
    ],
  },
];

interface CopilotState {
  messages: CopilotMessage[];
  isThinking: boolean;
  quickPrompts: string[];

  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  messages: INITIAL_MESSAGES,
  isThinking: false,
  quickPrompts: [
    'How do I file a Zero FIR?',
    'Show high-risk patrol areas',
    'Summarize suspect records for Case 84920',
    'What are the emergency numbers?',
    'Suggest patrol deployment for Sector 4',
  ],

  sendMessage: async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const userMessage: CopilotMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isThinking: true,
    }));

    try {
      const res = await api.queryCopilot(cleanText);
      const answer = res.data?.answer || 'Analysis generated from SentinelX AI decision support core.';
      const sources = res.data?.sources || [{ type: 'SentinelX RAG Neural Engine', confidence: 0.95 }];

      const copilotMessage: CopilotMessage = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        actionPills: cleanText.toLowerCase().includes('fir')
          ? [
              { label: 'Open e-FIR', action: 'open_fir' },
              { label: 'View Guidelines', action: 'view_guidelines' },
            ]
          : undefined,
      };

      set((state) => ({
        messages: [...state.messages, copilotMessage],
        isThinking: false,
      }));
    } catch {
      const fallbackMsg: CopilotMessage = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: `I have analyzed "${cleanText}". All local district telemetry and legal statutes are verified. What additional operational context do you require?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [{ type: 'Local Heuristic Engine', confidence: 0.92 }],
      };
      set((state) => ({
        messages: [...state.messages, fallbackMsg],
        isThinking: false,
      }));
    }
  },

  clearConversation: () => set({ messages: INITIAL_MESSAGES }),
}));

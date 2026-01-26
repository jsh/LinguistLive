
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createPCMData } from '../services/audioUtils';
import { Language, Scenario, Message, SessionStatus, ProficiencyLevel } from '../types';
import Visualizer from './Visualizer';

interface VoiceChatProps {
  language: Language;
  scenario: Scenario;
  level: ProficiencyLevel;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ language, scenario, level }) => {
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setStatus(SessionStatus.IDLE);
    setIsSpeaking(false);
  }, []);

  const startSession = async () => {
    try {
      setStatus(SessionStatus.CONNECTING);
      setError(null);
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key is missing");

      const ai = new GoogleGenAI({ apiKey });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      if (!audioCtxRef.current) {
        audioCtxRef.current = {
          input: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 }),
          output: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 }),
        };
      }
      const { input: inputCtx, output: outputCtx } = audioCtxRef.current;

      const levelGuidelines = {
        'Beginning': 'Speak VERY SLOWLY. Use simple basic vocabulary. If the user makes a mistake, gently explain it. Use short sentences.',
        'Intermediate': 'Speak at a moderate, clear pace. Use standard vocabulary and some common idioms. Focus on natural conversation flow but remain helpful.',
        'Advanced': 'Speak at a native speed. Use complex vocabulary, slang, and cultural references. Challenge the user to defend their opinions or use higher-level grammar.'
      };

      let systemInstruction = `
        You are an immersive language practice partner for someone learning ${language.name}.
        The user's proficiency level is: ${level}.
        The current scenario is: ${scenario.title}.
        Context: ${scenario.description}
        Instruction for you: ${scenario.instruction}
        
        Guidelines for ${level} level:
        ${levelGuidelines[level]}

        General Rules:
        - SPEAK ONLY IN ${language.name}. 
        - Keep the conversation flowing naturally as a partner in the role-play.
        - Be enthusiastic and patient.
        - Start by greeting the user and initiating the scenario immediately in ${language.name}.`;
    if (language.name === 'Latin') {
      const classicalRules = `
CRITICAL INSTRUCTION: DO NOT CHANGE LATIN SPELLING.
- ALWAYS use 'v' and 'c' in text (e.g., 'veni, vidi, vici'). NEVER write with a 'w'.
- ALWAYS use macrons (ā, ē, ī, ō, ū, ȳ) for all text output.

AUDIO PRONUNCIATION (RESTORED CLASSICAL):
- Speak 'v' as the sound /w/ (like 'wine'). NEVER pronounce as /v/.
- Speak 'c' ALWAYS as the hard sound /k/ (like 'kite'). NEVER pronounce 'ce' as 'che' or 'ci' as 'chi'.
- Speak 'g' ALWAYS as the hard sound /g/ (like 'get'). NEVER pronounce 'ge' as 'je' or 'gi' as 'jee'.
- Speak 'h' ALWAYS (as in 'house'). NEVER make it silent.
- Speak 'y' as /y/ (rounded front vowel, like German 'ü').
- Speak 'ae' as /ai/ (like 'eye') and 'oe' as /oy/ (like 'boy').
- Speak 't' as /t/. NEVER sibilate 'ti' (e.g., 'natio' is 'nah-tee-oh').
- For the word 'vici', the audio must be /WEE-KEE/, but the text must be 'vīcī'.`; 

      systemInstruction = classicalRules + systemInstruction;
    }

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus(SessionStatus.ACTIVE);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = createPCMData(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: { data: pcmData, mimeType: 'audio/pcm;rate=16000' } });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }

            if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userText = currentInputTranscription.current;
              const modelText = currentOutputTranscription.current;

              if (userText) {
                setMessages(prev => [...prev, { role: 'user', text: userText, timestamp: Date.now() }]);
                currentInputTranscription.current = '';
              }
              if (modelText) {
                setMessages(prev => [...prev, { role: 'model', text: modelText, timestamp: Date.now() }]);
                currentOutputTranscription.current = '';
              }
            }
          },
          onerror: (e) => {
            console.error('Gemini Live API Error:', e);
            setError("Connection error. Please check your network and try again.");
            stopSession();
          },
          onclose: () => {
            setStatus(SessionStatus.IDLE);
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start conversation session.");
      setStatus(SessionStatus.ERROR);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="flex-1 overflow-y-auto mb-6 p-4 space-y-4 bg-white rounded-2xl shadow-inner border border-gray-100">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
            <div className="text-4xl mb-4">🎤</div>
            <p className="max-w-xs">Start speaking to begin your roleplay. Your conversation will appear here.</p>
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Visualizer isActive={status === SessionStatus.ACTIVE} isModelSpeaking={isSpeaking} />
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          {status === SessionStatus.IDLE || status === SessionStatus.ERROR ? (
            <button
              onClick={startSession}
              disabled={status === SessionStatus.CONNECTING}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              {status === SessionStatus.CONNECTING ? 'Connecting...' : 'Start Practice'}
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
              End Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;

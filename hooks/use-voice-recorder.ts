import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  transcript: string;
  error: string | null;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const assemblyAIClientRef = useRef<any>(null);
  const transcriberRef = useRef<any>(null);

  // Initialize AssemblyAI client
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;
    
    const initAssemblyAI = async () => {
      try {
        const { AssemblyAI } = await import('assemblyai');
        const apiKey = process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY;
        
        if (!apiKey) {
          console.error('AssemblyAI API key not found');
          return;
        }

        assemblyAIClientRef.current = new AssemblyAI({
          apiKey: apiKey,
        });
        
        console.log('AssemblyAI client initialized');
      } catch (err) {
        console.error('Failed to initialize AssemblyAI:', err);
        setError('Failed to initialize transcription service');
      }
    };

    initAssemblyAI();

    // Cleanup function
    return () => {
      if (transcriberRef.current) {
        try {
          transcriberRef.current.close();
        } catch (e) {
          console.log('Error closing transcriber:', e);
        }
      }
      if (assemblyAIClientRef.current) {
        assemblyAIClientRef.current = null;
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    // Only work on client side
    if (typeof window === 'undefined') {
      setError('Voice recording is only available in the browser.');
      return;
    }
    
    if (!assemblyAIClientRef.current) {
      setError('Transcription service not ready. Please try again.');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      setIsTranscribing(true);
      
      // Get microphone access with 16kHz sample rate
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      streamRef.current = stream;
      
      // Create MediaRecorder for 16kHz PCM
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      // Create streaming transcriber
      const transcriber = assemblyAIClientRef.current.streaming.transcriber({
        sampleRate: 16000,
        formatTurns: true
      });
      transcriberRef.current = transcriber;

      // Set up event handlers
      transcriber.on("open", ({ id }: { id: string }) => {
        console.log(`Session opened with ID: ${id}`);
        setIsTranscribing(false);
        setIsRecording(true);
      });

      transcriber.on("error", (error: any) => {
        console.error("AssemblyAI Error:", error);
        setError(`Transcription error: ${error.message || 'Unknown error'}`);
        setIsRecording(false);
        setIsTranscribing(false);
      });

      transcriber.on("close", (code: number, reason: string) => {
        console.log("Session closed:", code, reason);
        setIsRecording(false);
        setIsTranscribing(false);
      });

      transcriber.on("turn", (turn: any) => {
        if (turn.transcript) {
          console.log("Turn:", turn.transcript);
          setTranscript(prev => prev + (prev ? ' ' : '') + turn.transcript);
        }
      });

      // Connect to streaming service
      console.log("Connecting to streaming transcript service");
      await transcriber.connect();
      console.log("Connected to AssemblyAI streaming service");

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms for real-time
      
      // Handle audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && transcriberRef.current) {
          console.log('Audio data available, size:', event.data.size);
          
          // Convert audio data to stream and pipe to transcriber
          const audioBlob = event.data;
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            console.log('Sending audio chunk to transcriber, size:', arrayBuffer.byteLength);
            
            // Send audio data to transcriber
            try {
              transcriberRef.current.stream.write(new Uint8Array(arrayBuffer));
            } catch (e) {
              console.error('Error writing to transcriber stream:', e);
            }
          };
          reader.readAsArrayBuffer(audioBlob);
        }
      };
      
      console.log('Started recording with streaming transcription...');
      
    } catch (err: any) {
      console.error('Error starting recording:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (err.name === 'NotSupportedError') {
        setError('Your browser does not support audio recording. Please try Chrome, Firefox, or Safari.');
      } else {
        setError(`Failed to start recording: ${err.message || 'Unknown error'}`);
      }
      
      setIsTranscribing(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    try {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Close transcriber
      if (transcriberRef.current) {
        try {
          await transcriberRef.current.close();
          transcriberRef.current = null;
        } catch (e) {
          console.log('Error closing transcriber:', e);
        }
      }
      
      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      mediaRecorderRef.current = null;
      
      console.log('Recording stopped');
      
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording. Please try again.');
    }
  }, [isRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    transcript,
    error
  };
}

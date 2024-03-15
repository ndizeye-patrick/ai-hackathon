import { useCallback, useEffect, useRef, useState } from "react";

export const useSpeech = () => {
  const [isPlayingBuffer, setIsPlayingBuffer] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState<AudioBuffer[]>([]);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [currentSpeechText, setCurrentSpeechText] = useState<string[]>([]);
  const [sentence, setSentence] = useState<string | null>(null);
  const audioBufferSource = useRef<AudioBufferSourceNode>();
  const audioContext = useRef<AudioContext>();

  useEffect(() => {
    audioContext.current = new window.AudioContext();
    audioBufferSource.current = audioContext.current.createBufferSource();
  }, []);

  // reset this hook
  const resetSpeech = useCallback(() => {
    setAudioBuffers([]);
    setCurrentSentence(0);
    setIsPlayingBuffer(false);
  }, []);

  const genereteAudioBuffers = async ({
    input,
    onDone,
  }: {
    input: string;
    onDone?: (buffer: ArrayBuffer) => void;
  }) => {
    setSentence(input);
    const response = await fetch("/api/audio", {
      method: "POST",
      body: JSON.stringify({ text: input }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return;
    const buffer = await response.arrayBuffer();
    if (!audioContext.current) return;
    const decodeAudioData = await audioContext.current.decodeAudioData(buffer);
    setCurrentSpeechText((currentSpeechTexts) => [
      ...currentSpeechTexts,
      input,
    ]);
    setAudioBuffers((currentBuffers) => [...currentBuffers, decodeAudioData]);
    if (onDone) onDone(buffer);
    return buffer;
  };

  const generateSpeech = useCallback(
    (keepText?: boolean, nPlay?: () => void, onEnd?: () => void) => {
      try {
        if (!audioContext.current || !audioBufferSource.current) return;
        audioBufferSource.current = audioContext.current.createBufferSource();

        if (!isPlayingBuffer && audioBuffers.length > 0) {
          if (audioContext.current) {
            audioBufferSource.current =
              audioContext.current.createBufferSource();
            if (!audioContext.current || !audioBufferSource.current) return;
            const audioBuffer = audioBuffers[currentSentence];

            audioBufferSource.current.connect(audioContext.current.destination);
            audioBufferSource.current.buffer = audioBuffer;
            audioBufferSource.current.start();
            setIsPlayingBuffer(true);

            audioBufferSource.current.onended = function () {
              if (!audioContext.current || !audioBufferSource.current) return;
              audioBufferSource.current.disconnect();
              audioBufferSource.current.stop();
              setCurrentSpeechText((currentSpeechTexts) =>
                currentSpeechTexts.slice(1)
              );
              setAudioBuffers((currentBuffers) => currentBuffers.slice(1));
              setIsPlayingBuffer(false);
              if (onEnd) onEnd();
            };
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          // The stream was cancelled.
        } else {
          throw error;
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audioBuffers, isPlayingBuffer]
  );

  useEffect(() => {
    if (audioBuffers.length > 0 && !isPlayingBuffer) {
      if (audioBuffers.length === 1) {
        generateSpeech(true);
      } else generateSpeech();
    }
  }, [audioBuffers, currentSentence, generateSpeech, isPlayingBuffer]);

  return {
    genereteAudioBuffers,
    currentSpeechText,
    isPlayingBuffer,
    generateSpeech,
    resetSpeech,
    setSentence,
    sentence,
  };
};

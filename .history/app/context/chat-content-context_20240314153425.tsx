"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useLessonContext } from "./lesson-context";
import { useAppState } from "./app-state-context";

interface ChatContentContextProps {
  chatContent: string;
  setChatContent: React.Dispatch<React.SetStateAction<string>>;
  subtitle: string;
  setSubtitle: React.Dispatch<React.SetStateAction<string>>;
  markdownImage: string | null;
}

const chatContentContext = createContext<ChatContentContextProps>(undefined!);

export const ChatContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chatContent, setChatContent] = useState<string>("");
  const [subtitle, setSubtitle] = useState("");
  const imageRef = useRef<string | null>(null);
  const { imageTriggers } = useLessonContext();
  const { isAnyThingLoading } = useAppState();

  const handleImage = useCallback(() => {
    const image = imageTriggers.find(
      (imageTrigger) => imageTrigger.trigger === subtitle.trim()
    )?.image;

    if (image) {
      imageRef.current = image;
    }
  }, [imageTriggers, subtitle]);

  useEffect(() => {
    // We should clear the imageRef if there is no loading
    if (!isAnyThingLoading) {
      imageRef.current = "";
    }
    return () => {};
  }, [isAnyThingLoading]);

  const markdownImage = useMemo(() => {
    handleImage();
    if (imageRef.current && subtitle) {
      return `![${subtitle}](${imageRef.current}) `;
    }
    return "";
  }, [handleImage, subtitle]);

  return (
    <chatContentContext.Provider
      value={{
        chatContent,
        setChatContent,
        subtitle,
        setSubtitle,
        markdownImage,
      }}
    >
      {children}
    </chatContentContext.Provider>
  );
};

export const useChatContent = () => {
  return useContext(chatContentContext);
};

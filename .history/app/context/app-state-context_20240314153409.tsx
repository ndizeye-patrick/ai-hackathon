"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface ApplicationStateProps {
  isSpeaking: boolean;
  setIsSpeaking: Dispatch<SetStateAction<boolean>>;
  isTranscribing: boolean;
  setIsTranscribing: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  keepSubtitle: boolean;
  setKeepSubtitle: Dispatch<SetStateAction<boolean>>;
  showKeyPoints: boolean;
  setShowKeyPoints: Dispatch<SetStateAction<boolean>>;
  isAnyThingLoading: boolean;
}

const AppStateContext = createContext<ApplicationStateProps>(undefined!);

export const AppStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepSubtitle, setKeepSubtitle] = useState<boolean>(false);
  const [showKeyPoints, setShowKeyPoints] = useState<boolean>(true);
  const isAnyThingLoading = useMemo(
    () => isSpeaking || isTranscribing || isLoading,
    [isLoading, isSpeaking, isTranscribing]
  );
  return (
    <AppStateContext.Provider
      value={{
        isSpeaking,
        setIsSpeaking,
        isTranscribing,
        setIsTranscribing,
        isLoading,
        setIsLoading,
        keepSubtitle,
        setKeepSubtitle,
        showKeyPoints,
        setShowKeyPoints,
        isAnyThingLoading,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppStateContext);
};

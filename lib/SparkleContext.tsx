"use client";

import { createContext, useContext, useState } from "react";

interface SparkleContextType {
  sparkleSignal: number;
  triggerSparkle: () => void;
}

const SparkleContext = createContext<SparkleContextType | null>(null);

export function SparkleProvider({ children }: { children: React.ReactNode }) {
  const [sparkleSignal, setSparkleSignal] = useState(0);

  const triggerSparkle = () => {
    setSparkleSignal((prev) => prev + 1);
  };

  return (
    <SparkleContext.Provider value={{ sparkleSignal, triggerSparkle }}>
      {children}
    </SparkleContext.Provider>
  );
}

export function useSparkle() {
  const context = useContext(SparkleContext);
  if (!context) {
    throw new Error("useSparkle must be used within SparkleProvider");
  }
  return context;
}
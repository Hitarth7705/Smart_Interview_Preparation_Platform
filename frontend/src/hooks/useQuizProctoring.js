
import { useCallback, useEffect, useRef, useState } from "react";

const useQuizProctoring = ({ maxViolations = 3, onMaxViolations } = {}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [warning, setWarning] = useState("");

  const lastViolationTime = useRef(0);
  const violationCountRef = useRef(0);
  const onMaxViolationsRef = useRef(onMaxViolations);

  useEffect(() => {
    onMaxViolationsRef.current = onMaxViolations;
  }, [onMaxViolations]);

  const recordViolation = useCallback((message) => {
    const now = Date.now();

    // Avoid counting one tab switch twice when multiple browser events fire.
    if (now - lastViolationTime.current < 1500) return;

    lastViolationTime.current = now;
    violationCountRef.current += 1;

    const count = violationCountRef.current;
    setViolationCount(count);
    setWarning(message);

    if (count >= maxViolations) {
       setIsStarted(false);
  onMaxViolationsRef.current?.(count);
    }
  }, [maxViolations]);

  const startProctoredQuiz = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      setIsStarted(true);
      setIsFullscreen(Boolean(document.fullscreenElement));
      setWarning("");
      return true;
    } catch (error) {
      console.error("Could not enter fullscreen:", error);
      setWarning(
        "Full-screen permission was not granted. Please allow full-screen mode and try again."
      );
      return false;
    }
  }, []);

  const stopProctoring = useCallback(async () => {
    setIsStarted(false);
    setWarning("");

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Could not exit fullscreen:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("You switched tabs or left the quiz window.");
      }
    };

    const handleFullscreenChange = () => {
      const fullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(fullscreen);

      if (!fullscreen) {
        recordViolation("You exited full-screen mode.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isStarted, recordViolation]);

  return {
    isStarted,
    isFullscreen,
    violationCount,
    warning,
    setWarning,
    startProctoredQuiz,
    stopProctoring
  };
};

export default useQuizProctoring;

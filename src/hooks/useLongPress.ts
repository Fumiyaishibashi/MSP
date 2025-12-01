import { useRef, useCallback } from 'react';

interface UseLongPressOptions {
  threshold?: number; // ミリ秒（デフォルト: 500ms）
  onLongPress?: () => void;
}

export const useLongPress = (options: UseLongPressOptions = {}) => {
  const { threshold = 500, onLongPress } = options;
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  const handleMouseDown = useCallback(() => {
    isLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress?.();
    }, threshold);
  }, [threshold, onLongPress]);

  const handleMouseUp = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  }, []);

  const isLongPressed = useCallback(() => {
    return isLongPressRef.current;
  }, []);

  return {
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
    isLongPressed,
  };
};

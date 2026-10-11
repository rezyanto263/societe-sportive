'use client';

import { useCallback, useRef } from 'react';

export function useDragScroll<T extends HTMLElement>() {
  const elementRef = useRef<T | null>(null);

  const setElement = useCallback((element: T | null) => {
    elementRef.current = element;
  }, []);

  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onMouseDown = useCallback((event: React.MouseEvent<T>) => {
    if (event.button !== 0) return;

    const element = elementRef.current;
    if (!element) return;

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    };
  }, []);

  const onMouseMove = useCallback((event: React.MouseEvent<T>) => {
    if (!dragState.current.isDragging) return;

    const element = elementRef.current;
    if (!element) return;

    event.preventDefault();
    element.scrollLeft =
      dragState.current.scrollLeft -
      (event.clientX - dragState.current.startX);
  }, []);

  const stopDragging = useCallback(() => {
    dragState.current.isDragging = false;
  }, []);

  return {
    setElement,
    onMouseDown,
    onMouseMove,
    stopDragging,
  };
}
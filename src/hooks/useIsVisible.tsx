import { useEffect, useState, RefObject, useRef } from 'react';

interface IntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

function useSectionVisibility<T extends HTMLElement = HTMLDivElement>(
  sectionRef: RefObject<T | null>,
  options: IntersectionOptions = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observerOptions = {
      root: null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0.15
    };

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (options.triggerOnce && hasTriggered.current) return;
        
        const isIntersecting = entry.isIntersecting && 
          entry.intersectionRatio > (Array.isArray(observerOptions.threshold) 
            ? observerOptions.threshold[0] 
            : observerOptions.threshold);

        if (isIntersecting) {
          setIsVisible(true);
          hasTriggered.current = true;
        } else if (!options.triggerOnce) {
          setIsVisible(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [sectionRef, options.rootMargin, options.threshold, options.triggerOnce]);

  return isVisible;
}

export default useSectionVisibility;
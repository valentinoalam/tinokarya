'use client'
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { cerita_bergambar } from './content';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import debounce from '@/lib/debounce';
import useScrollContext from '@/hooks/useScrollTracking';
import dynamic from 'next/dynamic';
gsap.registerPlugin(ScrollTrigger);

const StoryCarousel = dynamic(() => import("./storyCarousel"));
const Pain = () => {
  const sectionRef = useRef<(HTMLDivElement | null)>(null)
  const {scrollY} = useScrollContext();
  const [halfWidth, setHalfWidth] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // Tr
  const currentContentRef = useRef(null);
  const previousContentRef = useRef(null);
  const animationRefs = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    setHalfWidth(window.innerWidth / 2);
  }, []);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        setHalfWidth(window.innerWidth / 2);
      }, 250)
    );
    
    // Observe the section for size changes
    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }
    
    // Return cleanup for the context
    return () => {
      resizeObserver.disconnect();
    };
  }, [sectionRef]);

  useEffect(() => {
    const previousContent = previousContentRef.current;
    const currentContent = currentContentRef.current;
    let isMounted = true;
    
    const cleanupAnimations = () => {
      animationRefs.current.forEach(anim => anim?.kill());
      animationRefs.current = [];
    };

    const stopAnimation = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isMounted) {
        setIsAnimating(false);
      }
    };
    
    const performAnimation = () => {
      if (!previousContent || !currentContent) return;

      cleanupAnimations();

      const direction = currentIndex > previousIndex ? "right" : "left";
      const slideDistance = halfWidth;

      gsap.set(previousContent, {
        x: 0,
        opacity: 1,
      });
      // Slide out the previous content
      const outAnimation = gsap.to(previousContent, {
        x: direction === "right" ? `-${slideDistance}px` : `${slideDistance}px`,
        opacity: 0,
        duration: 1,
        ease: "power2.in",
        onComplete: () => {
          // Slide in the current content
          const inAnimation = gsap.fromTo(
            currentContent,
            { x: direction === "right" ? `${slideDistance}px` : `-${slideDistance}px`, opacity: 0 },
            { 
              x: 0,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
              onComplete: () => {
                stopAnimation();
                setPreviousIndex(currentIndex);
              }
            }
          );
          animationRefs.current.push(inAnimation);
        }
      });

      animationRefs.current.push(outAnimation);
    };

    if (isAnimating) {
      performAnimation();
    }

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
      cleanupAnimations();
    };
  }, [currentIndex, halfWidth, isAnimating, previousIndex, scrollY]);
  
  const handleTabChange = (index: number) => {
    if (index !== currentIndex) {
      // Start animation and update current index
      setIsAnimating(true);
      setCurrentIndex(index);
    }
  };
  
  return (
    <div ref={sectionRef} className="overflow-y-visible overflow-x-hidden z-10 space-y-11">
      <Tabs defaultValue={cerita_bergambar[0].judul} className="w-full space-y-6 container relative mx-auto">
        <TabsList className="bg-transparent w-full grid-cols-4 gap-4 justify-evenly flex">
          {cerita_bergambar.map((cerita, index) => (
            <TabsTrigger key={index} value={cerita.judul} onClick={() => handleTabChange(index)}>
              {cerita.judul}
            </TabsTrigger>
          ))}
        </TabsList>
        {cerita_bergambar.map((cerita, index) => (
          <TabsContent key={index} value={cerita.judul} className={`relative h-112.5 py-9 rounded-2xl border-2 border-yellow-500/20 ${getBackgroundColor(currentIndex)} transition-colors delay-1000 duration-1000`}>
            {/* Previous Content */}
            {previousIndex !== index && (
              <StoryCarousel ref={previousContentRef} slides={cerita_bergambar[previousIndex].slides} />
            )}
            {/* Current Content */}
            <StoryCarousel className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} ref={currentContentRef} slides={cerita.slides} />
          </TabsContent>
        ))}
      </Tabs>
      <div 
          className="container relative mx-auto min-h-48 h-max border-l-4 border-red-500 px-6 py-20 mt-16 rounded-r-lg"
        >
        <p className=''>Dari cerita-cerita di atas, kita bisa melihat bahwa landing page atau website adalah alat yang sangat penting untuk bisnis di era digital.   Landing page atau website tidak hanya membantu bisnis terlihat lebih profesional, tetapi juga memudahkan pelanggan untuk mengambil tindakan.  </p>
        </div>
    </div>
  );
};

export default Pain;


function getBackgroundColor(index: number) {
  switch (index) {
    case 0:
      return "bg-gray-100"
    case 1:
      return "bg-yellow-200"
    case 2:
      return "bg-red-200"
    case 3:
      return "bg-green-200"
    case 4:
      return "bg-blue-200"
    default:
      return "bg-gray-100"
  }
}
'use client'
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
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

export type Slide = {
  title?: string;
  image: string; // Assuming gambar is a URL or path to an image
  naration?: string;
};
type Story = {
  title: string;
  slides: Slide[];
};

const StoryCarousel = dynamic(() => import("./storyRead"));
const StoryBible = ({stories, conclusion}: {stories: Story[], conclusion:string}) => {
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
    <div ref={sectionRef} className="overflow-y-visible w-full no-scrollbar pt-10 z-10 space-y-11">
      <Tabs defaultValue={stories[0].title} className="w-11/12 lg:w-fullspace-y-6 relative mx-auto">
        <TabsList className="bg-transparent flex-wrap h-max w-full grid-cols-2 gap-4 justify-evenly">
          {stories.map((cerita, index) => (
            <TabsTrigger className='truncate' key={index} value={cerita.title} onClick={() => handleTabChange(index)}>
              {cerita.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {stories.map((cerita, index) => (
          <TabsContent key={index} value={cerita.title} className="relative h-112.5 py-9 overflow-y-visible">
            <div className={`absolute h-full w-full rounded-2xl top-0 mask-radial-[50%_90%] mask-radial-from-80% mask-radial-at-center ${getBackgroundColor(currentIndex)} transition-colors delay-1000 duration-1000`} />
            {/* Previous Content */}
            {previousIndex !== index && (
              <StoryCarousel ref={previousContentRef} slides={stories[previousIndex].slides} />
            )}
            {/* Current Content */}
            <StoryCarousel className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} ref={currentContentRef} slides={cerita.slides} />
          </TabsContent>
        ))}
      </Tabs>
      <p className='container relative mx-auto min-h-48 h-max px-6 py-20 mt-16 rounded-r-lg'>{conclusion}</p>
    </div>
  );
};

export default StoryBible;


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
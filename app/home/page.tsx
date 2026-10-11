"use client"
import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import handleInitialization from '@/lib/analytics';
import Hero from './_components/Hero/view';
import colorSections from '@/config/theme';
import Loading from './loading';
gsap.registerPlugin(ScrollTrigger);
const sections = [
  { id: 'benefits', color: 'hsl(150, 40%, 85%)', Component: dynamic(() => import("./_components/Benefits/view"), { ssr: false, loading: () => <Loading /> }) },
  { id: 'portfolio', color: 'hsl(330, 60%, 80%)', Component: dynamic(() => import("../_components/Portfolio/view"), { ssr: false, loading: () => <Loading /> }) },
  { id: 'faq', color: 'hsl(210, 70%, 70%)', Component: dynamic(() => import("./_components/FAQ/view"), { ssr: false, loading: () => <Loading /> }) },
  { id: 'contact', color: 'hsl(200, 100%, 50%)', Component: dynamic(() => import("./_components/Contact/view"), { ssr: false, loading: () => <Loading /> }) }
];  

export default function Home() {
  const scrollContainerRef = useRef<HTMLElement>(null)
  const triggers = useRef<ScrollTrigger[]>([]);
  const ctx: RefObject<gsap.Context | null> = useRef(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleInit = handleInitialization();
    if(!scrollContainerRef) return
    // Event listener management
    if (document.readyState === 'complete') {
      window.addEventListener('load', handleInit);
    }
    return () => {
      window.removeEventListener('load', handleInit);
    };
  }, [scrollContainerRef]);
  useEffect(() => {

    // Create resize handler with debouncing
    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        ScrollTrigger.refresh(); // Recalculates ScrollTrigger positions
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);
  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const handleColorChange = (color: string) => {
      // Kill any ongoing color transitions
      gsap.killTweensOf(scrollContainer);
      
      gsap.to(scrollContainer, {
        backgroundColor: color,
        duration: 1.2,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onStart: () => {
          // Force layout reflow for smoother transitions
          scrollContainer.style.willChange = 'background-color';
        },
        onComplete: () => {
          scrollContainer.style.willChange = 'auto';
        }
      });
    };
    const handleAdjacentColor = (adjacentIndex: number, direction: number) => {
      const targetIndex = direction > 0 
        ? Math.min(adjacentIndex, sections.length - 1)
        : Math.max(adjacentIndex, 0);
  
      if (colorSections[targetIndex]) {
        handleColorChange(colorSections[0][targetIndex].color);
      }
    };
    // Register plugins and create GSAP context
    gsap.registerPlugin(ScrollTrigger);
    ctx.current = gsap.context(() => {
      // Clear previous triggers
      triggers.current.forEach(trigger => trigger.kill());
      triggers.current = [];

      sections.forEach((section, index) => {
        const trigger = ScrollTrigger.create({
          trigger: `#${section.id}`,
          start: 'top center',
          end: 'bottom center',
          preventOverlaps: true,
          onEnter: () => handleColorChange(section.color),
          onEnterBack: () => handleColorChange(section.color),
          onLeave: ({ direction }) => handleAdjacentColor(index + 1, direction),
          onLeaveBack: ({ direction }) => handleAdjacentColor(index - 1, direction),
          markers: false // Enable for debugging
        });

        triggers.current.push(trigger);
      });
    }, scrollContainer);

    return () => {
      // Proper cleanup
      ctx.current?.revert();
      gsap.killTweensOf(scrollContainer);
      triggers.current = [];
    };
  }, []); // Re-run when container is available

  return (
    <main ref={scrollContainerRef} className="w-full h-max text-foreground">
      <Hero />
      {sections.map(({ id, Component }) => (
        <section 
          key={id} 
          id={id}
          className="w-full min-h-screen h-max relative"
        >
          <Component />
        </section>
      ))}
    </main>
  );
}
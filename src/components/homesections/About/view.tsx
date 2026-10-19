'use client'
import SparklesText from '@/components/ui/sparkles-text';
// import useBackgroundColor from '@/hooks/useBgColor';
// import { hexToRgba } from '@/utils/color-utils';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from "next-intl";

// import { TypingAnimation } from '@/components/ui/typing-animation';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  // const { bgColor } = useBackgroundColor();
  const t = useTranslations("About");
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([storyRef.current, missionRef.current, approachRef.current], {
        opacity: 0,
        y: 50,
        scale: 0.9
      });

      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 0.5,
        rotation: -10
      });

      // Create main timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          markers: false, // Remove this in production
          onEnter: () => console.log("Animation started"),
          onLeave: () => console.log("Animation ended")
        }
      });

      // Animate image first
      mainTl.to(imageRef.current, {
        opacity: 0.6,
        scale: 1.75,
        rotation: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Animate sections sequentially
      mainTl.to(storyRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .to(missionRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")
      .to(approachRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3");

      // Create individual scroll triggers for highlighting
      [storyRef, missionRef, approachRef].forEach((ref) => {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => {
            // Reset all sections first
            [storyRef, missionRef, approachRef].forEach(resetRef => {
              const h2 = resetRef.current?.querySelector('h2');
              const p = resetRef.current?.querySelector('p');
              if (h2) {
                gsap.to(h2, {
                  color: 'inherit',
                  textShadow: 'none',
                  duration: 0.3
                });
              }
              if (p) {
                gsap.fromTo(p, {
                  color: 'inherit',
                  opacity: 0.3
                },{
                  color: 'inherit',
                  opacity: 1,
                  duration: 0.3
                });
              }
            });

            // Highlight current section
            const h2Element = ref.current?.querySelector('h2');
            const pElement = ref.current?.querySelector('p');
            if (h2Element) {
              gsap.to(h2Element, {
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                duration: 0.5,
                ease: "power2.out"
              });
            }
            if (pElement) {
              gsap.to(pElement, {
                color: 'red',
                duration: 0.5,
                ease: "power2.out"
              });
            }
          },
          onLeave: () => {
            const h2Element = ref.current?.querySelector('h2');
            const pElement = ref.current?.querySelector('p');
            if (h2Element) {
              gsap.to(h2Element, {
                color: 'inherit',
                textShadow: 'none',
                duration: 0.3
              });
            }
            if (pElement) {
              gsap.to(pElement, {
                color: 'inherit',
                duration: 0.3
              });
            }
          },
          onEnterBack: () => {
            // Reset all sections first
            [storyRef, missionRef, approachRef].forEach(resetRef => {
              const h2 = resetRef.current?.querySelector('h2');
              const p = resetRef.current?.querySelector('p');
              if (h2) {
                gsap.to(h2, {
                  color: 'inherit',
                  textShadow: 'none',
                  duration: 0.3
                });
              }
              if (p) {
                gsap.to(p, {
                  color: 'inherit',
                  duration: 0.3
                });
              }
            });

            // Highlight current section
            const h2Element = ref.current?.querySelector('h2');
            const pElement = ref.current?.querySelector('p');
            if (h2Element) {
              gsap.to(h2Element, {
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                duration: 0.5,
                ease: "power2.out"
              });
            }
            if (pElement) {
              gsap.to(pElement, {
                color: 'red',
                duration: 0.5,
                ease: "power2.out"
              });
            }
          }
        });
      });

      // Floating animation for image
      gsap.to(imageRef.current, {
        y: "+=20",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2
      });

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div id='about' className="w-full min-h-screen relative overflow-y-visible z-10" ref={containerRef}>
      {/* Gradient Overlay at Top */}
      <div 
        // style={{
        //   background: `linear-gradient(to bottom, ${hexToRgba(bgColor, 0.9)}, ${bgColor} 30%)`
        // }}
        className={`inset-x-0 w-full -top-10 h-40 pointer-events-none`}
      ></div>

      <div className="flex flex-col mb-20 gap-14 lg:gap-20 z-50 px-5 mx-auto max-w-7xl md:px-10">
        {/* Image */}
        <Image
          ref={imageRef}
          src="/images/small-business-web-design-fm.svg"
          width={256}
          height={283}
          loading="lazy"
          className="absolute z-10 scale-175 opacity-60 left-1/4 top-1/3 aspect-auto"
          alt="setting"
          style={{
            width: "256px",
            height: "283px",
          }}
        />
        
        {/* Content */}
        <div className="flex z-30 flex-col gap-14 lg:gap-20">
          {/* Our Story Section */}
          <div className="flex flex-col gap-5 md:flex-row" ref={storyRef}>
            <h2 className="flex-1 text-3xl font-bold md:text-5xl transition-colors duration-300">
              <SparklesText sparklesCount={6} text={t("story.title")} />
            </h2>
            <p className="flex-1 leading-none text-lg transition-colors">{t("story.description")}</p>
          </div>

          {/* Mission Section */}
          <div className="flex flex-col gap-5 md:flex-row" ref={missionRef}>
            <h2 className="flex-1 text-3xl font-semibold md:text-5xl transition-colors duration-300">
              <SparklesText sparklesCount={4} colors={{first: '#A6F1E0', second: '#FFAB5B'}} text={t("mission.title")} />
            </h2>
            <p className="flex-1 leading-none text-lg transition-colors">{t("mission.description")}</p>
          </div>

          {/* Approach Section */}
          <div className="flex flex-col gap-5 md:flex-row" ref={approachRef}>
            <h2 className="flex-1 text-3xl font-bold md:text-5xl transition-colors duration-300">
              <SparklesText sparklesCount={3} colors={{first: '#BE5985', second: '#FFB200'}} text={t("approach.title")} />
            </h2>
            <p className="flex-1 leading-none text-lg transition-colors" >{t("approach.description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
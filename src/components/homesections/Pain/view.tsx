'use client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useTranslations } from "next-intl";
import { BrochurePoints, PainPoints } from '@/i18n/types';
import CrumpleFlyerSection from './CrumpleFlyerSection';
gsap.registerPlugin(ScrollTrigger);

const Pain = () => {
  const sectionRef = useRef<(HTMLDivElement | null)>(null)
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const conclusionRef = useRef(null);
  const t = useTranslations("Pain");
  const brochure = {
    headline: t("brochure.headline"),
    intro: t("brochure.intro"),
    points: (t.raw("brochure.points") as BrochurePoints[])
  }
  useEffect(() => {
    const scrollTriggers: ScrollTrigger[] = [];

    // Helper function to create scroll triggers
    const createScrollTrigger = (
      element: gsap.DOMTarget,
      animation: gsap.TweenVars,
      triggerConfig: ScrollTrigger.Vars
    ) => {
      const tl = gsap.fromTo(element, animation.from, animation.to);
      const st = ScrollTrigger.create({
        trigger: element,
        animation: tl,
        ...triggerConfig
      });
      scrollTriggers.push(st);
    };

    // Header animation
    if (titleRef.current) 
      createScrollTrigger(
        titleRef.current,
        { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 1 } },
        { start: "top 80%", toggleActions: "play none none reverse" }
      );

    if (subtitleRef.current)
      createScrollTrigger(
        subtitleRef.current,
        { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0, duration: 1, delay: 0.2 } },
        { start: "top 80%", toggleActions: "play none none reverse" }
      );

    // Cards stagger animation
    if (cardsRef.current.length > 0) 
      cardsRef.current.forEach((card, index) => {
        if (card) {
          createScrollTrigger(
            card,
            { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 0.8, delay: index * 0.2 } },
            { start: "top 75%", toggleActions: "play none none reverse" }
          );
        }
      });

    // Conclusion fade in and slide
    if (conclusionRef.current)
      createScrollTrigger(
        conclusionRef.current,
        { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0, duration: 1 } },
        { start: "top 80%", toggleActions: "play none none reverse" }
      );
    
    return () => {
      scrollTriggers.forEach(st => st.kill());
    };
  }, []);

  
  return (
    <section id='pain' ref={sectionRef} className="overflow-x-hidden scrollbar-none z-10 space-y-11">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-4xl font-bold text-red-500 mb-4 opacity-0">
            {t("title")}
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-900/70 dark:text-amber-50/70">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {(t.raw("points") as PainPoints[]).map((point, index) => (
            <div 
              key={index}
              ref={el => { cardsRef.current[index] = el; }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>

        <div 
          ref={conclusionRef}
          className="relative bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg opacity-0"
        >
          <p className="text-lg text-gray-800">{t("conclusion")}</p>
          
          <CrumpleFlyerSection brochure={brochure} />
        </div>
      </div>
      
    </section>
  );
};

export default Pain;


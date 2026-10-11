"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from 'gsap';

export interface ProjectItem {
  id: string | number;
  tabTitle: string;
  title: string;
  description: string;
  image: string;
  color: string;
  /** Halaman studi kasus internal, dibuka di tab baru saat kartu diklik. */
  href: string;
  /** Website live proyek, dibuka di tab baru lewat tombol terpisah. */
  websiteUrl?: string;
  tags?: string[];
  textColor?: string;
}

interface AnimatedCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  smoothProgress: MotionValue<number>;
}

function buildCardKeyframes(index: number, totalCards: number) {
  const steps: number[] = [];
  const yValues: number[] = [];
  const scaleValues: number[] = [];
  const numTransitions = Math.max(totalCards - 1, 1);

  for (let step = 0; step <= numTransitions; step++) {
    const progress = step / numTransitions;
    steps.push(progress);

    if (step < index) {
      yValues.push(900);
      scaleValues.push(1);
    } else if (step === index) {
      yValues.push(0);
      scaleValues.push(1);
    } else {
      const stackDepth = step - index;
      yValues.push(-stackDepth * 48);
      scaleValues.push(1 - stackDepth * 0.038);
    }
  }

  if (index === 0) {
    return { steps, y: yValues, scale: scaleValues };
  }

  const entryStart = (index - 1) / numTransitions;
  const entryEnd = index / numTransitions;
  const fullSteps: number[] = [];
  const fullY: number[] = [];
  const fullScale: number[] = [];

  for (let i = 0; i < steps.length; i++) {
    if (steps[i] < entryStart) {
      fullSteps.push(steps[i]);
      fullY.push(900);
      fullScale.push(1);
    }
  }

  fullSteps.push(entryStart);
  fullY.push(900);
  fullScale.push(1);

  for (let i = 0; i < steps.length; i++) {
    if (steps[i] >= entryEnd) {
      fullSteps.push(steps[i]);
      fullY.push(yValues[i]);
      fullScale.push(scaleValues[i]);
    }
  }

  return { steps: fullSteps, y: fullY, scale: fullScale };
}

function AnimatedCard({
  project,
  index,
  totalCards,
  smoothProgress,
}: AnimatedCardProps) {
  const keyframes = buildCardKeyframes(index, totalCards);
  const y = useTransform(smoothProgress, keyframes.steps, keyframes.y);
  const scale = useTransform(smoothProgress, keyframes.steps, keyframes.scale);

  return (
    <motion.div
      style={{
        y,
        scale,
        zIndex: 700 + index * 10,
        transformOrigin: "center top",
        willChange: "transform",
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-x-0 top-0 w-full select-none"
    >
      {/*
        Pola "stretched link": satu <a> utama menutupi seluruh kartu lewat
        ::after, sedangkan link website berada di atasnya (relative z-10).
        Dengan begitu tidak ada <a> bersarang (HTML tidak valid).
      */}
      <article className="group relative box-border w-full pt-14">
        <div
          style={{ backgroundColor: project.color }}
          className="absolute left-0 top-0 flex h-12 w-44 items-center rounded-t-2xl px-4 text-base font-semibold tracking-tight text-black shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] sm:h-14 sm:w-60 sm:px-6"
        >
          <span className="truncate">{project.tabTitle}</span>
        </div>

        <div
          style={{ backgroundColor: project.color }}
          className="relative grid min-h-112 grid-cols-1 items-center gap-6 overflow-hidden rounded-b-2xl rounded-tr-2xl p-6 shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12),inset_0_-2px_4px_-2px_rgba(0,0,0,0.25)] sm:p-8 md:min-h-[33rem] md:grid-cols-[minmax(0,1.12fr)_minmax(16rem,0.88fr)] md:gap-14 md:p-8"
        >
          <div className="z-10 flex flex-col items-start gap-3.5">
            {project.tags && project.tags.length > 0 ? (
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-black/[0.07] px-3 py-1 text-xs font-medium text-black/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <h3 className="m-0 text-2xl font-medium leading-tight tracking-tight text-black sm:text-3xl">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit no-underline outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-black"
              >
                {project.title}
                <span className="sr-only"> (studi kasus, buka di tab baru)</span>
              </a>
            </h3>

            <p className="m-0 text-base font-normal leading-snug tracking-normal text-black/60 sm:text-lg">
              {project.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-neutral-800"
              >
                Baca studi kasus
              </span>

              {project.websiteUrl ? (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center rounded-full border border-black/25 px-5 py-2.5 text-sm font-medium text-black no-underline transition-colors hover:bg-black/6 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Kunjungi website
                  <span className="sr-only"> (buka di tab baru)</span>
                </a>
              ) : null}
            </div>
          </div>

          <div className="relative h-60 w-full overflow-hidden rounded-xl bg-white/25 sm:h-72 md:h-96 lg:h-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt=""
              decoding="async"
              loading={index === 0 ? "eager" : "lazy"}
              className="block work-item h-full w-full rounded-xl object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
            />
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export interface ScrollStackDeckProps {
  projects: ProjectItem[];
  title?: string;
  subtitle?: string;
  scrollIndicatorText?: string;
  className?: string;
  showFooter?: boolean;
  /** Aktifkan hanya jika deck dipakai sebagai halaman penuh. */
  enableLenis?: boolean;
  /** Nested overflow parent. Omit on a full-page landing (window + Lenis). */
  container?: RefObject<HTMLElement | null>;
}

export function ScrollStackDeck({
  projects,
  title = "",
  subtitle = "",
  scrollIndicatorText = "",
  className = "",
  showFooter = false,
  enableLenis = false,
  container,
}: ScrollStackDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const showIntro = Boolean(title || subtitle || scrollIndicatorText);

  useEffect(() => {
    if (!enableLenis || container) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let animationFrameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [enableLenis, container]);

    
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 100%',
          end: 'bottom 100%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    ...(container ? { container } : {}),
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.15,
    restDelta: 0.0001,
  });

  return (
    <div
      className={`w-full bg-[#F4F6F8] font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white ${className}`}
    >
      {showIntro ? (
        <div className="flex w-full flex-col items-center justify-center px-4 text-center">
          <div className="flex max-w-3xl flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-2.5">
              {title ? (
                <h2 className="m-0 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="m-0 max-w-2xl text-xl font-normal leading-relaxed tracking-tight text-neutral-600 sm:text-2xl">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {scrollIndicatorText ? (
              <div className="mt-2 flex items-center justify-center gap-2.5">
                <span className="text-lg font-normal leading-relaxed tracking-tight text-neutral-600 sm:text-xl">
                  {scrollIndicatorText}
                </span>
                <motion.svg
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                  className="h-6 w-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 4.75v13.5M6.75 13.75l5.25 5.5 5.25-5.5" />
                </motion.svg>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <section
        ref={containerRef}
        aria-label="Showcase karya"
        className="relative w-full"
        style={{ height: `${projects.length * 110}vh` }}
      >
        <div className="pointer-events-none sticky top-0 grid h-screen min-h-screen w-full place-items-center px-4">
          <div className="pointer-events-auto relative h-148 min-h-148 w-[min(calc(100%-2rem),62.5rem)] overflow-visible">
            {projects.map((project, index) => (
              <AnimatedCard
                key={project.id}
                project={project}
                index={index}
                totalCards={projects.length}
                smoothProgress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </section>

      {showFooter ? (
        <footer className="flex h-[50vh] flex-col items-center justify-center gap-2 text-sm text-neutral-500">
          <p>Portofolio</p>
        </footer>
      ) : null}
    </div>
  );
}

export default ScrollStackDeck;
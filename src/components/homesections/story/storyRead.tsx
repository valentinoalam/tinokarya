"use client";
import gsap from 'gsap';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { forwardRef, useEffect, useState } from "react";

import Image from "next/image";
import { Slide } from './bible';

interface CarouselProps {
  slides: Slide[];
  className?: string;
}

const StoryCarousel = forwardRef<HTMLDivElement, CarouselProps>(({ slides, className }, ref) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>()
  useEffect(() => {
    const element = document.querySelector('.current');
    const parent = document.querySelector('#content');
  
    // Early return if the element or parent doesn't exist
    if (!element || !parent) return;
  
    const children = parent.children;
  
    // Early return if there are no children or the currentSlideIndex is out of bounds
    if (!children.length || currentSlideIndex >= children.length || currentSlideIndex < 0) return;
  
    // Clear any existing tweens on the element
    gsap.killTweensOf(element);
  
    // Check if the current element is the first child of the current slide
    const isCurrentSlideElement = children[currentSlideIndex].children[0] === element;
  
    if (isCurrentSlideElement) {
      // Set the initial state for the first render
      gsap.set(element, {
        scale: 1.25,
        opacity: 1,
        transformOrigin: 'center', // Ensure scaling originates from the center
      });
  
      // Animate the element in (optional, if you want to animate it in later)
      gsap.fromTo(
        element,
        {
          scale: 1,
          opacity: 0,
        },
        {
          scale: 1.25,
          opacity: 1,
          duration: 0.3,
          ease: 'power1.inOut',
        }
      );
    } else {
      // Animate the element out
      gsap.to(element, {
        scale: 1,
        opacity: 0,
        duration: 0.3,
        ease: 'power1.inOut',
      });
    }
  }, [currentSlideIndex]);
  useEffect(() => {
    if (!api) {
      return
    }

    setCurrentSlideIndex(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrentSlideIndex(api.selectedScrollSnap())
    })
  }, [api])
  // Function to calculate opacity based on distance from the current slide
  const calculateOpacity = (index: number) => {
    const distance = Math.abs(index - currentSlideIndex); // Calculate the distance
    // if distance >= 2? 
    return distance >= 2? 0:50; //Math.max(0, 100 - distance * 50); // Subtract 25% for each step
  };
  return (
    (<Carousel ref={ref} setApi={setApi} className={cn(`w-full max-w-xs mx-auto`, className)}>
      <CarouselContent id='content'>
      {slides.map((slide, index) => {
        const opacity = calculateOpacity(index); // Get the opacity for this slide
        const isActive = index === currentSlideIndex; // Check if this is the active slide
        return (
          (<CarouselItem key={index} className="self-center">
            {isActive ? (
              <NeonGradientCard borderRadius={6} className="current w-full bg-none scale-125 h-max shadow-emerald-400 shadow-md">
                
                <CardContent className='h-96 px-0 overflow-visible relative mb-5'>
                  <Image
                    src={slide.image}
                    alt={slide.title?? `cover-image-${index}`}
                    width={465} height={382}
                    className="w-full h-auto aspect-auto object-top rounded-lg top-1 mask-b-from-95%"
                    quality={75} loading='lazy'
                    />
                </CardContent>
                {slide.naration &&<CardFooter className="absolute bottom-0 place-self-center z-60 -mt-8 border-t-2 w-[110%] bg-white/90 border-slate-900 text-slate-950 shadow-md rounded-3xl hover:text-black">
                 {/* absolute -bottom-16 left-6 w-[300px] p-4 bg-inherit border-slate-900 text-slate-900 border shadow-lg rounded-3xl hover:text-black hover:shadow-xl */}
                  <CardDescription className='text-xs pt-6'>{slide.naration}</CardDescription>
                </CardFooter>}
              </NeonGradientCard>
            ) : (
              <Card className={`h-96 bg-opacity-80 blur-xs bg-transparent ${opacity===0? 'hidden': 'opacity-50'}`}>
                <CardHeader className="border-b-2 p-2 text-center">
                  <CardTitle>{slide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <Image src={slide.gambar} alt={slide.title} className="w-full h-64 object-cover rounded-lg" /> */}
                </CardContent>
                <CardFooter className="border-t-2 p-3">
                  <CardDescription>{slide.naration}</CardDescription>
                </CardFooter>
              </Card>
            )}
          </CarouselItem>)
        );})}
      </CarouselContent>
      <CarouselPrevious className='text-amber-300 bg-red-400 stroke-current' />
      <CarouselNext className='text-amber-300 bg-blue-400 stroke-current' />
    </Carousel>)
  );
});

export default StoryCarousel;
StoryCarousel.displayName = "StoryCarousel";
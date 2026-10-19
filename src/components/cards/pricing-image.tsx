"use client"

import { NeonGradientCard } from "@/components/ui/neon-gradient-card"
import { cn } from "@/lib/utils"
// We will replace ChevronLeft/Right with CarouselPrevious/Next buttons, 
// so these imports are no longer strictly needed for navigation, 
// but we'll keep the required imports for the Carousel component
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
// useState, ChevronLeft, ChevronRight are no longer needed
// import { useState } from "react" 

// Import the Embla Carousel Autoplay plugin
import Autoplay from "embla-carousel-autoplay"

function PricingImage({ images, name, className }: { images: string[] | string; name: string; className?: string }) {
  // Custom carousel logic removed, along with useState for image index.

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Use the function to get random colors
  const firstColor = getRandomColor();
  const secondColor = getRandomColor();

  // If images is not an array or is an empty array, return early
  if (!images || (Array.isArray(images) && images.length === 0)) return null

  // Helper to check if images is a non-empty array
  const isCarousel = Array.isArray(images) && images.length > 0

  return (
    <NeonGradientCard
      className={cn("relative", className)}
      neonColors={{ firstColor, secondColor }}
    >
      {isCarousel ? (
        <Carousel
          // Add the Autoplay plugin for autoscroll
          plugins={[
            Autoplay({
              delay: 3000, // Autoscroll every 3 seconds (adjust as needed)
              stopOnInteraction: false, // Keep autoscrolling even if the user interacts
            }),
          ]}
          opts={{
            align: "start",
            loop: true, // Ensure looping for continuous scroll
          }}
          className="w-full"
        >
          <div className="relative h-80 overflow-hidden rounded-2xl">
            <CarouselContent className="h-full rounded-lg">
              {images.map((src, index) => (
                <CarouselItem key={index} className="p-0 rounded-lg">
                  <Image
                    width={400} // Set the desired width
                    height={400} // Set the desired height
                    src={src}
                    alt={`${name} preview ${index + 1}`}
                    className="object-cover rounded-lg w-full h-full"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          {/* Default Carousel navigation buttons */}
          {/* <CarouselPrevious className="absolute p-2 transform -translate-y-1/2 rounded-full left-2 top-1/2 bg-white/80 w-8 h-8" />
          <CarouselNext className="absolute p-2 transform -translate-y-1/2 rounded-full right-2 top-1/2 bg-white/80 w-8 h-8" /> */}
        </Carousel>
      ) : (
        // Render single image if images is a string (original logic)
        typeof images === "string" && (
          <Image
            fill
            src={images}
            alt={`${name}`}
            className="object-cover w-full h-full"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        )
      )}
    </NeonGradientCard>
  )
}

export default PricingImage
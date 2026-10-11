// 'use client'
// import React, { useState, useEffect } from "react";
// import GalleryFilter from "./gallery-filter";
// import GalleryItem from "./gallery-item";
// import { galleryItems } from "@/data/gallery-data";

// const Gallery: React.FC = () => {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [filteredItems, setFilteredItems] = useState(galleryItems);
//   const [isAnimating, setIsAnimating] = useState(false);

//   useEffect(() => {
//     setIsAnimating(true);
    
//     const timer = setTimeout(() => {
//       if (activeCategory === "all") {
//         setFilteredItems(galleryItems);
//       } else {
//         setFilteredItems(
//           galleryItems.filter((item) => item.category === activeCategory)
//         );
//       }
      
//       setIsAnimating(false);
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [activeCategory]);

//   return (
//     <section className="py-16 px-4 max-w-7xl mx-auto">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Gallery</h2>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Explore our collection of stunning projects showcasing our expertise and creative vision.
//         </p>
//       </div>

//       <GalleryFilter
//         activeCategory={activeCategory}
//         setActiveCategory={setActiveCategory}
//       />

//       <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
//         {filteredItems.map((item) => (
//           <GalleryItem key={item.id} item={item} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Gallery;
'use client';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MagicText } from "@/components/ui/magic-text";
import { LightRays } from "@/components/ui/light-rays"
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from 'gsap';
const PortfolioGallery = ({ projects }: { projects: Array<{ image: string; title: string; description: string; link: string }> }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 100%',
          end: 'bottom 100%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} id="study-case" className="relative overflow-y-visible w-full overflow-x-hidden pt-12 pb-36 min-h-screen container px-4 max-w-7xl mx-auto">
      <div className="mb-16 w-full relative text-center">
        <MagicText className="text-6xl text-black font-bebas text-shadow-4xl/60 font-black text-center mb-4 md:text-8xl">
          Featured Work
        </MagicText>
        <p className="w-full mx-auto text-lg text-stone-800">
          Explore our latest projects and see how we different from other agencies.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 gap-6">
        {projects.map((project, index) => (
          <motion.a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="work-item relative group hover:-translate-y-3 hover:p-0 overflow-hidden p-0.5 bg-zinc-600 transition-transform duration-500 border-2 hover:border-0 border-accent-300/70 outline-5 outline-accent-50 rounded-2xl shadow-amber-950 shadow-xl cursor-pointer block"
          >
            <AspectRatio ratio={12 / 9}>
              <Image fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={project.image}
                alt={project.title}
                className="object-cover group-hover:-translate-y-4 rounded-xl shadow-blue-950 w-full h-full transition-transform duration-500 group-hover:scale-110"
                style={{ boxShadow: "inset 2px 2px 3px rgba(0, 0, 0, 0.7)" }}
              />
            </AspectRatio>
            <div className="absolute w-full h-full backdrop-blur-xs inset-0 bg-linear-to-t from-slate-900/60 to-green-300/20 shadow-inner/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-stone-300/80 mt-2 text-center px-3">{project.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
      
      <LightRays />
    </section>
  );
};

export default PortfolioGallery;

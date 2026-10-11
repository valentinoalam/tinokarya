// import dynamic from "next/dynamic";

// const PortfolioGallery = dynamic(() => import("./gallery"));

// export default function StudyCaseSection() {
//   const projects = [
//     // { image: "/karya/rendang-ponky.png", title: "Rendang Ponky Website", description: "A landing page for Rendang Ponky.", link: "https://rendang-ponky.vercel.app/" },
//     {
//       image: "/karya/barbershop.png",
//       title: "Barbershop Landing Page",
//       description: "Modern landing page design for a barbershop.",
//       link: "https://barbershop-tino.vercel.app/",
//     },
//     {
//       image: "/karya/carwash.png",
//       title: "Carwash Landing Page",
//       description: "Demo website for carwash business.",
//       link: "https://carwash-tino.vercel.app/",
//     },
//   ];

//   return (
//     <div className="relative">
//       <PortfolioGallery projects={projects} />
//     </div>
//   );
// }

import { ScrollStackDeck } from "@/components/scroll-stack-deck";
import { showcaseProjects } from "@/data/case-studies";

/**
 * Pasang di halaman mana pun: <ShowcaseSection />
 * id="karya" dipakai sebagai target tautan "/#karya".
 */
export function ShowcaseSection() {
  return (
    <section id="karya" className="scroll-mt-4">
      <ScrollStackDeck
        projects={showcaseProjects}
        title="Karya"
        subtitle="Proyek Next.js yang saya bangun. Klik kartu untuk membaca studi kasusnya."
        scrollIndicatorText="Scroll"
      />
    </section>
  );
}

export default ShowcaseSection;
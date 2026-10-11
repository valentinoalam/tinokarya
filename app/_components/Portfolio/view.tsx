import dynamic from "next/dynamic"
const PortfolioGallery = dynamic(() => import("./gallery"));
export default function StudyCaseSection() {
  const projects = [
    { image: "/karya/rendang-ponky.png", title: "Rendang Ponky Website", description: "A landing page for Rendang Ponky.", link: "https://rendang-ponky.vercel.app/" },
    { image: "/karya/barbershop.png", title: "Barbershop Landing Page", description: "Modern landing page design for a barbershop.", link: "https://barbershop-landingpage-puce.vercel.app/" },
    { image: "/karya/carwash.png", title: "Carwash Landing Page", description: "Demo website for carwash business.", link: "https://carwash-landingpage.vercel.app/" },
    // { image: "/karya/landingpage.jpg", title: "Generic Landing Page", description: "A demo landing page with modern UI.", link: "https://landing-page-nine-beta-45.vercel.app/" },
    // { image: "/karya/accounting.jpg", title: "Accounting App", description: "An accounting application with transactions and reporting.", link: "#" },
    // { image: "/karya/quran.jpg", title: "AlQuran Data Management", description: "App for storing Surah and Ayah data from Google Drive.", link: "#" },
    // { image: "/karya/invoice.jpg", title: "Invoice Management System", description: "System to manage invoices with flowchart and ERD.", link: "#" },
    // { image: "/karya/portfolio.jpg", title: "Portfolio Website", description: "Personal portfolio with gallery section.", link: "#" },
  ];


  return <PortfolioGallery projects={projects} />;
}
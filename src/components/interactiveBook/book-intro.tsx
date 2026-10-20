import { cn } from '@/lib/utils'
import { RefObject } from 'react';
import { useTranslations } from "next-intl";

const BookIntro = ({view, oldRef, newRef} : {view:number, oldRef: RefObject<HTMLParagraphElement | null>; newRef: RefObject<HTMLParagraphElement | null>  }) => {
  const t = useTranslations("Book");
  return (
    <div className="wrap lg:w-1/2 absolute left-0 top-0 lg:-top-3">
        <h2 style={{ fontSize: "clamp(1.9rem, 4.2vw, 2.8rem)"}} className={cn('max-w-[20ch] text-ink mb-8 transition-all ease-out duration-500', view===0? '':'blur-[2px]')} data-reveal>
          {t("title")}
        </h2>
        <p className={cn("hidden md:flex mb-2 font-display tracking-wide font-medium leading-4 line-through decoration-3 text-gray-500 mx-2 max-w-[24ch] transition-all ease-out duration-500", view===0? 'blur-[1px]':'blur-[2px]')} style={{fontSize: "clamp(1.4rem, 3vw, 1.6rem)"}} ref={oldRef}>{t("subtitle")}</p>

        <p className={cn("hidden md:inline font-display tracking-wide font-extrabold leading-18 mt-4 relative transition-all duration-300", view===0? "z-60 text-accent" : "-z-10 text-muted")} style={{fontSize: "clamp(1.9rem, 4.6vw, 3.3rem)"}} ref={newRef}>
          {t("newLine").split(" ").map((w, i) => (
            <span key={i}>
              <span className='transition-all ease-out duration-700' style={{filter: `blur(${view===0?0:Math.floor((i+1)/2)}px)`}} data-word>{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
  )
}

export default BookIntro
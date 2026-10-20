import Image from "next/image";
import React, { forwardRef } from 'react';
import { TextureOverlay } from "../ui/texture-overlay";
import { useTranslations } from "next-intl";

interface PageProps {
  index: number;
  iscover: boolean;
  nextPage: ()=>void;
  previousPage: ()=>void;
}

// Paragraf biasa berupa string. Diawali "• " = poin daftar.
// "strike" = teks dicoret (cara lama), "quote" = kutipan brand.
type Paragraph = string | { text: string; variant: 'strike' | 'quote' };

interface Face {
  title?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  paragraphs?: Paragraph[];
}

interface Sheet {
  front: Face;
  back: Face;
}


const Page = forwardRef<HTMLDivElement, PageProps>(({ index, iscover, nextPage=()=>{}, previousPage=()=>{}}, ref) => {
  const t = useTranslations("Book");
  const pageIndex = index;
  const isFrontCover = iscover && index === 0;
  const isBackCover = iscover && index !== 0;

  const content = (t.raw("pages") as Sheet[])[pageIndex];
  const renderParagraph = (p: Paragraph, key: number) => {
    if (typeof p === 'string') {
      if (p.startsWith('• ')) {
        return <p key={key} className="page-text page-bullet">{p.slice(2)}</p>;
      }
      return <p key={key} className="page-text">{p}</p>;
    }
    return <p key={key} className={`page-text page-text--${p.variant}`}>{p.text}</p>;
  };

  const renderFace = (face: Face, priority = false) => (
    <div className="page-inner font-inter">
      {iscover && <TextureOverlay texture="noise" opacity={0.3} className="-z-10 mix-blend-overlay"/> }
      {!iscover && face.title && <h2 className="page-title font-serif" style={{marginBottom: 0}}>{face.title}</h2>}
      {face.image && (
        <div className="page-figure h-1/2 w-full -z-10 absolute -bottom-3">
          {face.image.width || face.image.height? 
          <Image
            src={face.image.src}
            alt={face.image.alt}
            width={face.image.width || 300}
            height={face.image.height || 300}
            loading={priority? 'eager':'lazy'}
            unoptimized={face.image.src.endsWith('.svg')}
            style={{ 
              objectFit: 'cover', 
              position: 'absolute',
              top: -60,
              width: '100%',     // or a specific pixel value like '300px'
              height: 'auto'     // <-- Fixes the warning by letting height scale naturally
            }}
          />
          : <Image
            fill
            src={face.image.src}
            alt={face.image.alt}
            sizes="(max-width: 899px) 90vw, 40vw"
            loading={priority? 'eager':'lazy'}
            unoptimized={face.image.src.endsWith('.svg')}
            style={{ objectFit: 'cover' }}
          />  }
        </div>
      )}
      {iscover && face.title && <h2 className="page-title font-serif" style={{marginBottom: 0}}>{face.title}</h2>}
      {face.paragraphs && face.paragraphs.length > 0 && (
        <div className="page-body">{face.paragraphs.map(renderParagraph)}</div>
      )}
    </div>
  );
  return (
    <div
      ref={ref}
      className={`page book__page${iscover ? ' book__cover' : ''} ${isFrontCover ? ' book__cover--front' : ''} ${isBackCover ? ' book__cover--back' : ''}`}
      style={{ '--page-index': pageIndex } as React.CSSProperties}
    >
      
                  
      <div onClick={nextPage} className="page__half page__half--front">
        <div className="book-shadow"></div>
        {content && <div className="page-content">{renderFace(content.front, pageIndex === 0)}</div>}
        {!iscover && <div className="page__number">{2 * index - 1}</div>}
      </div>

      <div onClick={previousPage} className="page__half page__half--back">
        <div className="book-shadow"></div>
        {content && <div className="page-content page-back">{renderFace(content.back)}</div>}
        {!iscover && <div className="page__number">{2 * index}</div>}
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default Page;
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PageElement } from '@/types';
import Image from 'next/image';

interface RenderElementProps {
  element: PageElement;
}

export const RenderElement: React.FC<RenderElementProps> = ({ element }) => {
  const applyStyles = (styles: any) => {
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      padding: styles.padding,
      margin: styles.margin,
      textAlign: styles.textAlign,
      borderRadius: styles.borderRadius,
      border: styles.border,
      width: styles.width,
      height: styles.height,
      display: styles.display,
      flexDirection: styles.flexDirection,
      justifyContent: styles.justifyContent,
      alignItems: styles.alignItems,
      flexWrap: styles.flexWrap,
      gap: styles.gap,
      gridTemplateColumns: styles.gridTemplateColumns,
      gridTemplateRows: styles.gridTemplateRows,
      gridGap: styles.gridGap,
      position: styles.position,
      top: styles.top,
      right: styles.right,
      bottom: styles.bottom,
      left: styles.left,
      zIndex: styles.zIndex,
      boxShadow: styles.boxShadow,
      opacity: styles.opacity,
      transform: styles.transform,
      transition: styles.transition,
    };
  };

  switch (element.type) {
    case 'text':
      return (
        <div style={applyStyles(element.styles)} className="min-h-[10]">
          {element.content.text || 'Add your text here...'}
        </div>
      );

    case 'image':
      return (
        <div style={applyStyles(element.styles)} className="min-h-[50]">
          <Image
            src={element.content.src || 'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={element.content.alt || 'Image'}
            className="w-full h-full object-cover rounded"
            fill
            priority // Optional: if this is above the fold
          />
        </div>
      );

    case 'button':
      return (
        <button
          style={applyStyles(element.styles)}
          className="px-6 py-3 rounded-lg hover:opacity-90 transition-opacity min-w-[30]"
        >
          {element.content.text || 'Button'}
        </button>
      );

    case 'container':
      return (
        <div style={applyStyles(element.styles)} className="min-h-[12.5]">
          {element.children?.map((child) => (
            <RenderElement key={child.id} element={child} />
          ))}
          {(!element.children || element.children.length === 0) && (
            <div className="text-gray-400 text-sm p-4 border-2 border-dashed border-gray-200 rounded">
              Drop components here
            </div>
          )}
        </div>
      );

    case 'hero':
      return (
        <div 
          style={applyStyles(element.styles)} 
          className="relative min-h-[100] flex items-center justify-center text-center"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-6">
              {element.content.title || 'Your Amazing Headline'}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {element.content.subtitle || 'A compelling subtitle that explains your value proposition'}
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors">
              {element.content.buttonText || 'Get Started'}
            </button>
          </div>
        </div>
      );

    case 'features':
      return (
        <div style={applyStyles(element.styles)} className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {element.content.title || 'Our Features'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {(element.content.features || [
                { title: 'Feature 1', description: 'Description of feature 1' },
                { title: 'Feature 2', description: 'Description of feature 2' },
                { title: 'Feature 3', description: 'Description of feature 3' }
              ]).map((feature: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'footer':
      return (
        <footer style={applyStyles(element.styles)} className="py-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              {element.content.title || 'Your Company'}
            </h3>
            <p className="text-gray-600 mb-6">
              {element.content.description || 'Building amazing experiences since 2024'}
            </p>
            <div className="flex justify-center gap-6">
              {(element.content.links || ['Home', 'About', 'Contact']).map((link: string, index: number) => (
                <a key={index} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      );

    default:
      return (
        <div style={applyStyles(element.styles)} className="p-4 border border-gray-300 rounded">
          Unknown element type: {element.type}
        </div>
      );
  }
};
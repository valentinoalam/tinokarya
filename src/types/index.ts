/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: PageElement[];
  createdAt: string;
  isCustom?: boolean;
}

export interface PageElement {
  id: string;
  type: 'container' | 'text' | 'image' | 'button' | 'hero' | 'features' | 'footer';
  content: any;
  styles: ElementStyles;
  children?: PageElement[];
}

export interface ElementStyles {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  border?: string;
  width?: string;
  height?: string;
  display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'inline-flex' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
}

export interface ComponentType {
  id: string;
  name: string;
  icon: string;
  category: string;
  defaultProps: Partial<PageElement>;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  elements: PageElement[];
}

export type Adjective = {
  id: string;
  text: string;
  category: string;
};

export type PersonalitySpectrum = {
  id: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
};

export type BrandArchetype = {
  id: string;
  name: string;
  description: string;
};

export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
  };
};

export type FontPairing = {
  id: string;
  name: string;
  description: string;
  heading: {
    family: string;
    category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
    weight: number;
  };
  body: {
    family: string;
    category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
    weight: number;
  };
};

export type BrandProfile = {
  adjectives: string[];
  spectrums: PersonalitySpectrum[];
  archetypes: string[];
  keywords: string[];
  antiKeywords: string[];
};
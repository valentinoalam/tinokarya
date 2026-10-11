/* eslint-disable @typescript-eslint/no-unused-vars */
import { Adjective, PersonalitySpectrum, BrandProfile } from '../types';
import { adjectives } from '../data/adjectives';
import { brandArchetypes } from '../data/archetypes';

// Color palettes based on brand personalities
const colorAssociations = {
  trust: ['#0369a1', '#0284c7', '#38bdf8', '#e0f2fe', '#f0f9ff'],
  innovation: ['#7e22ce', '#a855f7', '#d8b4fe', '#f3e8ff', '#faf5ff'],
  luxury: ['#4a044e', '#701a75', '#d946ef', '#fce7f3', '#fdf2f8'],
  approachable: ['#15803d', '#22c55e', '#86efac', '#dcfce7', '#f0fdf4'],
  confidence: ['#c2410c', '#ea580c', '#fb923c', '#ffedd5', '#fff7ed'],
  fun: ['#db2777', '#ec4899', '#f9a8d4', '#fce7f3', '#fdf2f8'],
  classic: ['#1e293b', '#334155', '#94a3b8', '#f1f5f9', '#f8fafc'],
  contemporary: ['#0f766e', '#14b8a6', '#5eead4', '#ccfbf1', '#f0fdfa'],
  sustainable: ['#3f6212', '#65a30d', '#a3e635', '#ecfccb', '#f7fee7']
};

// Font pairings based on brand personalities
const fontAssociations = {
  trust: [
    {
      heading: { family: 'Georgia', category: 'serif' as const, weight: 700 },
      body: { family: 'Inter', category: 'sans-serif' as const, weight: 400 }
    }
  ],
  innovation: [
    {
      heading: { family: 'Montserrat', category: 'sans-serif' as const, weight: 800 },
      body: { family: 'Roboto', category: 'sans-serif' as const, weight: 400 }
    }
  ],
  luxury: [
    {
      heading: { family: 'Playfair Display', category: 'serif' as const, weight: 700 },
      body: { family: 'Lato', category: 'sans-serif' as const, weight: 300 }
    }
  ],
  approachable: [
    {
      heading: { family: 'Nunito', category: 'sans-serif' as const, weight: 700 },
      body: { family: 'Open Sans', category: 'sans-serif' as const, weight: 400 }
    }
  ],
  confidence: [
    {
      heading: { family: 'Raleway', category: 'sans-serif' as const, weight: 800 },
      body: { family: 'Source Sans Pro', category: 'sans-serif' as const, weight: 400 }
    }
  ],
  fun: [
    {
      heading: { family: 'Pacifico', category: 'handwriting' as const, weight: 400 },
      body: { family: 'Quicksand', category: 'sans-serif' as const, weight: 400 }
    }
  ],
  classic: [
    {
      heading: { family: 'Merriweather', category: 'serif' as const, weight: 700 },
      body: { family: 'Source Serif Pro', category: 'serif' as const, weight: 400 }
    }
  ],
  contemporary: [
    {
      heading: { family: 'Poppins', category: 'sans-serif' as const, weight: 700 },
      body: { family: 'Work Sans', category: 'sans-serif' as const, weight: 400 }
    }
  ],
  sustainable: [
    {
      heading: { family: 'Libre Baskerville', category: 'serif' as const, weight: 700 },
      body: { family: 'Lora', category: 'serif' as const, weight: 400 }
    }
  ]
};

// Helper function to get adjective data by ID
const getAdjectiveById = (id: string): Adjective | undefined => {
  return adjectives.find(adj => adj.id === id);
};

// Helper function to get archetype data by ID
const getArchetypeById = (id: string) => {
  return brandArchetypes.find(archetype => archetype.id === id);
};

// Calculate dominant personality traits from brand profile
export const getDominantTraits = (brandProfile: BrandProfile) => {
  const traits: Record<string, number> = {};
  
  // Process adjectives
  brandProfile.adjectives.forEach(adjId => {
    const adjective = getAdjectiveById(adjId);
    if (adjective) {
      traits[adjective.category] = (traits[adjective.category] || 0) + 1;
    }
  });
  
  // Process archetypes (giving them more weight)
  brandProfile.archetypes.forEach(archetypeId => {
    const archetype = getArchetypeById(archetypeId);
    if (archetype) {
      // Map archetypes to categories (simplified mapping)
      let category;
      switch (archetypeId) {
        case 'innocent':
        case 'caregiver':
          category = 'approachable';
          break;
        case 'sage':
        case 'ruler':
          category = 'trust';
          break;
        case 'explorer':
        case 'hero':
          category = 'confidence';
          break;
        case 'creator':
        case 'magician':
          category = 'innovation';
          break;
        case 'lover':
          category = 'luxury';
          break;
        case 'jester':
          category = 'fun';
          break;
        case 'outlaw':
          category = 'contemporary';
          break;
        case 'everyman':
          category = 'classic';
          break;
        default:
          category = 'trust';
      }
      
      traits[category] = (traits[category] || 0) + 2; // Give archetypes more weight
    }
  });
  
  // Process spectrums
  brandProfile.spectrums.forEach(spectrum => {
    switch (spectrum.id) {
      case 'formality':
        // If more formal, add to trust and luxury
        if (spectrum.value < 40) {
          traits['trust'] = (traits['trust'] || 0) + 1;
          traits['luxury'] = (traits['luxury'] || 0) + 1;
        } 
        // If more casual, add to approachable and fun
        else if (spectrum.value > 60) {
          traits['approachable'] = (traits['approachable'] || 0) + 1;
          traits['fun'] = (traits['fun'] || 0) + 1;
        }
        break;
      case 'tone':
        // If more serious, add to trust and classic
        if (spectrum.value < 40) {
          traits['trust'] = (traits['trust'] || 0) + 1;
          traits['classic'] = (traits['classic'] || 0) + 1;
        } 
        // If more playful, add to fun
        else if (spectrum.value > 60) {
          traits['fun'] = (traits['fun'] || 0) + 2;
        }
        break;
      case 'tradition':
        // If more traditional, add to classic
        if (spectrum.value < 40) {
          traits['classic'] = (traits['classic'] || 0) + 2;
        } 
        // If more modern, add to contemporary and innovation
        else if (spectrum.value > 60) {
          traits['contemporary'] = (traits['contemporary'] || 0) + 1;
          traits['innovation'] = (traits['innovation'] || 0) + 1;
        }
        break;
      case 'energy':
        // If more calm, add to trust and luxury
        if (spectrum.value < 40) {
          traits['trust'] = (traits['trust'] || 0) + 0.5;
          traits['luxury'] = (traits['luxury'] || 0) + 0.5;
        } 
        // If more energetic, add to fun and confidence
        else if (spectrum.value > 60) {
          traits['fun'] = (traits['fun'] || 0) + 0.5;
          traits['confidence'] = (traits['confidence'] || 0) + 0.5;
        }
        break;
      case 'exclusivity':
        // If more exclusive, add to luxury
        if (spectrum.value > 60) {
          traits['luxury'] = (traits['luxury'] || 0) + 2;
        } 
        // If more accessible, add to approachable
        else if (spectrum.value < 40) {
          traits['approachable'] = (traits['approachable'] || 0) + 2;
        }
        break;
    }
  });
  
  // Sort traits by weight
  const sortedTraits = Object.entries(traits)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedTraits;
};

// Generate color palettes based on the brand profile
export const generateColorPalettes = (brandProfile: BrandProfile) => {
  const dominantTraits = getDominantTraits(brandProfile);
  const palettes = [];
  
  // Take top 3 dominant traits to generate palettes
  const topTraits = dominantTraits.slice(0, 3);
  
  // Generate a primary palette from the most dominant trait
  if (topTraits.length > 0) {
    const primaryTrait = topTraits[0];
    const primaryColors = colorAssociations[primaryTrait as keyof typeof colorAssociations] || colorAssociations.trust;
    
    palettes.push({
      id: 'palette-1',
      name: `Primary Palette`,
      description: `Based on your brand's ${primaryTrait} personality trait`,
      colors: {
        primary: primaryColors[0],
        secondary: primaryColors[1],
        accent: primaryColors[2],
        neutral: '#1e293b',
        background: primaryColors[4],
      }
    });
  }
  
  // Generate more unique palettes if there are multiple traits
  if (topTraits.length >= 2) {
    const secondaryTrait = topTraits[1];
    const secondaryColors = colorAssociations[secondaryTrait as keyof typeof colorAssociations] || colorAssociations.innovation;
    
    palettes.push({
      id: 'palette-2',
      name: `Balanced Palette`,
      description: `Combines ${topTraits[0]} with ${secondaryTrait} traits`,
      colors: {
        primary: colorAssociations[topTraits[0] as keyof typeof colorAssociations][0],
        secondary: secondaryColors[1],
        accent: colorAssociations[topTraits[0] as keyof typeof colorAssociations][2],
        neutral: '#334155',
        background: '#ffffff',
      }
    });
  }
  
  if (topTraits.length >= 3) {
    const tertiaryTrait = topTraits[2];
    
    palettes.push({
      id: 'palette-3',
      name: `Dynamic Palette`,
      description: `A bolder mix emphasizing ${tertiaryTrait} with your other traits`,
      colors: {
        primary: colorAssociations[topTraits[0] as keyof typeof colorAssociations][0],
        secondary: colorAssociations[topTraits[1] as keyof typeof colorAssociations][1],
        accent: colorAssociations[tertiaryTrait as keyof typeof colorAssociations][2],
        neutral: '#1e293b',
        background: '#f8fafc',
      }
    });
  }
  
  // Always add a neutral palette as an option
  palettes.push({
    id: 'palette-neutral',
    name: 'Neutral Sophisticated Palette',
    description: 'A timeless, sophisticated palette that works well for any brand',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#64748b',
      neutral: '#94a3b8',
      background: '#f8fafc',
    }
  });
  
  return palettes;
};

// Generate font pairings based on the brand profile
export const generateFontPairings = (brandProfile: BrandProfile) => {
  const dominantTraits = getDominantTraits(brandProfile);
  const fontPairings = [];
  
  // Take top 2 dominant traits to generate font pairings
  const topTraits = dominantTraits.slice(0, 2);
  
  // Generate a primary font pairing from the most dominant trait
  if (topTraits.length > 0) {
    const primaryTrait = topTraits[0];
    const primaryFonts = fontAssociations[primaryTrait as keyof typeof fontAssociations] || fontAssociations.trust;
    
    fontPairings.push({
      id: 'font-pairing-1',
      name: `Primary Font Pairing`,
      description: `Based on your brand's ${primaryTrait} personality trait`,
      heading: primaryFonts[0].heading,
      body: primaryFonts[0].body
    });
  }
  
  // Generate a secondary font pairing if there's a second trait
  if (topTraits.length >= 2) {
    const secondaryTrait = topTraits[1];
    const secondaryFonts = fontAssociations[secondaryTrait as keyof typeof fontAssociations] || fontAssociations.innovation;
    
    fontPairings.push({
      id: 'font-pairing-2',
      name: `Secondary Font Pairing`,
      description: `Based on your brand's ${secondaryTrait} trait`,
      heading: secondaryFonts[0].heading,
      body: secondaryFonts[0].body
    });
  }
  
  // Always add a classic, versatile pairing as an option
  fontPairings.push({
    id: 'font-pairing-versatile',
    name: 'Versatile Font Pairing',
    description: 'A timeless, versatile pairing that works well for any brand',
    heading: { family: 'Inter', category: 'sans-serif' as const, weight: 700 },
    body: { family: 'Inter', category: 'sans-serif' as const, weight: 400 }
  });
  
  return fontPairings;
};

// Client-side only SVG manipulation functions
// These should only be called from useEffect or event handlers in React components

// Function to change the color of all paths in an SVG
export function changeSVGColor(color: string) {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return;
  
  const svgs = document.getElementsByTagName('svg');
  
  // Loop through all SVG elements
  for (const svg of svgs) {
    // Get all paths within each SVG
    const paths = svg.getElementsByTagName('path');
    
    // Change the color of each path
    for (const path of paths) {
      path.setAttribute('fill', color);
    }
  }
}

// To change color based on the main element's background:
export function updateSVGColorFromMain() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const mainElement = document.getElementsByTagName('main')[0];
  if (mainElement) {
    const computedStyle = window.getComputedStyle(mainElement);
    const backgroundColor = computedStyle.backgroundColor;
    changeSVGColor(backgroundColor);
  }
}
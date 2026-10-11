// Extended color utilities with CSS named color support
export const normalizeHex = (hex: string): string | null => {
  const normalizedHex = hex.trim().toLowerCase();
  
  if (!/^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(normalizedHex)) {
    return null;
  }
  
  // Expand short form to long form
  if (normalizedHex.length === 4 || normalizedHex.length === 5) {
    return `#${normalizedHex[1]}${normalizedHex[1]}${normalizedHex[2]}${normalizedHex[2]}${normalizedHex[3]}${normalizedHex[3]}`;
  }
  
  return normalizedHex;
};

// CSS named colors to HEX mapping
const cssNamedColors: { [key: string]: string } = {
  // Basic colors
  'black': '#000000',
  'white': '#ffffff',
  'red': '#ff0000',
  'green': '#008000',
  'blue': '#0000ff',
  'yellow': '#ffff00',
  'cyan': '#00ffff',
  'magenta': '#ff00ff',
  'silver': '#c0c0c0',
  'gray': '#808080',
  'maroon': '#800000',
  'olive': '#808000',
  'lime': '#00ff00',
  'aqua': '#00ffff',
  'teal': '#008080',
  'navy': '#000080',
  'fuchsia': '#ff00ff',
  'purple': '#800080',
  
  // CSS system colors
  'initial': '#000000', // Fallback for 'initial'
  'inherit': '#000000', // Fallback for 'inherit'
  'currentcolor': '#000000', // Fallback for 'currentColor'
  'transparent': '#00000000', // Fully transparent
};

export const cssColorToHex = (color: string): string | null => {
  const normalizedColor = color.trim().toLowerCase();
  
  // If it's already a valid HEX, return it
  if (normalizeHex(normalizedColor)) {
    return normalizeHex(normalizedColor);
  }
  
  // Check if it's a CSS named color
  if (cssNamedColors[normalizedColor]) {
    return cssNamedColors[normalizedColor];
  }
  
  // Handle rgb/rgba colors
  if (normalizedColor.startsWith('rgb')) {
    // You could add rgbToHex conversion here if needed
    return '#000000'; // Fallback for RGB colors
  }
  
  // Handle hsl colors
  if (normalizedColor.startsWith('hsl')) {
    return '#000000'; // Fallback for HSL colors
  }
  
  return null;
};

// Main hexToRgba function with enhanced error handling
export const hexToRgba = (color: string, opacity: number): string => {
  // First, try to convert any CSS color to HEX
  const hexColor = cssColorToHex(color);
  
  if (!hexColor) {
    console.warn(`Invalid color format: "${color}". Using fallback black.`);
    return `rgba(0, 0, 0, ${opacity})`;
  }
  
  if (opacity < 0 || opacity > 1) {
    console.error("Opacity must be between 0 and 1.");
    return hexColor; // Return the hex color if opacity is invalid
  }

  // Extract RGB from HEX (now guaranteed to be valid 6 or 8 digit HEX)
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const isValidHex = (color: string): boolean => {
  return cssColorToHex(color) !== null;
};

// export function rgbToHex(rgbString: string): string | null {
//   // More flexible regex to handle spaces and rgb/rgba
//   const match = rgbString.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+)?\s*\)$/i);
  
//   if (!match) {
//     console.error("Invalid RGB string format. Expected 'rgb(r, g, b)' or 'rgba(r, g, b, a)'.");
//     return null;
//   }

//   const r = parseInt(match[1]);
//   const g = parseInt(match[2]);
//   const b = parseInt(match[3]);

//   if ([r, g, b].some(value => value < 0 || value > 255)) {
//     console.error("RGB values must be between 0 and 255.");
//     return null;
//   }

//   const toHex = (c: number): string => c.toString(16).padStart(2, '0');
//   return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
// }

export function rgbToHex(rgbString: string): string | null {
  // Trim and normalize the input
  const normalizedString = rgbString.trim().toLowerCase();
  
  // More comprehensive regex patterns
  const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*[\d.]+\s*\)$/;
  const noSpacePattern = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/;
  
  let match: RegExpMatchArray | null = null;
  
  if (rgbPattern.test(normalizedString)) {
    match = normalizedString.match(rgbPattern);
  } else if (rgbaPattern.test(normalizedString)) {
    match = normalizedString.match(rgbaPattern);
  } else if (noSpacePattern.test(normalizedString)) {
    match = normalizedString.match(noSpacePattern);
  }
  
  if (!match) {
    console.error(`Invalid RGB string format: "${rgbString}". Expected formats: 
      - rgb(255, 255, 255)
      - rgb(255,255,255)
      - rgba(255, 255, 255, 1)
      - rgb( 255, 255, 255 )`);
    return null;
  }

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    console.error(`RGB values must be between 0 and 255. Received: rgb(${r}, ${g}, ${b})`);
    return null;
  }

  const toHex = (c: number): string => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
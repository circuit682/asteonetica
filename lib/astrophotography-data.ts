/**
 * Astrophotography gallery metadata and image configuration
 * Includes image optimization paths and metadata placeholders
 */

export interface AstrophysicsMetadata {
  cod?: string; // Catalog Object Designation
  obs?: string; // Observers
  mea?: string; // Measurements/Measurement team
  tel?: string; // Telescope/Instrument specifications
  ack?: string; // Acknowledgments/Notes
}

export interface AstrophysicsImage {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  
  // Primary image paths
  imagePath: string;
  imageFormat: 'jpeg' | 'png'; // Source format
  
  // Responsive image variants (will be generated)
  variants: {
    mobile: string;    // ~600px
    tablet: string;    // ~1024px
    desktop: string;   // ~1920px
  };
  
  // High-res for lightbox zoom
  highRes: string;
  
  // Image dimensions for aspect ratio preservation
  width: number;
  height: number;
  
  // Metadata
  metadata: AstrophysicsMetadata;
  
  // Visual properties
  cinematicGlow?: boolean;
  glowColor?: string; // Hex color for glow effect
}

export const ASTROPHOTOGRAPHY_IMAGES: AstrophysicsImage[] = [
  {
    id: 'rosette-nebula',
    title: 'Rosette Nebula',
    subtitle: 'NGC 2237 - Stellar Nursery',
    description:
      'A vast stellar nursery in Monoceros, where massive stars heat the surrounding hydrogen gas to brilliant luminescence. This emission nebula spans approximately 130 light-years across.',
    
    imagePath: '/astrophotography/rosette-nebula.png',
    imageFormat: 'png',
    
    variants: {
      mobile: '/astrophotography/rosette-nebula-600w.webp',
      tablet: '/astrophotography/rosette-nebula-1024w.webp',
      desktop: '/astrophotography/rosette-nebula-1920w.webp',
    },
    
    highRes: '/astrophotography/rosette-nebula-4k.webp',
    
    width: 1920,
    height: 1440,
    
    metadata: {
      cod: 'NGC 2237',
      obs: '[Observer names to be added]',
      mea: '[Measurement data to be added]',
      tel: '[Telescope specifications to be added]',
      ack: '[Acknowledgments to be added]',
    },
    
    cinematicGlow: true,
    glowColor: '#ff6b6b', // Red/pink glow for Rosette
  },
  
  {
    id: 'leo-triplet',
    title: 'Leo Triplet',
    subtitle: 'NGC 3623, NGC 3627, NGC 3628',
    description:
      'An interacting system of galaxies in Leo, spanning roughly 300,000 light-years. Their gravitational interactions have distorted their structures and triggered active star formation.',
    
    imagePath: '/astrophotography/leo-triplet.jpeg',
    imageFormat: 'jpeg',
    
    variants: {
      mobile: '/astrophotography/leo-triplet-600w.webp',
      tablet: '/astrophotography/leo-triplet-1024w.webp',
      desktop: '/astrophotography/leo-triplet-1920w.webp',
    },
    
    highRes: '/astrophotography/leo-triplet-4k.webp',
    
    width: 1920,
    height: 1440,
    
    metadata: {
      cod: 'NGC 3623 / NGC 3627 / NGC 3628',
      obs: '[Observer names to be added]',
      mea: '[Measurement data to be added]',
      tel: '[Telescope specifications to be added]',
      ack: '[Acknowledgments to be added]',
    },
    
    cinematicGlow: true,
    glowColor: '#4ecdc4', // Cyan glow for galaxies
  },
  
  {
    id: 'm81',
    title: 'Messier 81',
    subtitle: 'NGC 3031 - Bode\'s Galaxy',
    description:
      'An iconic grand spiral galaxy approximately 11 million light-years away. M81 is thought to have had a close encounter with M82, leaving visible tidal distortions in its spiral structure.',
    
    imagePath: '/astrophotography/m81.jpeg',
    imageFormat: 'jpeg',
    
    variants: {
      mobile: '/astrophotography/m81-600w.webp',
      tablet: '/astrophotography/m81-1024w.webp',
      desktop: '/astrophotography/m81-1920w.webp',
    },
    
    highRes: '/astrophotography/m81-4k.webp',
    
    width: 1920,
    height: 1440,
    
    metadata: {
      cod: 'NGC 3031 (M81)',
      obs: '[Observer names to be added]',
      mea: '[Measurement data to be added]',
      tel: '[Telescope specifications to be added]',
      ack: '[Acknowledgments to be added]',
    },
    
    cinematicGlow: true,
    glowColor: '#ffd93d', // Golden glow for galaxy
  },
];

// Best practices for web image compression
export const IMAGE_COMPRESSION_CONFIG = {
  // JPEG quality thresholds
  jpeg: {
    mobile: 70,      // 600px
    tablet: 75,      // 1024px
    desktop: 80,     // 1920px
    highRes: 85,     // 4K zoom
  },
  
  // PNG quality (lossless, but can optimize)
  png: {
    mobile: 7,       // PNG compression level
    tablet: 8,
    desktop: 9,      // Maximum compression
    highRes: 9,
  },
  
  // WebP quality targets (superior compression)
  webp: {
    mobile: 65,
    tablet: 72,
    desktop: 78,
    highRes: 82,
  },
  
  // AVIF quality targets (best compression, for future)
  avif: {
    mobile: 50,
    tablet: 58,
    desktop: 65,
    highRes: 70,
  },
};

// Performance targets
export const PERFORMANCE_CONFIG = {
  // Core Web Vitals targets
  lcp: 2000,   // Largest Contentful Paint: 2 seconds
  fid: 100,    // First Input Delay: 100ms
  cls: 0.1,    // Cumulative Layout Shift: 0.1
  
  // Image loading strategy
  lazyLoad: true,
  placeholder: 'blur', // Use blur placeholder
  
  // Priority loading
  priorityImages: ['rosette-nebula', 'leo-triplet'], // Load first
};

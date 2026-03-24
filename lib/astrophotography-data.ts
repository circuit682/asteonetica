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
  objectId?: string;
  versionKey?: string;
  versionLabel?: string;
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

export interface AstrophotographyObject {
  id: string;
  label: string;
  versions: AstrophysicsImage[];
}

export const ASTROPHOTOGRAPHY_OBJECTS: AstrophotographyObject[] = [
  {
    id: 'rosette-nebula',
    label: 'Rosette Nebula',
    versions: [
      {
        id: 'rosette-nebula-primary',
        objectId: 'rosette-nebula',
        versionKey: 'primary',
        versionLabel: 'Primary Capture',
        title: 'Rosette Nebula',
        subtitle: 'NGC 2237 - Stellar Nursery',
        description:
          'A vast stellar nursery in Monoceros, where massive stars heat the surrounding hydrogen gas to brilliant luminescence. This emission nebula spans approximately 130 light-years across.',
        imagePath: '/astrophotography/rosette-nebula/rosette-nebula.png',
        imageFormat: 'png',
        variants: {
          mobile: '/astrophotography/rosette-nebula/rosette-nebula-600w.webp',
          tablet: '/astrophotography/rosette-nebula/rosette-nebula-1024w.webp',
          desktop: '/astrophotography/rosette-nebula/rosette-nebula-1920w.webp',
        },
        highRes: '/astrophotography/rosette-nebula/rosette-nebula-4k.webp',
        width: 1920,
        height: 1440,
        metadata: {
          cod: 'NGC 2237',
          obs: 'Req 4134898 | Target ROSETTE NEBULA | ICRS RA 98.1115 (06:32:26.76), Dec 4.7936 (04:47:37.1) | Epoch 2000.',
          mea: 'Mode central30x30 | 300s x1 | Filters H-alpha, OIII, H-alpha, SII | Proper motion RA -1.6300 / Dec 0.1500 | Parallax 0.6400.',
          tel: 'Guiding optional=true, mode ON | Constraints: airmass <= 1.6, lunar distance >= 30, lunar phase <= 1.',
          ack: 'Source: LCO request 4134898 screenshot (2026-03-21).',
        },
        cinematicGlow: true,
        glowColor: '#BB1E10',
      },
    ],
  },
  {
    id: 'leo-triplet',
    label: 'Leo Triplet',
    versions: [
      {
        id: 'leo-triplet-primary',
        objectId: 'leo-triplet',
        versionKey: 'primary',
        versionLabel: 'Primary Capture',
        title: 'Leo Triplet',
        subtitle: 'NGC 3623, NGC 3627, NGC 3628',
        description:
          'An interacting system of galaxies in Leo, spanning roughly 300,000 light-years. Their gravitational interactions have distorted their structures and triggered active star formation.',
        imagePath: '/astrophotography/leo-triplet/leo-triplet.jpeg',
        imageFormat: 'jpeg',
        variants: {
          mobile: '/astrophotography/leo-triplet/leo-triplet-600w.webp',
          tablet: '/astrophotography/leo-triplet/leo-triplet-1024w.webp',
          desktop: '/astrophotography/leo-triplet/leo-triplet-1920w.webp',
        },
        highRes: '/astrophotography/leo-triplet/leo-triplet-4k.webp',
        width: 1920,
        height: 1440,
        metadata: {
          cod: 'NGC 3623 / NGC 3627 / NGC 3628',
          obs: 'Req 4133212 | Target LEO TRIPLET | ICRS RA 169.7500 (11:18:60), Dec 13.2000 (13:11:60) | Epoch 2000.',
          mea: 'Mode central30x30 | 300s x1 | Filters B, V, rp | Offsets RA 0 / Dec 0.',
          tel: 'Guiding optional=true, mode ON | Constraints: airmass <= 1.6, lunar distance >= 30, lunar phase <= 1.',
          ack: 'Source: LCO request 4133212 screenshot (2026-03-21).',
        },
        cinematicGlow: true,
        glowColor: '#00FF9C',
      },
    ],
  },
  {
    id: 'm81',
    label: 'Messier 81',
    versions: [
      {
        id: 'm81-primary',
        objectId: 'm81',
        versionKey: 'primary',
        versionLabel: 'Primary Capture',
        title: 'Messier 82',
        subtitle: 'NGC 3034 - Cigar Galaxy',
        description:
          'A starburst galaxy in Ursa Major with an active central region and filamentary outflows. M82 is often observed alongside M81 as part of the M81 group.',
        imagePath: '/astrophotography/m81/m81.jpeg',
        imageFormat: 'jpeg',
        variants: {
          mobile: '/astrophotography/m81/m81-600w.webp',
          tablet: '/astrophotography/m81/m81-1024w.webp',
          desktop: '/astrophotography/m81/m81-1920w.webp',
        },
        highRes: '/astrophotography/m81/m81-4k.webp',
        width: 1920,
        height: 1440,
        metadata: {
          cod: 'NGC 3034 (M82)',
          obs: 'Req 4137798 | Target M82 | ICRS RA 148.9685 (09:55:52.43), Dec 69.6797 (69:40:46.93) | Epoch 2000.',
          mea: 'Mode central30x30 | 300s x1 | Filters V, B, rp | Offsets RA 0 / Dec 0.',
          tel: 'Guiding optional=true, mode ON | Constraints: airmass <= 1.6, lunar distance >= 30, lunar phase <= 1.',
          ack: 'Source: LCO request 4137798 screenshot (2026-03-21).',
        },
        cinematicGlow: true,
        glowColor: '#00FF9C',
      },
      {
        id: 'm81-ii',
        objectId: 'm81',
        versionKey: 'm81-ii',
        versionLabel: 'M81 II',
        title: 'Messier 81 II',
        subtitle: 'Alternate Capture (M8 File)',
        description:
          'Second gallery variant using the newly added M8 source asset, mapped into the M81 set as requested for comparison and storytelling continuity.',
        imagePath: '/astrophotography/m8/m8.jpeg',
        imageFormat: 'jpeg',
        variants: {
          mobile: '/astrophotography/m8/m8-600w.webp',
          tablet: '/astrophotography/m8/m8-1024w.webp',
          desktop: '/astrophotography/m8/m8-1920w.webp',
        },
        highRes: '/astrophotography/m8/m8-4k.webp',
        width: 1536,
        height: 1536,
        metadata: {
          cod: 'M81 II (Mapped from M8 Asset)',
          obs: 'Internal mapping | M8 source file assigned as M81 II for gallery continuity.',
          mea: 'Generated variants from m8.jpeg: 600w, 1024w, 1920w, 4k.',
          tel: 'Capture log unavailable in provided M8 package.',
          ack: 'Source: internal import (2026-03-24).',
        },
        cinematicGlow: true,
        glowColor: '#BB1E10',
      },
    ],
  },
  {
    id: 'orion-1',
    label: 'Orion Nebula I',
    versions: [
      {
        id: 'orion-1-primary',
        objectId: 'orion-1',
        versionKey: 'primary',
        versionLabel: 'Primary Capture',
        title: 'Orion Nebula I',
        subtitle: 'M42 - Orion Molecular Cloud',
        description:
          'A bright view of M42 in Orion, revealing ionized gas structures and embedded star-forming regions within one of the nearest stellar nurseries.',
        imagePath: '/astrophotography/orion/orion-1.png',
        imageFormat: 'png',
        variants: {
          mobile: '/astrophotography/orion/orion-1-600w.webp',
          tablet: '/astrophotography/orion/orion-1-1024w.webp',
          desktop: '/astrophotography/orion/orion-1-1920w.webp',
        },
        highRes: '/astrophotography/orion/orion-1-4k.webp',
        width: 1536,
        height: 1536,
        metadata: {
          cod: 'M42 / NGC 1976',
          obs: 'Req 4133727 | Target Orion Nebula | ICRS RA 83.8201 (05:35:16.824), Dec -5.3876 (-05:23:15.36) | Epoch 2000.',
          mea: 'Mode central30x30 | 300s x1 | Filters B, V, rp | Proper motion RA 1.6700 / Dec -0.3000.',
          tel: 'Guiding optional=true, mode ON | Constraints: airmass <= 2, lunar distance >= 30, lunar phase <= 1.',
          ack: 'Source: LCO request 4133727 screenshot (2026-03-21).',
        },
        cinematicGlow: true,
        glowColor: '#BB1E10',
      },
    ],
  },
  {
    id: 'orion-2',
    label: 'Orion Nebula II',
    versions: [
      {
        id: 'orion-2-primary',
        objectId: 'orion-2',
        versionKey: 'primary',
        versionLabel: 'Secondary Capture',
        title: 'Orion Nebula II',
        subtitle: 'M42 - Alternate Field',
        description:
          'A second capture of the Orion field with alternate framing and contrast balance to highlight surrounding nebulosity and stellar depth.',
        imagePath: '/astrophotography/orion/orion-2.png',
        imageFormat: 'png',
        variants: {
          mobile: '/astrophotography/orion/orion-2-600w.webp',
          tablet: '/astrophotography/orion/orion-2-1024w.webp',
          desktop: '/astrophotography/orion/orion-2-1920w.webp',
        },
        highRes: '/astrophotography/orion/orion-2-4k.webp',
        width: 1536,
        height: 1536,
        metadata: {
          cod: 'M42 / NGC 1976',
          obs: 'Req 4133727 | Target Orion Nebula | ICRS RA 83.8201 (05:35:16.824), Dec -5.3876 (-05:23:15.36) | Epoch 2000.',
          mea: 'Mode central30x30 | 300s x1 | Filters B, V, rp | Proper motion RA 1.6700 / Dec -0.3000.',
          tel: 'Guiding optional=true, mode ON | Constraints: airmass <= 2, lunar distance >= 30, lunar phase <= 1.',
          ack: 'Source: LCO request 4133727 screenshot (2026-03-21).',
        },
        cinematicGlow: true,
        glowColor: '#00FF9C',
      },
    ],
  },
];

// Backward-compatible flat list used by existing components and fallbacks.
export const ASTROPHOTOGRAPHY_IMAGES: AstrophysicsImage[] = ASTROPHOTOGRAPHY_OBJECTS.map(
  (objectItem) => objectItem.versions[0],
);

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

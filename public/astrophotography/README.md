# Astrophotography Gallery - Image Setup Guide

## Directory Structure

This directory contains all astrophotography gallery images and their optimized variants.

```
public/astrophotography/
├── rosette-nebula.png                    # Source image
├── rosette-nebula-600w.webp             # Mobile variant
├── rosette-nebula-1024w.webp            # Tablet variant
├── rosette-nebula-1920w.webp            # Desktop variant
├── rosette-nebula-4k.webp               # High-res for lightbox zoom
├── leo-triplet.jpeg
├── leo-triplet-600w.webp
├── leo-triplet-1024w.webp
├── leo-triplet-1920w.webp
├── leo-triplet-4k.webp
├── m81.jpeg
├── m81-600w.webp
├── m81-1024w.webp
├── m81-1920w.webp
└── m81-4k.webp
```

## Image Placement Steps

### 1. Place Source Images

First, add your original high-quality images to this directory:
- `rosette-nebula.png` (your PNG file)
- `leo-triplet.jpeg` (your JPEG file)  
- `m81.jpeg` (your JPEG file)

### 2. Image Compression & Optimization

Use the configuration from `lib/astrophotography-data.ts`:

Run the blueprint script from this folder:

```bash
bash ./convert.sh
```

The script generates 4 responsive WebP variants (`600w`, `1024w`, `1920w`, `4k`) for each source image.

Manual examples (optional):

```bash
# Mobile (600px width, 70% quality)
cjpeg -quality 70 -outfile leo-triplet-600w.jpeg leo-triplet.jpeg
ffmpeg -i leo-triplet-600w.jpeg -vf scale=600:-1 leo-triplet-600w.webp

# Tablet (1024px width, 75% quality)
ffmpeg -i leo-triplet.jpeg -vf scale=1024:-1 -q:v 3 leo-triplet-1024w.webp

# Desktop (1920px width, 80% quality)
ffmpeg -i leo-triplet.jpeg -vf scale=1920:-1 -q:v 2 leo-triplet-1920w.webp

# High-res for lightbox (4K/2160px, 82% quality)
ffmpeg -i leo-triplet.jpeg -vf scale=2160:-1 -q:v 1 leo-triplet-4k.webp
```

**For PNG images (Rosette Nebula):**

```bash
# Mobile (600px width)
ffmpeg -i rosette-nebula.png -vf scale=600:-1 rosette-nebula-600w.webp

# Tablet (1024px width)
ffmpeg -i rosette-nebula.png -vf scale=1024:-1 rosette-nebula-1024w.webp

# Desktop (1920px width)
ffmpeg -i rosette-nebula.png -vf scale=1920:-1 rosette-nebula-1920w.webp

# High-res for lightbox
ffmpeg -i rosette-nebula.png -vf scale=2160:-1 rosette-nebula-4k.webp
```

### 3. Quality & File Size Targets

| Format | Mobile | Tablet | Desktop | High-Res |
|--------|--------|--------|---------|----------|
| **JPEG** | 70% | 75% | 80% | 85% |
| **WebP** | 65 | 72 | 78 | 82 |
| **Target Size** | ~80-120KB | ~150-250KB | ~400-600KB | ~800-1.2MB |

### 4. Verify Image Paths in Code

The page references these filenames in `lib/astrophotography-data.ts`:

```typescript
{
  imagePath: '/astrophotography/leo-triplet.jpeg',
  variants: {
    mobile: '/astrophotography/leo-triplet-600w.webp',
    tablet: '/astrophotography/leo-triplet-1024w.webp',
    desktop: '/astrophotography/leo-triplet-1920w.webp',
  },
  highRes: '/astrophotography/leo-triplet-4k.webp',
  // ...
}
```

## Recommended Tools

- **ImageMagick** (`convert`, `cjpeg`): Command-line image processing
- **FFmpeg**: Fast format conversion to WebP/AVIF
- **Squoosh CLI**: Google's modern image compression tool
- **Sharp** (Node.js): Programmatic image optimization

Example with Sharp (Node.js):

```javascript
const sharp = require('sharp');

// Convert JPEG to WebP variants
sharp('leo-triplet.jpeg')
  .resize(600, 450, { fit: 'cover', position: 'center' })
  .webp({ quality: 65 })
  .toFile('leo-triplet-600w.webp');
```

## Performance Notes

- **LCP (Largest Contentful Paint)** target: < 2s on mobile
- **Lazy loading** is enabled for all carousel images
- **Blur placeholders** render while images load
- **Lightbox** uses high-res images loaded on-demand

## Metadata Update

When you have the actual observation data, update `lib/astrophotography-data.ts`:

```typescript
metadata: {
  cod: 'NGC 2237', // Catalog Object Designation
  obs: 'J. Bulger, T. Lowe, A. Schultz, M. Willman', // Observers
  mea: 'T. Vorobjov, PS1 Science Consortium', // Measurements
  tel: '1.8-m f/4.4 Ritchey-Chretien + CCD', // Telescope
  ack: 'MPCReport file updated 2026.03.19 14:29:03', // Acknowledgments
}
```

## Troubleshooting

**Images not loading?**
- Verify filenames match exactly (case-sensitive)
- Check browser DevTools Network tab for 404s
- Clear Next.js cache: `rm -rf .next`

**Quality issues after compression?**
- Increase quality thresholds in IMAGE_COMPRESSION_CONFIG
- Use AVIF format for even better compression with same quality
- Test with `ffmpeg -i source.jpg -crf 23 output.webp` for quality testing

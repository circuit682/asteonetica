#!/bin/bash

set -euo pipefail

# Define the target widths
widths=(600 1024 1920 3840)
# Mapping widths to your specific naming convention
labels=("600w" "1024w" "1920w" "4k")

QUALITY_WEBP="85"

has_magick=0
if command -v magick >/dev/null 2>&1; then
    has_magick=1
fi

use_fallback=0

if [ "$has_magick" -eq 1 ]; then
    if ! magick identify *.jpeg *.jpg *.png >/dev/null 2>&1; then
        use_fallback=1
    fi
fi

if [ "$has_magick" -eq 0 ] || [ "$use_fallback" -eq 1 ]; then
    echo "ImageMagick delegates are incomplete in this shell. Using Sharp fallback..."
    if command -v node >/dev/null 2>&1; then
        node ./convert-images.mjs
    else
        powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "node .\\convert-images.mjs"
    fi
    echo "Done! Clear skies and fast load times."
    exit 0
fi

# Process each jpg and png file
for img in *.jpg *.jpeg *.png; do
    # Skip if no files match
    [ -e "$img" ] || continue
    
    # Get filename without extension
    base=$(basename "$img" | sed 's/\.[^.]*$//')
    
    echo "Processing $base..."

    for i in "${!widths[@]}"; do
        width=${widths[$i]}
        label=${labels[$i]}
        
        # Convert to WebP with high quality (85 is usually the sweet spot)
        magick "$img" -resize "${width}>" -quality "$QUALITY_WEBP" "${base}-${label}.webp"
    done
done

echo "Done! Clear skies and fast load times."
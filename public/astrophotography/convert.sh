#!/bin/bash

set -euo pipefail
shopt -s nullglob

# Define the target widths
widths=(600 1024 1920 3840)
# Mapping widths to your specific naming convention
labels=("600w" "1024w" "1920w" "4k")

QUALITY_WEBP="85"
SOURCE_ROOT="./sources"

source_files=()

# Backward compatibility: pick up source files placed at folder root.
for img in ./*.jpg ./*.jpeg ./*.png; do
    [ -e "$img" ] || continue
    source_files+=("$img")
done

# New structure: ./sources/<object>/<image>.(jpg|jpeg|png)
if [ -d "$SOURCE_ROOT" ]; then
    for object_dir in "$SOURCE_ROOT"/*; do
        [ -d "$object_dir" ] || continue
        for img in "$object_dir"/*.jpg "$object_dir"/*.jpeg "$object_dir"/*.png; do
            [ -e "$img" ] || continue
            source_files+=("$img")
        done
    done
fi

# Preferred structure: ./<object>/<image>.(jpg|jpeg|png)
for object_dir in ./*; do
    [ -d "$object_dir" ] || continue
    case "$(basename "$object_dir")" in
        sources) continue ;;
    esac

    for img in "$object_dir"/*.jpg "$object_dir"/*.jpeg "$object_dir"/*.png; do
        [ -e "$img" ] || continue
        source_files+=("$img")
    done
done

if [ ${#source_files[@]} -eq 0 ]; then
    echo "No source images found. Add files to ./sources/<object>/ or this folder root."
    exit 0
fi

output_base_name() {
    local img="$1"
    local stem dir object base
    stem="$(basename "$img" | sed 's/\.[^.]*$//')"
    dir="$(dirname "$img")"

    if [[ "$dir" == "$SOURCE_ROOT"/* ]]; then
        object="$(basename "$dir" | tr '[:upper:]' '[:lower:]')"
        local normalized_stem
        normalized_stem="$(echo "$stem" | tr '[:upper:]' '[:lower:]')"

        if [[ "$normalized_stem" == "$object" || "$normalized_stem" == "primary" || "$normalized_stem" == "main" || "$normalized_stem" == "source" || "$normalized_stem" == "raw" ]]; then
            base="$object"
        else
            base="${object}-${normalized_stem}"
        fi
    else
        base="$stem"
    fi

    echo "$base"
}

output_target_path() {
    local img="$1"
    local base="$2"
    local label="$3"
    local dir
    dir="$(dirname "$img")"

    if [[ "$dir" == "$SOURCE_ROOT"/* ]]; then
        echo "${base}-${label}.webp"
    elif [[ "$dir" == "." ]]; then
        echo "${base}-${label}.webp"
    else
        echo "${dir}/${base}-${label}.webp"
    fi
}

has_magick=0
if command -v magick >/dev/null 2>&1; then
    has_magick=1
fi

use_fallback=0

if [ "$has_magick" -eq 1 ]; then
    for img in "${source_files[@]}"; do
        if ! magick identify "$img" >/dev/null 2>&1; then
            use_fallback=1
            break
        fi
    done
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

# Process each discovered source file
for img in "${source_files[@]}"; do
    base=$(output_base_name "$img")

    echo "Processing $base..."

    for i in "${!widths[@]}"; do
        width=${widths[$i]}
        label=${labels[$i]}
        out_path=$(output_target_path "$img" "$base" "$label")
        
        # Convert to WebP with high quality (85 is usually the sweet spot)
        magick "$img" -resize "${width}>" -quality "$QUALITY_WEBP" "$out_path"
    done
done

echo "Done! Clear skies and fast load times."
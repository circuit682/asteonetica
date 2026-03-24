# Astrophotography Source Folders

Use one folder per target object:

- `sources/m8/`
- `sources/leo-triplet/`
- `sources/rosette-nebula/`
- `sources/orion/`

You can also add more object folders at any time. The conversion scripts auto-discover all folders under `sources/`.

## Naming Rules

1. Put source files (`.jpg`, `.jpeg`, `.png`) in the matching object folder.
2. If a file is named `primary`, `main`, `source`, or `raw`, output files use only the object key.
3. Any other filename adds a suffix to support multiple versions.

Examples:

- `sources/orion/primary.png` -> `orion-600w.webp`, `orion-1024w.webp`, `orion-1920w.webp`, `orion-4k.webp`
- `sources/orion/ha.png` -> `orion-ha-600w.webp`, `orion-ha-1024w.webp`, ...
- `sources/m8/source.jpeg` -> `m8-600w.webp`, `m8-1024w.webp`, ...

## Run Conversion

From `public/astrophotography/`:

```bash
bash ./convert.sh
```

Outputs are generated in `public/astrophotography/` to keep current app paths compatible.

import { Metadata } from 'next';
import { AstroHero } from '@/components/AstroHero';
import { AstroGalleryClient } from '@/components/AstroGalleryClient';
import FooterSection from '@/components/FooterSection';

export const metadata: Metadata = {
  title: 'Astrophotography | ASTEONETICA',
  description:
    'Explore our curated collection of deep-sky astrophotography. Featuring the Rosette Nebula, Leo Triplet, and Messier 81 in stunning detail.',
  keywords: [
    'astrophotography',
    'deep sky',
    'nebula',
    'galaxy',
    'astronomy',
    'observational astronomy',
  ],
};

export default function AstrophysicsPage() {
  return (
    <main className="relative w-full overflow-hidden bg-[var(--space-black)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(0,255,156,0.08),transparent_42%),radial-gradient(circle_at_82%_64%,rgba(64,156,255,0.06),transparent_48%),linear-gradient(to_bottom,rgba(1,6,12,0.16),rgba(2,10,18,0.06)_34%,rgba(2,10,18,0.16)_100%)]" />
      <AstroHero />
      <AstroGalleryClient />
      <FooterSection tone="integrated" />
    </main>
  );
}

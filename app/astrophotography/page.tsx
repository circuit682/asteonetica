import { Metadata } from 'next';
import { AstroHero } from '@/components/AstroHero';
import { AstroGalleryClient } from '@/components/AstroGalleryClient';

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
    <main className="w-full bg-black">
      <AstroHero />
      <AstroGalleryClient />
    </main>
  );
}

import type { Metadata } from 'next';
import { Gallery } from '@/components/gallery';
import { AppHeader } from '@/components/app-header';
import componentsData from '@/lib/components.json';
import type { GalleryComponent } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Component Gallery',
  description:
    'Searchable, filterable gallery of every component across Paragon and the Open edX MFE ecosystem.',
};

export default function RegistryGalleryPage() {
  const components = componentsData as unknown as GalleryComponent[];
  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />
      <Gallery components={components} />
    </main>
  );
}

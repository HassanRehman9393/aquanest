'use client';

import { PageLoader } from '@/components/ui/loaders';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <PageLoader />
    </div>
  );
}

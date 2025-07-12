import { Flowy } from '~/components/flowy';
import type { Route } from './+types/_index';
import { ComponentList } from '~/components/component-list';
import type { CSSProperties } from 'react';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Flowy - Run your API workflows' }];
}

export default function IndexPage() {
  return (
    <main
      style={{ '--sidebar-width': 'calc(var(--spacing)*54)' } as CSSProperties}
    >
      <ComponentList />
      <div className="ml-[var(--sidebar-width)] h-screen w-[calc(100vw-var(--sidebar-width))]">
        <Flowy />
      </div>
    </main>
  );
}

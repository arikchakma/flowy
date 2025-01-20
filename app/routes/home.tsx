import { Flowy } from '~/components/flowy';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Flowy' }];
}

export default function Home() {
  return <Flowy />;
}

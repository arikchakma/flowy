import { Flowy } from '~/flowy/flowy';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Flowy' }];
}

export default function Home(props: Route.ComponentProps) {
  return <Flowy />;
}

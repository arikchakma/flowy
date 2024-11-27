import { Panel, useStore } from '@xyflow/react';
import { useFlowyStore } from '../../stores/flowy-store';

export function ViewportLogger() {
  const viewport = useStore(
    (s) =>
      `x: ${s.transform[0].toFixed(2)}, y: ${s.transform[1].toFixed(2)}, zoom: ${s.transform[2].toFixed(2)}`
  );

  const { steps, status } = useFlowyStore();

  return (
    <Panel position="top-left" className="font-mono text-sm">
      <div>{viewport}</div>
      <div>Status: {status}</div>
      <div>
        Steps: <pre>{JSON.stringify(steps, null, 2)}</pre>
      </div>
    </Panel>
  );
}

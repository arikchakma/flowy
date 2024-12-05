import { Panel, useStore } from '@xyflow/react';

export function ViewportLogger() {
  const viewport = useStore(
    (s) =>
      `x: ${s.transform[0].toFixed(2)}, y: ${s.transform[1].toFixed(2)}, zoom: ${s.transform[2].toFixed(2)}`
  );

  return (
    <Panel position="top-left" className="font-mono text-sm">
      <div>{viewport}</div>
      <div>Status: {status}</div>
      <div>
        Results:{' '}
        {/* <pre>
          {JSON.stringify(
            Array.from(results.entries()).map(([key, value]) => ({
              nodeId: key,
              ...value,
            })),
            null,
            2
          )}
        </pre> */}
      </div>
    </Panel>
  );
}

type NodeIdProps = {
  nodeId: string;
};

export function NodeId(props: NodeIdProps) {
  const { nodeId } = props;

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="shadow-border pointer-events-none absolute -top-0 z-10 flex min-h-4.5 min-w-4.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-black px-2 font-mono text-[8px] leading-none font-semibold text-white tabular-nums shadow-white">
      {nodeId.padStart(2, '0')}
    </div>
  );
}

type NodeIdProps = {
  nodeId: string;
};

export function NodeId(props: NodeIdProps) {
  const { nodeId } = props;

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute -top-0 z-10 flex size-4.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border bg-black font-mono text-[8px] leading-none font-semibold text-white">
      {nodeId}
    </div>
  );
}

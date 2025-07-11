type NodeIdProps = {
  nodeId: string;
};

export function NodeId(props: NodeIdProps) {
  const { nodeId } = props;

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="absolute -top-0 flex aspect-square size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border bg-black p-1 font-mono text-[11px] leading-none font-medium text-white">
      {nodeId}
    </div>
  );
}

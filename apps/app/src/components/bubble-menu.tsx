import { Panel, useReactFlow } from '@xyflow/react';
import { MaximizeIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

export function BubbleMenu() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Panel position="bottom-center">
      <div className="flex items-center gap-0.5 rounded-xl border border-zinc-300 bg-white p-0.5">
        <button
          className="flex size-8 cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1.5 leading-none hover:bg-zinc-200/70"
          onClick={() => zoomIn()}
        >
          <ZoomInIcon className="size-3.5 shrink-0 stroke-[2.5]" />
        </button>
        <button
          className="flex size-8 cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1.5 leading-none hover:bg-zinc-200/70"
          onClick={() => zoomOut()}
        >
          <ZoomOutIcon className="size-3.5 shrink-0 stroke-[2.5]" />
        </button>
        <button
          className="flex size-8 cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1.5 leading-none hover:bg-zinc-200/70"
          onClick={() => fitView()}
        >
          <MaximizeIcon className="size-3.5 shrink-0 stroke-[2.5]" />
        </button>
      </div>
    </Panel>
  );
}

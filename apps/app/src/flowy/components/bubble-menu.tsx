import { Panel, useReactFlow } from '@xyflow/react';
import { MaximizeIcon, PlayIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { AppNode } from '@flowy/shared';
import { useFlowyManager } from '@flowy/react';

export function BubbleMenu() {
  const flowManager = useFlowyManager();
  
  const { zoomIn, zoomOut, fitView, getNodes, getEdges } =
    useReactFlow<AppNode>();

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

        <button
          className="flex min-h-8 cursor-pointer items-center gap-1 rounded-lg bg-zinc-900 px-2 py-1.5 leading-none text-white hover:bg-zinc-800"
          onClick={async () => {
            await flowManager.run(getNodes(), getEdges());
          }}
        >
          <PlayIcon className="size-3.5 shrink-0 fill-current stroke-[2.5]" />
          Run
        </button>
      </div>
    </Panel>
  );
}

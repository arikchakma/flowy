import { Panel, useReactFlow } from '@xyflow/react';
import { MaximizeIcon, PlayIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import type { AppNode } from '~/types/nodes';
import { useWorkflowEngine } from '~/lib/workflow-engine-provider';

export function BubbleMenu() {
  const engine = useWorkflowEngine();
  const { zoomIn, zoomOut, fitView, getNodes, getEdges } =
    useReactFlow<AppNode>();

  return (
    <Panel position="bottom-center">
      <div className="shadow-border flex items-center gap-1 rounded-full bg-white p-1">
        <button
          className="flex size-7 cursor-pointer items-center justify-center gap-1 rounded-full bg-zinc-100 px-2 py-1.5 leading-none text-zinc-500 hover:bg-zinc-200/70 hover:text-black"
          onClick={() => zoomIn()}
        >
          <ZoomInIcon className="size-3.5 shrink-0 stroke-[2.5]" />
        </button>
        <button
          className="flex size-7 cursor-pointer items-center justify-center gap-1 rounded-full bg-zinc-100 px-2 py-1.5 leading-none text-zinc-500 hover:bg-zinc-200/70 hover:text-black"
          onClick={() => zoomOut()}
        >
          <ZoomOutIcon className="size-3.5 shrink-0 stroke-[2.5]" />
        </button>
        <button
          className="flex size-7 cursor-pointer items-center justify-center gap-1 rounded-full bg-zinc-100 px-2 py-1.5 leading-none text-zinc-500 hover:bg-zinc-200/70 hover:text-black"
          onClick={() => fitView()}
        >
          <MaximizeIcon className="size-3.5 shrink-0 stroke-[2.5]" />
        </button>

        <button
          className="flex min-h-7 cursor-pointer items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1.5 leading-none text-white hover:bg-zinc-800"
          onClick={async () => {
            await engine.start(getNodes(), getEdges());
          }}
        >
          <PlayIcon className="size-3.5 shrink-0 fill-current stroke-[2.5]" />
          Run
        </button>
      </div>
    </Panel>
  );
}

import { Panel, useReactFlow } from '@xyflow/react';
import {
  Loader2Icon,
  MaximizeIcon,
  PlayIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react';
import type { AppNode } from '~/types/nodes';
import { useWorkflowEngine } from '~/lib/workflow-engine-provider';
import { useWorkflowStatus } from '~/lib/use-workflow-status';

export function BubbleMenu() {
  const engine = useWorkflowEngine();
  const { zoomIn, zoomOut, fitView, getNodes, getEdges } =
    useReactFlow<AppNode>();
  const status = useWorkflowStatus();
  const isRunning = status === 'running';

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
          className="flex min-h-7 cursor-pointer items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1.5 text-sm leading-none font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={async () => {
            await engine.start(getNodes(), getEdges());
          }}
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2Icon className="size-3.5 shrink-0 animate-spin stroke-[2.5]" />
          ) : (
            <PlayIcon className="size-3.5 shrink-0 fill-current stroke-[2.5]" />
          )}
          {isRunning ? 'Running' : 'Run'}
        </button>
      </div>
    </Panel>
  );
}

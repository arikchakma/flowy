import {
  ALargeSmallIcon,
  ArrowUp10Icon,
  InfinityIcon,
  LinkIcon,
  LoaderIcon,
  Parentheses,
  PlusIcon,
  TargetIcon,
  ToggleRightIcon,
  WifiIcon,
} from 'lucide-react';
import { cn } from '~/utils/classname';

const draggableComponentList = [
  {
    type: 'start',
    title: 'Start',
    icon: <TargetIcon className="h-4 w-4" />,
  },
  {
    type: 'boolean',
    title: 'Boolean',
    icon: <ToggleRightIcon className="h-4 w-4" />,
  },
  {
    type: 'string',
    title: 'String',
    icon: <ALargeSmallIcon className="h-4 w-4" />,
  },
  {
    type: 'number',
    title: 'Number',
    icon: <ArrowUp10Icon className="h-4 w-4" />,
  },
  {
    type: 'variable',
    title: 'Variable',
    icon: <WifiIcon className="h-4 w-4" />,
  },
  {
    type: 'record',
    title: 'Record',
    icon: <PlusIcon className="h-4 w-4" />,
  },
  {
    type: 'select',
    title: 'Select',
    icon: <LinkIcon className="h-4 w-4" />,
  },
  {
    type: 'request',
    title: 'Request',
    icon: <WifiIcon className="h-4 w-4" />,
  },
  {
    type: 'repeat',
    title: 'Repeat',
    icon: <InfinityIcon className="h-4 w-4" />,
    disabled: true,
  },
  {
    type: 'delay',
    title: 'Delay',
    icon: <LoaderIcon className="h-4 w-4" />,
  },
  {
    type: 'log',
    title: 'Log',
    icon: <Parentheses className="h-4 w-4" />,
  },
];

export function handleOnDragStart(
  event: React.DragEvent<HTMLDivElement>,
  nodeType: string
) {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
}

export function ComponentList() {
  return (
    <div className="fixed top-0 left-0 z-10 flex h-screen w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto border-r border-r-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-xs font-normal text-gray-400 uppercase">
          Components <span className="text-[10px]">(Drag & Drop)</span>
        </h1>
      </div>

      <aside className="react-flow__sidebar components-sidebar flex grow flex-col gap-1.5 select-none">
        {draggableComponentList.map((component) => (
          <div
            key={component.type}
            className={cn(
              'dndnode flex cursor-grab items-center justify-start gap-2 rounded-xl border border-zinc-200 p-2 px-2.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
              component.disabled && 'cursor-not-allowed opacity-50'
            )}
            onDragStart={(event) => handleOnDragStart(event, component.type)}
            draggable={!component.disabled}
            aria-disabled={component.disabled}
          >
            {component.icon}
            {component.title}
          </div>
        ))}
      </aside>
    </div>
  );
}

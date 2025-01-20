import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../utils/classname';

type SwitchProps = React.ComponentProps<typeof SwitchPrimitives.Root> & {
  ref?: React.Ref<typeof SwitchPrimitives.Root>;
};

export function Switch(props: SwitchProps) {
  const { className, ref, ...rest } = props;

  return (
    <SwitchPrimitives.Root
      className={cn(
        'focus-visible:ring-ring focus-visible:ring-offset-background peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-zinc-600',
        className
      )}
      {...rest}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-zinc-50 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-zinc-50'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/classname';

export interface SelectPropsNative
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  iconClassName?: string;
}

const SelectNative = React.forwardRef<HTMLSelectElement, SelectPropsNative>(
  ({ className, children, iconClassName, ...props }, ref) => {
    return (
      <div className="relative isolate flex">
        <select
          className={cn(
            'has-[option[disabled]:checked]:text-muted-foreground peer inline-flex w-full cursor-pointer appearance-none items-center rounded-lg border border-gray-200 bg-white text-sm text-zinc-900 shadow-sm shadow-black/5 transition-shadow focus-visible:border-gray-300 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            props.multiple
              ? '[&_option:checked]:bg-accent py-1 [&>*]:px-3 [&>*]:py-1'
              : 'h-9 pe-6 ps-3',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {!props.multiple && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex h-full w-6 items-center justify-center text-gray-500 peer-disabled:opacity-50">
            <ChevronDown
              className={cn('size-4 stroke-2', iconClassName)}
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    );
  }
);
SelectNative.displayName = 'SelectNative';

export { SelectNative };

import { IconGripVertical } from "@tabler/icons-react";
import clsx from "clsx";
import { ComponentProps, ElementRef, ReactNode, forwardRef } from "react";

type ContainerInnerProps = Omit<
  ComponentProps<"div">,
  "onKeyDown" | "onPointerDown" | "onTouchStart" | "title"
> &
  Pick<
    ComponentProps<"button">,
    "onKeyDown" | "onPointerDown" | "onTouchStart"
  > & {
    title: ReactNode;
    isDragging?: boolean;
    isOver?: boolean;
    isSorting?: boolean;
  };

export const ContainerInner = forwardRef<
  ElementRef<"div">,
  ContainerInnerProps
>(
  (
    {
      title,
      children,
      onKeyDown,
      onPointerDown,
      onTouchStart,
      isDragging,
      isOver,
      isSorting,
      className,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={clsx(
          "border bg-indigo-200 p-5 rounded-lg h-full w-xs",
          isDragging && "opacity-50 bg-green-500",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <p>{title}</p>
          <button
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onTouchStart={onTouchStart}
            className="flex items-center justify-center cursor-move touch-none"
          >
            <IconGripVertical className="size-4 shrink-0" />
          </button>
        </div>
        <div className="space-y-2 mt-4">{children}</div>
      </div>
    );
  }
);

ContainerInner.displayName = "ContainerInner";

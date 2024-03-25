import { IconGripVertical } from "@tabler/icons-react";
import clsx from "clsx";
import { ComponentProps, ElementRef, ReactNode, forwardRef } from "react";

type ItemInnerProps = Omit<
  ComponentProps<"div">,
  "onKeyDown" | "onPointerDown" | "onTouchStart" | "children" | "title"
> &
  Pick<
    ComponentProps<"button">,
    "onKeyDown" | "onPointerDown" | "onTouchStart"
  > & {
    title: ReactNode;
    isDragging?: boolean;
  };

export const ItemInner = forwardRef<ElementRef<"div">, ItemInnerProps>(
  (
    {
      title,
      onKeyDown,
      onPointerDown,
      onTouchStart,
      isDragging,
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
          "border bg-white p-5 rounded-lg flex items-center gap-2 justify-between",
          isDragging && "opacity-50 bg-green-500",
          className
        )}
        {...props}
      >
        <div>{title}</div>
        <button
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onTouchStart={onTouchStart}
          className="flex items-center justify-center cursor-move touch-none"
        >
          <IconGripVertical className="size-4 shrink-0" />
        </button>
      </div>
    );
  }
);

ItemInner.displayName = "ItemInner";

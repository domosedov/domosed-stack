"use client";

import {
  DataRef,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import clsx from "clsx";
import {
  ComponentProps,
  ElementRef,
  ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";

enum Kind {
  item = "item",
  container = "container",
}

type ItemType = {
  kind: Kind.item;
  id: UniqueIdentifier;
  title: string;
  containerId: UniqueIdentifier | null;
};

type ContainerType = {
  kind: Kind.container;
  id: UniqueIdentifier;
  title: string;
};

export default function DndPage() {
  const [activeElement, setActiveElement] = useState<{
    id: UniqueIdentifier;
    kind: Kind;
  } | null>(null);

  const [items, setItems] = useState<ItemType[]>([
    { id: "1", title: "Item 1", containerId: "droppable-1", kind: Kind.item },
    { id: "2", title: "Item 2", containerId: "droppable-1", kind: Kind.item },
    { id: "3", title: "Item 3", containerId: "droppable-2", kind: Kind.item },
  ]);

  const [containers, setContainers] = useState<ContainerType[]>([
    {
      id: "droppable-1",
      title: "Container 1",
      kind: Kind.container,
    },
    {
      id: "droppable-2",
      title: "Container 2",
      kind: Kind.container,
    },
  ]);

  const contextId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    console.log("DragStartEvent", event);
    const {
      active: { id, data },
    } = event;

    const kind = (data as DataRef<{ kind: Kind }>)?.current?.kind;

    if (id && kind) setActiveElement({ id, kind });
  }

  function handleDragEnd(_event: DragEndEvent) {
    setActiveElement(null);
  }

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1>Drag and Drop</h1>
      <section className="grid grid-cols-3 gap-5">
        <DndContext
          id={contextId}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={containers.map((c) => c.id)}
            strategy={horizontalListSortingStrategy}
          >
            {containers.map((container) => (
              <Container
                key={container.id}
                id={container.id}
                title={container.title}
              >
                <SortableContext
                  items={items
                    .filter((i) => i.containerId === container.id)
                    .map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items
                    .filter((i) => i.containerId === container.id)
                    .map((item) => (
                      <Draggable
                        key={item.id}
                        id={item.id}
                        title={item.title}
                      />
                    ))}
                </SortableContext>
              </Container>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeElement && activeElement.kind === Kind.item && (
              <ItemInner
                title={
                  items.find((item) => item.id === activeElement.id)?.title
                }
              />
            )}
            {activeElement && activeElement.kind === Kind.container && (
              <ContainerInner
                title={
                  containers.find(
                    (container) => container.id === activeElement.id
                  )?.title
                }
              >
                {items
                  .filter((item) => item.containerId === activeElement.id)
                  .map((item) => (
                    <ItemInner
                      key={item.id}
                      id={item.id.toString()}
                      title={item.title}
                    />
                  ))}
              </ContainerInner>
            )}
          </DragOverlay>
        </DndContext>
      </section>
    </div>
  );
}

function Draggable({ id, title }: { id: UniqueIdentifier; title: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        kind: "item",
      },
    });

  return (
    <ItemInner
      id={id.toString()}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      title={title}
    />
  );
}

function Container({
  id,
  title,
  children,
}: {
  id: UniqueIdentifier;
  title: string;
  children: ReactNode;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
      data: {
        kind: "container",
      },
    });

  return (
    <ContainerInner
      id={id.toString()}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="border border-dashed border-gray-500 bg-gray-200 p-5 rounded-lg"
      title={title}
      {...attributes}
      {...listeners}
    >
      {children}
    </ContainerInner>
  );
}

type ItemInnerProps = Omit<
  ComponentProps<"div">,
  "onKeyDown" | "onPointerDown" | "onTouchStart" | "children" | "title"
> &
  Pick<
    ComponentProps<"button">,
    "onKeyDown" | "onPointerDown" | "onTouchStart"
  > & {
    title: ReactNode;
  };

const ItemInner = forwardRef<ElementRef<"div">, ItemInnerProps>(
  (
    { title, onKeyDown, onPointerDown, onTouchStart, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "border bg-white p-5 rounded-lg flex items-center gap-2 justify-between",
          className
        )}
        {...props}
      >
        <div>{title}</div>
        <button
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onTouchStart={onTouchStart}
          className="flex items-center justify-center cursor-move"
        >
          <IconGripVertical className="size-4 shrink-0" />
        </button>
      </div>
    );
  }
);

ItemInner.displayName = "ItemInner";

type ContainerInnerProps = Omit<
  ComponentProps<"div">,
  "onKeyDown" | "onPointerDown" | "onTouchStart" | "title"
> &
  Pick<
    ComponentProps<"button">,
    "onKeyDown" | "onPointerDown" | "onTouchStart"
  > & {
    title: ReactNode;
  };

const ContainerInner = forwardRef<ElementRef<"div">, ContainerInnerProps>(
  (
    {
      title,
      children,
      onKeyDown,
      onPointerDown,
      onTouchStart,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx("border bg-indigo-200 p-5 rounded-lg", className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <p>{title}</p>
          <button
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onTouchStart={onTouchStart}
            className="flex items-center justify-center cursor-move"
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

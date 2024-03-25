"use client";

import {
  DataRef,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
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
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ContainerInner } from "./container";
import { ItemInner } from "./item";

const Kind = {
  item: "item",
  container: "container",
} as const;

type Kind = keyof typeof Kind;

type ItemType = {
  kind: typeof Kind.item;
  id: UniqueIdentifier;
  title: string;
  containerId: UniqueIdentifier | null;
};

type ContainerType = {
  kind: typeof Kind.container;
  id: UniqueIdentifier;
  title: string;
};

type Payload = {
  kind: Kind;
};

type DataPayload = {
  current?: Payload;
};

export default function DndPage() {
  const [activeElement, setActiveElement] = useState<{
    id: UniqueIdentifier;
    kind: Kind;
  } | null>(null);

  const [items, setItems] = useState<ItemType[]>([
    { id: "1", title: "Item 1", containerId: "droppable-1", kind: Kind.item },
    { id: "2", title: "Item 2", containerId: "droppable-1", kind: Kind.item },
    { id: "3", title: "Item 3", containerId: "droppable-1", kind: Kind.item },
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

  const containersIds = useMemo(
    () => containers.map((c) => c.id),
    [containers]
  );

  const contextId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveElement({
      id: active.id,
      kind: active.data.current?.kind as Kind,
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAContainer = active.data.current?.kind === Kind.container;
    if (!isActiveAContainer) return;

    if (over.data.current?.kind === Kind.container) {
      setContainers((containers) => {
        const activeContainerIndex = containers.findIndex(
          (col) => col.id === activeId
        );

        const overContainerIndex = containers.findIndex(
          (col) => col.id === overId
        );

        return arrayMove(containers, activeContainerIndex, overContainerIndex);
      });
    }

    setActiveElement(null);
  }

  function handlerDragMove(event: DragMoveEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over?.id;

    if (activeId === overId) return;

    const isActiveItem = active.data.current?.kind === Kind.item;

    if (!isActiveItem) return;

    const isOverContainer = over.data.current?.kind === Kind.container;

    if (isOverContainer) {
      const activeItem = items.find((i) => i.id === activeId);

      if (!activeItem) return;

      setItems((items) => {
        const activeItemIndex = items.findIndex((i) => i.id === activeId);
        items[activeItemIndex].containerId = overId;

        return arrayMove(items, activeItemIndex, activeItemIndex);
      });
    } else {
      const activeContainerId = items.find(
        (i) => i.id === activeId
      )?.containerId;
      const overContainerId = items.find((i) => i.id === overId)?.containerId;

      if (!activeContainerId || !overContainerId) return;

      if (activeContainerId === overContainerId) {
        const activeIndex = items.findIndex((i) => i.id === activeId);
        const overIndex = items.findIndex((i) => i.id === overId);
        setItems((prev) => arrayMove(prev, activeIndex, overIndex));
      } else {
        setItems((items) => {
          const activeItemIndex = items.findIndex((i) => i.id === activeId);

          if (activeItemIndex === -1) return items;

          items[activeItemIndex].containerId = overContainerId;

          return arrayMove(items, activeItemIndex, activeItemIndex);
        });
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1>Drag and Drop</h1>
      <section className="grid grid-flow-col auto-cols-max gap-4 bg-gray-200 p-10 overflow-x-auto h-[400px]">
        <DndContext
          id={contextId}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handlerDragMove}
        >
          <SortableContext
            items={containersIds}
            strategy={horizontalListSortingStrategy}
          >
            {containers.map((container) => (
              <Container
                key={container.id}
                id={container.id}
                title={container.title}
              >
                <SortableContext
                  disabled={activeElement?.kind === Kind.container}
                  items={items
                    .filter((item) => item.containerId === container.id)
                    .map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items
                    .filter((item) => item.containerId === container.id)
                    .map((item) => (
                      <Item key={item.id} id={item.id} title={item.title} />
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
                id={activeElement.id.toString()}
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

function Item({ id, title }: { id: UniqueIdentifier; title: ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      kind: Kind.item,
    } satisfies Payload,
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
      isDragging={isDragging}
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
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    isOver,
    isSorting,
  } = useSortable({
    id,
    data: {
      kind: Kind.container,
    } satisfies Payload,
  });

  return (
    <ContainerInner
      id={id.toString()}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      title={title}
      isDragging={isDragging}
      isOver={isOver}
      isSorting={isSorting}
      {...attributes}
      {...listeners}
    >
      {children}
    </ContainerInner>
  );
}

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type DraggableRowProps = {
  type: string;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  id: string;
  toggleRow?: (id: string) => void;
  style: React.CSSProperties;
  isDraggable: boolean;
};

const DraggableRow = ({
  type,
  index,
  moveRow,
  children,
  id,
  toggleRow,
  style,
  isDraggable
}: DraggableRowProps) => {
  const ref = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: type,
    drop(item: { index: number; type: string }) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveRow(dragIndex, hoverIndex);

      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  const [, drag] = useDrag({
    type,
    item: { type, index },
    canDrag: () => {
      return !!isDraggable;
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  setTimeout(() => drag(drop(ref)), 100);

  return (
    <tr
      ref={ref}
      key={id}
      onClick={() => toggleRow && toggleRow(id)}
      style={{
        ...style,
        backgroundColor: isOver ? 'lightblue' : style.backgroundColor
      }}
      onKeyPress={e => {
        if ((e.key === 'Enter' || e.key === ' ') && toggleRow) {
          toggleRow(id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </tr>
  );
};

export default DraggableRow;

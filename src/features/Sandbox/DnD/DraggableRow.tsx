import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableRow = ({
  type,
  index,
  moveRow,
  children,
  id,
  toggleRow,
  style
}: any) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item: { index: number; type: string }) {
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
    }
  });

  const [, drag] = useDrag({
    type,
    item: { type, index },
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
      style={style}
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
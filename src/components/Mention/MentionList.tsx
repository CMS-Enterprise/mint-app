import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import './MentionList.scss';

const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: any) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.displayName });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items?.length - 1) % props.items?.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items?.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: any }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    }
  }));

  return (
    <div className="items">
      {props.items?.length ? (
        props.items?.map((item: any, index: any) => (
          <button
            className={`item ${index === selectedIndex ? 'is-selected' : ''}`}
            key={item.username}
            type="button"
            onClick={() => selectItem(index)}
          >
            {item.displayName}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});

export default MentionList;

/* MentionList renders the TipTap suggestion dropdown in addition to defining
defining keyboard events */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner';

import './index.scss';

export const SuggestionLoading = () => {
  return (
    <div className="items width-full padding-1">
      <Spinner size="small" />
    </div>
  );
};

const MentionList = forwardRef((props: any, ref) => {
  const { t } = useTranslation('discussions');

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sets the selected mention within the editor props
  const selectItem = (index: any) => {
    const item = props.items[index];

    if (item) {
      props.command({
        id: item.username,
        label: item.displayName,
        email: item.email
      });
    }
  };

  // Handler dropdown scroll event on keypress
  const scrollIntoView = () => {
    const selectedElm = document.getElementsByClassName('is-selected')[0];
    selectedElm.scrollIntoView({ block: 'nearest' });
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items?.length - 1) % props.items?.length
    );
    scrollIntoView();
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items?.length);
    scrollIntoView();
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
        <div className="item">{t('noResults')}</div>
      )}
    </div>
  );
});

export default MentionList;

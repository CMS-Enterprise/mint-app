import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import MentionTextArea from 'components/MentionTextArea';

import './index.scss';

type TruncatedTextProps = {
  id: string;
  text: string;
  charLimit?: number;
  className?: string;
  lineClamp?: number;
};

const TruncatedText = ({
  id,
  text,
  charLimit,
  className,
  lineClamp
}: TruncatedTextProps) => {
  const { t: generalT } = useTranslation('general');
  const [isOpen, setOpen] = useState(true);
  const [needsTruncation, setNeedsTruncation] = useState(false); // State for tracking truncation

  // Function to check if the text is clamped
  // https://stackoverflow.com/questions/52169520/how-can-i-check-whether-line-clamp-is-enabled
  const isTextClamped = (elm: HTMLElement | null): boolean =>
    !!elm && elm.scrollHeight > elm.clientHeight;

  // Function to apply the --line-clamp CSS variable
  const setLineClampVariable = (number: number) => ({
    '--line-clamp': !isOpen ? 'none' : number
  });

  // Effect to check for truncation on load
  useEffect(() => {
    const elm = document.querySelector('.line-clamped .tiptap') as HTMLElement;
    const truncationNeeded =
      (!!charLimit && text.length > charLimit) ||
      (!!lineClamp && isTextClamped(elm));

    setNeedsTruncation(truncationNeeded);
  }, [charLimit, lineClamp, text]);

  // If text is under character limit, return full text
  // Otherwise truncate text to character limit
  const startOfText: string = needsTruncation
    ? `${text.substring(0, charLimit)} ...`
    : text;

  return (
    <div
      className={classNames('truncated-text', className)}
      style={
        lineClamp
          ? (setLineClampVariable(lineClamp) as React.CSSProperties)
          : undefined
      }
    >
      <span className="display-block" id={id}>
        <MentionTextArea
          id={`mention-${id}`}
          editable={false}
          initialContent={isOpen ? startOfText : text}
          className={lineClamp ? 'line-clamped' : ''}
        />
      </span>
      {needsTruncation && (
        <Button
          type="button"
          onClick={() => setOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={id}
          unstyled
          className="display-flex flex-align-center margin-top-1"
        >
          {isOpen ? generalT('readMore') : generalT('readLess')}
          {isOpen ? <Icon.ExpandMore /> : <Icon.ExpandLess />}
        </Button>
      )}
    </div>
  );
};

export default TruncatedText;

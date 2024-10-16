import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

// This component takes free form text and a character limit and
// will return the whole text until it reaches the character limit, once
// it is over the character limit the text will be truncated and a
// button to expand / unexpand the text will be provided if the user
// desires to see the entire text
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

  const elm = document.querySelector('.line-clamped .tiptap');
  const isTextClamped = elm => elm?.scrollHeight > elm?.clientHeight;

  const needsTruncation: boolean =
    (!!charLimit && text.length > charLimit) ||
    (!!lineClamp && isTextClamped(elm));

  console.log(isTextClamped(elm));

  // Function to apply the --line-clamp CSS variable
  const setLineClampVariable = (number: number) => ({ '--line-clamp': number });

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
          className="line-clamped"
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

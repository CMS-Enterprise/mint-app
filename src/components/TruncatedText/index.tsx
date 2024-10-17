import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import MentionTextArea from 'components/MentionTextArea';

import './index.scss';

interface CommonProps {
  id: string;
  text: string;
  className?: string;
}

interface CharLimitProps extends CommonProps {
  charLimit: number;
  lineClamp?: never;
}

interface LineClampProps extends CommonProps {
  charLimit?: never;
  lineClamp: number;
}

type TruncatedTextProps = CharLimitProps | LineClampProps;

/**
 * TruncatedText Component: Displays text that can either be truncated by character limit or clamped by lines.
 * It shows a "Read more" or "Read less" button depending on the state of the text visibility.
 *
 * **Note**: You must provide either `charLimit` or `lineClamp`, but not both.
 * The component will throw an error if both or neither are provided.
 *
 * @component
 * @param {string} id - Unique identifier for the text block.
 * @param {string} text - The content text to be displayed.
 * @param {number} [charLimit] - Optional character limit to truncate the text. Cannot be used with `lineClamp`.
 * @param {number} [lineClamp] - Optional line clamp to limit the number of lines shown. Cannot be used with `charLimit`.
 * @param {string} [className] - Additional class names for styling.
 * @throws Will throw an error if both `charLimit` and `lineClamp` are provided, or if neither is provided.
 * @returns {JSX.Element} The truncated text component with optional "Read more" / "Read less" functionality.
 */
const TruncatedText = ({
  id,
  text,
  charLimit,
  className,
  lineClamp
}: TruncatedTextProps) => {
  const { t: generalT } = useTranslation('general');
  const [isOpen, setOpen] = useState(true);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  // Function to check if the text is clamped based on https://stackoverflow.com/questions/52169520/how-can-i-check-whether-line-clamp-is-enabled
  const isTextClamped = (elm: HTMLElement | null): boolean =>
    !!elm && elm.scrollHeight > elm.clientHeight;

  // Function to apply the --line-clamp CSS variable
  const setLineClampVariable = (number: number) => ({
    '--line-clamp': !isOpen ? 'none' : number
  });

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
      data-testid="truncated-text"
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

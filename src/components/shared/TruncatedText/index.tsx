import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';

// This component takes free form text and a character limit and
// will return the whole text until it reaches the character limit, once
// it is over the character limit the text will be truncated and a
// button to expand / unexpand the text will be provided if the user
// desires to see the entire text
import Mention from 'components/Mention';

type TruncatedTextProps = {
  id: string;
  text: string;
  charLimit: number;
  className?: string;
};

const TruncatedText = ({
  id,
  text,
  charLimit,
  className
}: TruncatedTextProps) => {
  const { t: generalT } = useTranslation('general');

  const [isOpen, setOpen] = useState(true);

  // If text is shorter then specified character limit, just
  // return the whole text
  if (text.length < charLimit) {
    return (
      <div className={className}>
        <Mention editable={false} initialContent={text} />
      </div>
    );
  }

  // Text is longer then specified character limit, truncate text
  // and provide button to allow users to expand / unexpand out
  // text if desired
  const startOfText: string = `${text.substring(0, charLimit)} ...`;

  return (
    <div className={className}>
      <span className="display-block" id={id}>
        <Mention
          editable={false}
          initialContent={isOpen ? startOfText : text}
        />
      </span>
      <Button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={id}
        unstyled
        className="display-flex flex-align-center margin-top-1"
      >
        {isOpen ? generalT('readMore') : generalT('readLess')}
        {isOpen ? <IconExpandMore /> : <IconExpandLess />}
      </Button>
    </div>
  );
};

export default TruncatedText;

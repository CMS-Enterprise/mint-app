/*
Wrapper for Truss' <Alert> component to allow for manually closing the component
*/

import React, { useEffect, useState } from 'react';
import { Alert as TrussAlert, Button } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type AlertProps = {
  type: 'success' | 'warning' | 'error' | 'info';
  heading?: React.ReactNode;
  children?: React.ReactNode;
  'data-testid'?: string;
  slim?: boolean;
  lessPadding?: boolean;
  noIcon?: boolean;
  inline?: boolean;
  isClosable?: boolean;
  closeAlert?: (closed: any) => void;
} & JSX.IntrinsicElements['div'];

export const Alert = ({
  type,
  heading,
  children,
  slim,
  lessPadding, // reduces x-padding from 2rem to 1rem
  noIcon,
  className,
  inline,
  // Default to closable button if type = success or error
  isClosable = type === 'success' || type === 'error',
  closeAlert,
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    {
      'mint-inline-alert': inline,
      'mint-alert-text': isClosable,
      'mint-alert-slim': lessPadding
    },
    'flex',
    className
  );

  const [isClosed, setClosed] = useState<boolean>(false);

  // closeAlert is a state setter passed down to conditionally render alert component from parent
  useEffect(() => {
    if (closeAlert && isClosed) closeAlert(null);
  }, [isClosed, closeAlert]);

  return (
    <>
      {!isClosed && (
        <TrussAlert
          type={type}
          heading={heading}
          slim={slim}
          noIcon={noIcon}
          className={classes}
          {...props}
        >
          <span>{children}</span>
          {isClosable && (
            <Button
              type="button"
              role="button"
              className="usa-button usa-button--unstyled text-no-underline text-black flex-align-end"
              tabIndex={0}
              aria-label="Close Button"
              onClick={() => setClosed(true)}
            >
              &#10005;
            </Button>
          )}
        </TrussAlert>
      )}
    </>
  );
};

export default Alert;

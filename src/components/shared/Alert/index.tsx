/*
Wrapper for Truss' <Alert> component to allow for manually closing the component
*/

import React, { useState } from 'react';
import { Alert as TrussAlert, Button } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type AlertProps = {
  type: 'success' | 'warning' | 'error' | 'info';
  heading?: React.ReactNode;
  children?: React.ReactNode;
  'data-testid'?: string;
  slim?: boolean;
  noIcon?: boolean;
  inline?: boolean;
  isClosable?: boolean;
} & JSX.IntrinsicElements['div'];

export const Alert = ({
  type,
  heading,
  children,
  slim,
  noIcon,
  className,
  inline,
  // Default to closable button if type = success or error
  isClosable = type === 'success' || type === 'error',
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  const classes = classnames(
    {
      'mint-inline-alert': inline,
      'mint-alert-text': isClosable
    },
    'flex',
    className
  );

  const [isClosed, setClosed] = useState<boolean>(false);

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
          {children}
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

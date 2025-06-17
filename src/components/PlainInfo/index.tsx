import React from 'react';
import { Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type PlainInfoProps = {
  className?: string;
  children: React.ReactNode;
  small?: boolean;
};

/**
 * This is a custom "info" component inspired by USWDS's Alert component.
 * The main difference is that this is plain with no background.
 */
const PlainInfo = ({ className, children, small }: PlainInfoProps) => {
  const classes = classnames('mint-plain-info', className);

  return (
    <div className={classes}>
      <Icon.Info
        size={small ? 3 : 5}
        className="mint-plain-info__icon"
        aria-label="info"
      />
      <p className="line-height-body-5">{children}</p>
    </div>
  );
};

export default PlainInfo;

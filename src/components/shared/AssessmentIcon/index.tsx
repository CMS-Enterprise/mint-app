import React from 'react';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

interface AssessmentIconProps {
  focusable?: boolean;
  role?: string;
  size?: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  className?: string;
}

// Custom Assessment team/role icon
const AssessmentIcon = ({
  focusable,
  role,
  size,
  className
}: AssessmentIconProps) => {
  return (
    <div className="assessment-container width-4 height-4 display-flex flex-justify-center bg-primary margin-right-1">
      <Icon.Star
        size={size}
        role={role}
        focusable={focusable}
        className={classNames('assessment-icon text-white', className)}
      />
    </div>
  );
};

export default AssessmentIcon;

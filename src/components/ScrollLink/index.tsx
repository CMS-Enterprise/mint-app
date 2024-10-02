import React from 'react';
import { Icon } from '@trussworks/react-uswds';

import { convertToLowercaseAndDashes } from 'utils/modelPlan';

const ScrollLink = ({ scrollTo }: { scrollTo: string }) => {
  return (
    <a
      href={`#${convertToLowercaseAndDashes(scrollTo)}`}
      className="display-flex flex-align-center"
    >
      {scrollTo}
      <Icon.ArrowForward className="margin-left-1" />
    </a>
  );
};

export default ScrollLink;

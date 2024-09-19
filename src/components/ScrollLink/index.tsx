import React from 'react';
import { Icon } from '@trussworks/react-uswds';

import { covertToLowercaseAndDashes } from 'utils/modelPlan';

const ScrollLink = ({ scrollTo }: { scrollTo: string }) => {
  return (
    <a
      href={`#${covertToLowercaseAndDashes(scrollTo)}`}
      className="display-flex flex-align-center"
    >
      {scrollTo}
      <Icon.ArrowForward className="margin-left-1" />
    </a>
  );
};

export default ScrollLink;

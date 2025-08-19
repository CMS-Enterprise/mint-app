import React from 'react';
import { Button, Icon } from '@trussworks/react-uswds';

import { convertToLowercaseAndDashes } from 'utils/modelPlan';

const ScrollLink = ({ scrollTo }: { scrollTo: string }) => {
  return (
    <Button
      type="button"
      onClick={() =>
        document
          .querySelector(`#${convertToLowercaseAndDashes(scrollTo)}`)
          ?.scrollIntoView({
            behavior: 'smooth'
          })
      }
      unstyled
    >
      {scrollTo}
      <Icon.ArrowForward className="margin-left-1" aria-label="forward" />
    </Button>
  );
};

export default ScrollLink;

import React from 'react';
import { Grid } from '@trussworks/react-uswds';
import { isArray } from 'lodash';

const SideBySideReadOnlySectionNew = ({
  children
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  let child1;
  let child2;

  if (isArray(children)) {
    [child1, child2] = children;
  }

  return (
    <Grid row gap>
      <Grid desktop={{ col: isArray(children) ? 6 : 12 }}>
        {isArray(children) ? child1 : children}
      </Grid>

      {!!isArray(children) && <Grid desktop={{ col: 6 }}>{child2}</Grid>}
    </Grid>
  );
};

export default SideBySideReadOnlySectionNew;

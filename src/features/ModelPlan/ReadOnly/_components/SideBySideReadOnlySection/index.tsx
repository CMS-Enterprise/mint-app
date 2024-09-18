import React from 'react';
import { Grid } from '@trussworks/react-uswds';

const SideBySideReadOnlySection = ({
  children
}: {
  children: (false | JSX.Element | null | undefined)[];
}) => {
  const [child1, child2] = children;

  return (
    <Grid row gap>
      <Grid desktop={{ col: child2 ? 6 : 12 }}>{child1}</Grid>

      {child2 && <Grid desktop={{ col: 6 }}>{child2}</Grid>}
    </Grid>
  );
};

export default SideBySideReadOnlySection;

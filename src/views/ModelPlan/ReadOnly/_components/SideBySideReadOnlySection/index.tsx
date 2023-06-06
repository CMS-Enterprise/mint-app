import React from 'react';
import { Grid } from '@trussworks/react-uswds';

import ReadOnlySection, { ReadOnlySectionProps } from '../ReadOnlySection';

type SideBySideReadOnlySectionProps = {
  firstSection: ReadOnlySectionProps;
  secondSection: ReadOnlySectionProps;
};

const SideBySideReadOnlySection = ({
  firstSection,
  secondSection
}: SideBySideReadOnlySectionProps) => {
  return (
    <Grid row>
      <Grid desktop={{ col: 6 }}>
        <ReadOnlySection
          heading={firstSection.heading}
          list={firstSection.list}
          listItems={firstSection.listItems}
          listOtherItem={firstSection.listOtherItem}
          copy={firstSection.copy}
          notes={firstSection.notes}
        />
      </Grid>
      <Grid desktop={{ col: 6 }}>
        <ReadOnlySection
          heading={secondSection.heading}
          list={secondSection.list}
          listItems={secondSection.listItems}
          listOtherItem={secondSection.listOtherItem}
          copy={secondSection.copy}
          notes={secondSection.notes}
        />
      </Grid>
    </Grid>
  );
};

export default SideBySideReadOnlySection;

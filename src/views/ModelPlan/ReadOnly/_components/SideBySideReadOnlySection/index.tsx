import React from 'react';
import { Grid } from '@trussworks/react-uswds';

import ReadOnlySection, { ReadOnlySectionProps } from '../ReadOnlySection';

type SideBySideReadOnlySectionProps = {
  firstSection: ReadOnlySectionProps;
  secondSection: ReadOnlySectionProps | boolean;
};

const SideBySideReadOnlySection = ({
  firstSection,
  secondSection
}: SideBySideReadOnlySectionProps) => {
  return (
    <Grid row gap>
      {secondSection ? (
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
      ) : (
        <ReadOnlySection
          heading={firstSection.heading}
          list={firstSection.list}
          listItems={firstSection.listItems}
          listOtherItem={firstSection.listOtherItem}
          copy={firstSection.copy}
          notes={firstSection.notes}
        />
      )}
      {secondSection && (
        <Grid desktop={{ col: 6 }}>
          <ReadOnlySection
            heading={(secondSection as ReadOnlySectionProps).heading}
            list={(secondSection as ReadOnlySectionProps).list}
            listItems={(secondSection as ReadOnlySectionProps).listItems}
            listOtherItem={
              (secondSection as ReadOnlySectionProps).listOtherItem
            }
            copy={(secondSection as ReadOnlySectionProps).copy}
            notes={(secondSection as ReadOnlySectionProps).notes}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default SideBySideReadOnlySection;

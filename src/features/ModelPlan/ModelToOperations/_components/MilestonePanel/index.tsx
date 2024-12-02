import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import { MilestoneCardType } from '../../MilestoneLibrary';

type MilestonePanelProps = {
  milestone: MilestoneCardType;
};

const MilestonePanel = ({ milestone }: MilestonePanelProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  return (
    <GridContainer className="padding-y-5 padding-x-4 side-panel--cr-and-tdl">
      <Grid row>
        <Grid col={12}>
          <div className="sidepanel__header">
            <h1>{milestone.name}</h1>
          </div>

          <div className="sidepanel__content">
            <>
              <div>
                <p className="text-bold">
                  {/* {t('echimpCard.implementationDate')} */}
                </p>
              </div>
            </>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default MilestonePanel;

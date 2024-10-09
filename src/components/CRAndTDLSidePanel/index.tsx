import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';

import './index.scss';

export type CRAndTDLSidePanelProps = {
  id: string;
  title?: string | null;
  crStatus?: string | null;
  emergencyCrFlag?: boolean | null;
  implementationDate?: string | null;
  isInReadView?: boolean;
  issuedDate?: string | null;
  sensitiveFlag?: boolean | null;
};

const CRAndTDLSidePanel = ({
  id,
  title,
  crStatus,
  emergencyCrFlag,
  implementationDate,
  isInReadView,
  issuedDate,
  sensitiveFlag
}: CRAndTDLSidePanelProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');
  return (
    <GridContainer className="padding-y-5 padding-x-4 side-panel--cr-and-tdl">
      <Grid row>
        <Grid col={12}>
          <div className="sidepanel__header">
            <h4 className="text-base">{id}</h4>
            <h1>{title?.replace(/&amp;/g, '&')}</h1>

            {(emergencyCrFlag || sensitiveFlag) && (
              <div className="echimp-card__cr-tags">
                {emergencyCrFlag && (
                  <div
                    className="echimp-card__cr-tag echimp-card__cr-tag--emergency"
                    data-testid="emergency__cr-tag"
                  >
                    <Icon.LocalFireDepartment />
                    {crtdlsT('echimpCard.crTag.emergency')}
                  </div>
                )}
                {sensitiveFlag && (
                  <div
                    className="echimp-card__cr-tag echimp-card__cr-tag--sensitive"
                    data-testid="sensitive__cr-tag"
                  >
                    <Icon.Flag />
                    {crtdlsT('echimpCard.crTag.sensitive')}
                  </div>
                )}
              </div>
            )}

            {crStatus && (
              <div className="echimp-card__cr-status">
                <p className="text-bold">{crtdlsT('echimpCard.crStatus')}:</p>
                <p>{crStatus}</p>
              </div>
            )}
          </div>
          <div className="sidepanel__content">
            <div className="echimp-card__date">
              {issuedDate && (
                <>
                  <p className="text-bold">
                    {crtdlsT('echimpCard.issuedDate')}
                  </p>
                  {/* Currently issuedDate returns '2024-07-24 00:00:00' */}
                  <p>{issuedDate?.split(' ')[0]}</p>
                </>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default CRAndTDLSidePanel;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import i18n from 'config/i18n';

import { DataOrNoData } from 'components/EChimpCards/EChimpCard';
import ExternalLink from 'components/ExternalLink';
import TruncatedText from 'components/TruncatedText';

import properlyCapitalizeInitiator from './_utils';

import './index.scss';

export type CRAndTDLSidePanelProps = {
  isCR: boolean;
  id: string;
  title?: string | null;
  crStatus?: string | null;
  status?: string | null;
  emergencyCrFlag?: boolean | null;
  implementationDate?: string | null;
  issuedDate?: string | null;
  sensitiveFlag?: boolean | null;
  initiator?: string | null;
  relatedCrTdlNumbers?: string | null;
  crSummary?: {
    rawContent: string;
  } | null;
};

const CRAndTDLSidePanel = ({
  isCR,
  id,
  title,
  crStatus,
  status,
  emergencyCrFlag,
  implementationDate,
  issuedDate,
  sensitiveFlag,
  initiator,
  relatedCrTdlNumbers,
  crSummary
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
                    <Icon.LocalFireDepartment aria-label="fire department" />
                    {crtdlsT('echimpCard.crTag.emergency')}
                  </div>
                )}
                {sensitiveFlag && (
                  <div
                    className="echimp-card__cr-tag echimp-card__cr-tag--sensitive"
                    data-testid="sensitive__cr-tag"
                  >
                    <Icon.Flag aria-label="flag" />
                    {crtdlsT('echimpCard.crTag.sensitive')}
                  </div>
                )}
              </div>
            )}

            <div className="echimp-card__status">
              <p className="text-bold">
                {isCR
                  ? crtdlsT('echimpCard.crStatus')
                  : crtdlsT('echimpCard.tdlStatus')}
                :
              </p>
              <DataOrNoData data={crStatus ?? status} />
            </div>
          </div>
          <div className="sidepanel__content">
            {isCR ? (
              <>
                <div>
                  <p className="text-bold">
                    {crtdlsT('echimpCard.implementationDate')}
                  </p>
                  <DataOrNoData data={implementationDate} />
                </div>
                <div>
                  <p className="text-bold">{crtdlsT('echimpCard.initiator')}</p>
                  {/* Currently initiator returns name in ALL CAPS */}
                  <DataOrNoData
                    data={initiator && properlyCapitalizeInitiator(initiator)}
                  />
                </div>
                <div className="sidepanel--full-width">
                  <p className="text-bold">{crtdlsT('echimpCard.crSummary')}</p>
                  {crSummary?.rawContent ? (
                    <TruncatedText
                      id={id}
                      text={crSummary?.rawContent}
                      lineClamp={5}
                    />
                  ) : (
                    <p className="text-base text-italic">
                      {crtdlsT('echimpCard.noData')}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-bold">
                    {crtdlsT('echimpCard.crTag.emergency')}
                    {crtdlsT('echimpCard.crTag.crQuestion')}
                  </p>
                  <p>
                    {emergencyCrFlag
                      ? i18n.t('general:yes')
                      : i18n.t('general:no')}
                  </p>
                </div>
                <div>
                  <p className="text-bold">
                    {crtdlsT('echimpCard.crTag.sensitive')}
                    {crtdlsT('echimpCard.crTag.crQuestion')}
                  </p>
                  <p>
                    {sensitiveFlag
                      ? i18n.t('general:yes')
                      : i18n.t('general:no')}
                  </p>
                </div>
                <div>
                  <p className="text-bold">
                    {crtdlsT('echimpCard.relatedCrTdl')}
                  </p>
                  <DataOrNoData data={relatedCrTdlNumbers} />
                </div>
              </>
            ) : (
              // If TDL, then render the following
              <div>
                <p className="text-bold">{crtdlsT('echimpCard.issuedDate')}</p>
                {/* Currently issuedDate returns '2024-07-24 00:00:00' */}
                <DataOrNoData data={issuedDate} />
              </div>
            )}

            <ExternalLink
              href={`${import.meta.env.VITE_ECHIMP_URL}?sysSelect=${isCR ? 'FFS' : 'TDL'}&crNum=${id}`}
              className="sidepanel--full-width margin-right-0"
              toEchimp
            >
              {crtdlsT('echimpCard.viewThisInECHIMP')}
            </ExternalLink>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default CRAndTDLSidePanel;

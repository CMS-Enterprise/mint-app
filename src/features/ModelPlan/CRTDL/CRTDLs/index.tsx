import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import EChimpCardsTable from 'components/EChimpCards/EChimpCardsTable';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { ModelInfoContext } from 'contexts/ModelInfoContext';

export const CRTDLs = () => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');
  const { t: miscT } = useTranslation('miscellaneous');

  const { modelID } = useParams<{ modelID: string }>();
  const { modelName } = useContext(ModelInfoContext);

  return (
    <MainContent data-testid="model-crtdls">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA,
              BreadcrumbItemOptions.CR_TDLS
            ]}
          />

          <PageHeading className="margin-top-4 margin-bottom-0">
            {crtdlsT('heading')}
          </PageHeading>

          <p
            className="margin-top-1 margin-bottom-0 font-body-lg"
            data-testid="model-plan-name"
          >
            {crtdlsT('subheading', { modelName })}
          </p>

          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area`}
            className="display-inline-flex flex-align-center margin-y-3"
          >
            <Icon.ArrowBack className="margin-right-1" aria-hidden />
            {miscT('returnToCollaborationArea')}
          </UswdsReactLink>

          <p className="margin-top-0 margin-bottom-3 font-body-md line-height-body-4">
            <Trans
              t={crtdlsT}
              i18nKey="description"
              components={{
                el: (
                  <ExternalLink
                    inlineText
                    href={import.meta.env.VITE_ECHIMP_URL}
                    toEchimp
                  >
                    {' '}
                  </ExternalLink>
                )
              }}
            />
          </p>

          <Alert type="info" slim className="margin-bottom-6">
            {crtdlsT('echimp')}
          </Alert>

          <EChimpCardsTable />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CRTDLs;

import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Grid,
  GridContainer,
  Icon,
  Link as TrussLink
} from '@trussworks/react-uswds';
import {
  GetModelPlanBaseQuery,
  useGetModelPlanBaseQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Expire from 'components/Expire';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

import PlanCRTDLsTable from './table';

type ModelPlanType = GetModelPlanBaseQuery['modelPlan'];

type CRTDLStatusType = 'success' | 'error';

export const CRTDLs = () => {
  // const { t: h } = useTranslation('general');
  const { t: crtdlsT } = useTranslation('crtdlsMisc');
  const { t: miscT } = useTranslation('miscellaneous');

  const { modelID } = useParams<{ modelID: string }>();
  const { message } = useMessage();
  const [crtdlMessage, setCRTDLMessage] = useState('');
  const [crtdlStatus, setCRTDLStatus] = useState<CRTDLStatusType>('error');

  const { data } = useGetModelPlanBaseQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || ({} as ModelPlanType);

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

          {message && <Expire delay={45000}>{message}</Expire>}

          {crtdlMessage && (
            <Expire delay={45000}>
              <Alert
                type={crtdlStatus}
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {crtdlMessage}
                </span>
              </Alert>
            </Expire>
          )}

          <PageHeading className="margin-top-4 margin-bottom-0">
            {crtdlsT('heading')}
          </PageHeading>

          <p className="margin-y-0 font-body-lg" data-testid="model-plan-name">
            {crtdlsT('subheading', { modelName: modelPlan.modelName })}
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
                    className="margin-right-0"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Model%20and%20Initiative%20Templates/2024%20Model%20Templates/Model%20Development%202-pager%20Template%205.24%20CLEAN.docx"
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

          {/* <PlanCRTDLsTable
            modelID={modelID}
            setCRTDLMessage={setCRTDLMessage}
            setCRTDLStatus={setCRTDLStatus}
          /> */}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CRTDLs;

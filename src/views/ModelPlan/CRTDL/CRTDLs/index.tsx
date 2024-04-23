import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer,
  Icon,
  Link as TrussLink
} from '@trussworks/react-uswds';
import { useGetModelPlanBaseQuery } from 'gql/gen/graphql';
import { GetModelPlanBase_modelPlan as ModelPlanType } from 'gql/gen/types/GetModelPlanBase';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';

import PlanCRTDLsTable from './table';

type CRTDLStatusType = 'success' | 'error';

export const CRTDLs = () => {
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('crtdlsMisc');
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
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelID}/task-list`}
              >
                <span>{t('breadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('heading')}</Breadcrumb>
          </BreadcrumbBar>

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
            {t('heading')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-2 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelPlan.modelName}
          </p>

          <p className="margin-bottom-2 font-body-md line-height-body-4">
            {t('description')}
          </p>

          <TrussLink
            aria-label="Open EUA in a new tab"
            href="https://echimp.cmsnet/"
            target="_blank"
            rel="noopener noreferrer"
            variant="external"
          >
            {t('visitECHIMP')}
          </TrussLink>

          <Alert type="info" slim className="margin-bottom-1">
            {t('echimp')}
          </Alert>

          <UswdsReactLink
            to={`/models/${modelID}/task-list`}
            className="display-inline-flex flex-align-center margin-y-3"
          >
            <Icon.ArrowBack className="margin-right-1" aria-hidden />
            {h('returnToTaskList')}
          </UswdsReactLink>

          <h4 className="margin-top-2 margin-bottom-1">{t('heading')}</h4>

          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to={`/models/${modelID}/cr-and-tdl/add-cr-and-tdl`}
          >
            {t('addCRTDL')}
          </UswdsReactLink>

          <PlanCRTDLsTable
            modelID={modelID}
            setCRTDLMessage={setCRTDLMessage}
            setCRTDLStatus={setCRTDLStatus}
          />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CRTDLs;

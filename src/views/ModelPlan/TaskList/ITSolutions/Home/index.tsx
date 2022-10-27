import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  IconNavigateNext,
  SummaryBox
} from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';

import OperationalNeedsTable from './operationalNeedsTable';

const ITSolutionsHome = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const modelName = 'HEY';
  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={UswdsReactLink} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/`}
          >
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {h('for')} {modelName}
      </p>

      <SummaryBox
        heading=""
        className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-bottom-2"
      >
        <p className="margin-top-0 margin-bottom-1">
          {t('summaryBox.useTracker')}
        </p>
        <ul className="padding-left-3 margin-top-0 margin-bottom-2">
          <li>{t('summaryBox.listItem.one')}</li>
          <li>{t('summaryBox.listItem.two')}</li>
          <li>{t('summaryBox.listItem.three')}</li>
        </ul>

        <UswdsReactLink to="/" className="display-flex flex-align-center">
          <IconNavigateNext className="margin-right-1" />
          {t('summaryBox.implementationStatuses')}
        </UswdsReactLink>
      </SummaryBox>

      <AskAQuestion modelID={modelID} />

      <Divider className="margin-y-4" />

      <OperationalNeedsTable modelID={modelID} type="needs" />

      <Divider className="margin-y-4" />

      <OperationalNeedsTable modelID={modelID} type="possibleNeeds" />
    </>
  );
};

export default ITSolutionsHome;

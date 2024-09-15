import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { SummaryBox } from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import Divider from 'components/Divider';
import Expire from 'components/Expire';
import useMessage from 'hooks/useMessage';
import { ModelInfoContext } from 'contexts/ModelInfoContext';

import HelpBox from '../_components/HelpBox';
import ImplementationStatuses from '../_components/ImplementationStatus';

import OperationalNeedsTable from './operationalNeedsTable';

const ITSolutionsHome = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('draftModelPlan');

  const { message } = useMessage();

  const { modelName } = useContext(ModelInfoContext);

  return (
    <>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST
        ]}
        customItem={t('breadcrumb')}
      />

      <Expire delay={45000}>{message}</Expire>

      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {h('for')} {modelName}
      </p>

      <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-bottom-2">
        <p className="margin-top-0 margin-bottom-1">
          {t('summaryBox.useTracker')}
        </p>
        <ul className="padding-left-3 margin-top-0 margin-bottom-2">
          <li>{t('summaryBox.listItem.one')}</li>
          <li>{t('summaryBox.listItem.two')}</li>
          <li>{t('summaryBox.listItem.three')}</li>
        </ul>

        <ImplementationStatuses />
      </SummaryBox>

      <AskAQuestion modelID={modelID} />

      <Divider className="margin-y-4" />

      <h2 className="margin-top-4 margin-bottom-2">
        {t('itSolutionsTable.needs')}
      </h2>

      <p className="line-height-body-4 margin-bottom-4">
        {t('itSolutionsTable.needsInfo')}
      </p>

      <OperationalNeedsTable modelID={modelID} type="needs" />

      <Divider className="margin-y-4" />

      <h2 className="margin-top-4 margin-bottom-2">
        {t('itSolutionsTable.otherNeeds')}
      </h2>

      <p className="line-height-body-4 margin-bottom-4">
        {t('itSolutionsTable.otherNeedsInfo')}
      </p>

      <OperationalNeedsTable modelID={modelID} type="possibleNeeds" />

      <HelpBox className="margin-top-4" />
    </>
  );
};

export default ITSolutionsHome;

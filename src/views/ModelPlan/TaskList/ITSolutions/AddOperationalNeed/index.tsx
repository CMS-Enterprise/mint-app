import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid } from '@trussworks/react-uswds';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import OperationalSolutionsSidebar from '../_components/OperationalSolutionSidebar';

const AddOperationalNeed = () => {
  const { modelID } = useParams<{ modelID: string }>();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const { modelName } = useContext(ModelInfoContext);

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    { text: t('addOpertationalNeed') }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* {mutationError && (
        <Alert type="error" slim>
          {t('updateError')}
        </Alert>
      )} */}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('addOpertationalNeed')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('addOpertationalNeedInfo')}</p>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <OperationalSolutionsSidebar modelID={modelID} />
        </Grid>
      </Grid>
    </>
  );
};

export default AddOperationalNeed;

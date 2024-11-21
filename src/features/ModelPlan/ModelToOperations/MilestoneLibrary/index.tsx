import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetMtoMilestonesQuery,
  useGetMtoMilestonesQuery
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';

import MilestoneCard from '../_components/MilestoneCard';

export type MilestoneCardType =
  GetMtoMilestonesQuery['modelPlan']['mtoMatrix']['milestones'][0];

const MilestoneLibrary = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { data, loading, error } = useGetMtoMilestonesQuery({
    variables: {
      id: modelID
    }
  });

  const milestones =
    data?.modelPlan?.mtoMatrix?.milestones || ([] as MilestoneCardType[]);

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
        customItem={t('milestoneLibrary.heading')}
      />

      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {t('milestoneLibrary.heading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {t('milestoneLibrary.description')}
      </p>

      <UswdsReactLink
        to={`/models/${modelID}/collaboration-area`}
        data-testid="return-to-collaboration"
      >
        <span>
          <Icon.ArrowBack className="top-3px margin-right-1" />
          {t('returnToCollaboration')}
        </span>
      </UswdsReactLink>

      {loading ? (
        <PageLoading />
      ) : (
        milestones.map(milestone => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))
      )}
    </>
  );
};

export default MilestoneLibrary;

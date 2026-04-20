import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import MilestoneCardGroup, {
  MilestoneCardType
} from 'features/MilestoneLibrary/MilestoneCardGroup';
import NotFound from 'features/NotFound';
import { useGetMtoMilestonesQuery } from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';

const MilestoneLibrary = () => {
  const { t: mtoMiscT } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { data, loading, error } = useGetMtoMilestonesQuery({
    variables: {
      id: modelID
    }
  });

  const dataAvailable: boolean = !loading || !!data?.modelPlan?.mtoMatrix;

  const milestones = useMemo(
    () =>
      data?.modelPlan?.mtoMatrix?.commonMilestones.filter(
        commonMilestone => !commonMilestone.isArchived
      ) || ([] as MilestoneCardType[]),
    [data?.modelPlan?.mtoMatrix?.commonMilestones]
  );

  if (error) {
    return <NotFound errorMessage={error.message} />;
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
        customItem={mtoMiscT('milestoneLibrary.heading')}
      />

      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {mtoMiscT('milestoneLibrary.heading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {mtoMiscT('milestoneLibrary.description')}
      </p>

      <div className="margin-bottom-6">
        <UswdsReactLink
          to={`/models/${modelID}/collaboration-area/model-to-operations/matrix`}
          data-testid="return-to-mto"
        >
          <span>
            <Icon.ArrowBack
              className="top-3px margin-right-1"
              aria-label="back"
            />
            {mtoMiscT('returnToMTO')}
          </span>
        </UswdsReactLink>
      </div>

      {!dataAvailable ? (
        <PageLoading />
      ) : (
        <MilestoneCardGroup milestones={milestones} />
      )}
    </GridContainer>
  );
};

export default MilestoneLibrary;

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  GetMtoMilestonesQuery,
  useGetMtoAllCommonMilestonesQuery,
  useGetMtoMilestonesQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { isAssessment } from 'utils/user';

import CommonMilestoneAdminActions from './_components/CommonMilestoneAdminActions';
import MilestoneCardGroup from './_components/MilestoneCardGroup';

import './index.scss';

export type MilestoneCardType =
  GetMtoMilestonesQuery['modelPlan']['mtoMatrix']['commonMilestones'][0];

const MilestoneLibrary = () => {
  const { t: hkcT } = useTranslation('helpAndKnowledge');
  const { t: mtoMiscT } = useTranslation('modelToOperationsMisc');

  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();
  const isAssessmentTeam = isAssessment(groups, flags);

  const location = useLocation();
  const isHkcMilestoneLibrary =
    location.pathname.includes('help-and-knowledge');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const returnedToUrl = isHkcMilestoneLibrary
    ? '/help-and-knowledge'
    : `/models/${modelID}/collaboration-area/model-to-operations/matrix`;

  const { data, loading, error } = useGetMtoMilestonesQuery({
    variables: {
      id: modelID
    },
    skip: isHkcMilestoneLibrary
  });

  const { data: allCommonMilestones } = useGetMtoAllCommonMilestonesQuery({
    skip: !isHkcMilestoneLibrary
  });

  const dataAvailable: boolean =
    !loading ||
    !!data?.modelPlan?.mtoMatrix ||
    !!allCommonMilestones?.mtoCommonMilestones;

  const milestones = useMemo(
    () =>
      (isHkcMilestoneLibrary
        ? allCommonMilestones?.mtoCommonMilestones
        : data?.modelPlan?.mtoMatrix?.commonMilestones) ||
      ([] as MilestoneCardType[]),
    [
      allCommonMilestones?.mtoCommonMilestones,
      data?.modelPlan?.mtoMatrix?.commonMilestones,
      isHkcMilestoneLibrary
    ]
  );

  if (!isHkcMilestoneLibrary && error) {
    return <NotFound errorMessage={error.message} />;
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={
          isHkcMilestoneLibrary
            ? [BreadcrumbItemOptions.HELP_CENTER]
            : [
                BreadcrumbItemOptions.HOME,
                BreadcrumbItemOptions.COLLABORATION_AREA,
                BreadcrumbItemOptions.MODEL_TO_OPERATIONS
              ]
        }
        customItem={mtoMiscT('milestoneLibrary.heading')}
      />

      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {mtoMiscT('milestoneLibrary.heading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {isHkcMilestoneLibrary
          ? hkcT('milestoneLibrary.description')
          : mtoMiscT('milestoneLibrary.description')}
      </p>

      <div className="margin-bottom-6">
        <UswdsReactLink to={returnedToUrl} data-testid="return-to-mto">
          <span>
            <Icon.ArrowBack
              className="top-3px margin-right-1"
              aria-label="back"
            />
            {isHkcMilestoneLibrary
              ? hkcT('milestoneLibrary.returnToHkc')
              : mtoMiscT('returnToMTO')}
          </span>
        </UswdsReactLink>
      </div>

      {isHkcMilestoneLibrary && isAssessmentTeam && (
        <CommonMilestoneAdminActions />
      )}

      {!dataAvailable ? (
        <PageLoading />
      ) : (
        <MilestoneCardGroup
          milestones={milestones}
          isHkcMilestoneLibrary={isHkcMilestoneLibrary}
        />
      )}
    </GridContainer>
  );
};

export default MilestoneLibrary;

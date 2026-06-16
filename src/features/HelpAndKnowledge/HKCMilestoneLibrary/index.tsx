import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import MilestoneCardGroup, {
  MilestoneCardType
} from 'features/MilestoneLibrary/MilestoneCardGroup';
import NotFound from 'features/NotFound';
import { useGetMtoAllCommonMilestonesQuery } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { isAssessment } from 'utils/user';

import CommonMilestoneAdminActions from './_components/CommonMilestoneAdminActions';

const HKCMilestoneLibrary = () => {
  const { t: hkcT } = useTranslation('helpAndKnowledge');

  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();
  const isAssessmentTeam = isAssessment(groups, flags);

  const location = useLocation();
  const isFromHome = React.useRef(location.state?.fromHomePage);

  const returnConfig = {
    label: isFromHome.current
      ? hkcT('milestoneLibrary.returnToHome')
      : hkcT('milestoneLibrary.returnToHkc'),
    to: isFromHome.current ? '/' : '/help-and-knowledge'
  };

  const {
    data: allCommonMilestones,
    loading,
    error
  } = useGetMtoAllCommonMilestonesQuery();

  const dataAvailable: boolean =
    !loading || !!allCommonMilestones?.mtoCommonMilestones;

  const milestones = useMemo(
    () =>
      allCommonMilestones?.mtoCommonMilestones.filter(
        commonMilestone => !commonMilestone.isArchived
      ) || ([] as MilestoneCardType[]),
    [allCommonMilestones?.mtoCommonMilestones]
  );

  if (error) {
    return <NotFound errorMessage={error.message} />;
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={[BreadcrumbItemOptions.HELP_CENTER]}
        customItem={hkcT('milestoneLibrary.hkcHeading')}
      />

      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {hkcT('milestoneLibrary.hkcHeading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {hkcT('milestoneLibrary.hkcDescription')}
      </p>

      <div className="margin-bottom-6">
        <UswdsReactLink to={returnConfig.to} data-testid="return-to-hkc">
          <span>
            <Icon.ArrowBack
              className="top-3px margin-right-1"
              aria-label="back"
            />
            {returnConfig.label}
          </span>
        </UswdsReactLink>
      </div>

      {isAssessmentTeam && <CommonMilestoneAdminActions />}

      {!dataAvailable ? (
        <PageLoading />
      ) : (
        <MilestoneCardGroup milestones={milestones} showFilters />
      )}
    </GridContainer>
  );
};

export default HKCMilestoneLibrary;

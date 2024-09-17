import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import {
  Grid,
  Icon,
  Link as TrussLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetAllBasicsQuery, useGetAllBasicsQuery } from 'gql/gen/graphql';
import i18next from 'i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tooltip from 'components/shared/Tooltip';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import { isAssessment } from 'utils/user';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import { FilterGroup } from '../_components/FilterView/BodyContent/_filterGroupMapping';
import ReadOnlySection from '../_components/ReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';

import './index.scss';

export type ReadOnlyProps = {
  modelID: string;
  clearance?: boolean;
  filteredView?: FilterGroup;
};

const ReadOnlyModelBasics = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const modelPlanConfig = usePlanTranslation('modelPlan');
  const basicsConfig = usePlanTranslation('basics');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllBasicsQuery({
    variables: {
      id: modelID
    }
  });

  const flags = useFlags();
  const isCollaborator = data?.modelPlan?.isCollaborator;
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const hasEditAccess: boolean = isCollaborator || isAssessment(groups, flags);

  const allBasicsData = (data?.modelPlan.basics ||
    {}) as GetAllBasicsQuery['modelPlan']['basics'];

  const { nameHistory } = data?.modelPlan || {};

  const filteredNameHistory = nameHistory?.filter(
    previousName => previousName !== modelName
  );

  const {
    demoCode,
    amsModelID,
    completeICIP,
    clearanceStarts,
    clearanceEnds,
    announced,
    applicationsStart,
    applicationsEnd,
    performancePeriodStarts,
    performancePeriodEnds,
    wrapUpEnds,
    phasedIn,
    phasedInNote,
    status
  } = allBasicsData;

  // Removing unneeded configurations from basicsConfig
  // Removed configurations will be manually rendered
  const {
    demoCode: demoCodeRemoved,
    amsModelID: amsModelIDRemoved,
    completeICIP: completeICIPRemoved,
    clearanceStarts: clearanceStartsRemoved,
    clearanceEnds: clearanceEndsRemoved,
    announced: announcedRemoved,
    applicationsStart: applicationsStartRemoved,
    applicationsEnd: applicationsEndRemoved,
    performancePeriodStarts: performancePeriodStartsRemoved,
    performancePeriodEnds: performancePeriodEndsRemoved,
    wrapUpEnds: wrapUpEndsRemoved,
    highLevelNote: highLevelNoteRemoved,
    phasedIn: phasedInRemoved,
    phasedInNote: phasedInNoteRemoved,
    ...filteredBasicsConfig
  } = basicsConfig;

  const timelineConfig = {
    completeICIP: basicsConfig.completeICIP,
    clearanceStarts: basicsConfig.clearanceStarts,
    clearanceEnds: basicsConfig.clearanceEnds,
    announced: basicsConfig.announced,
    applicationsStart: basicsConfig.applicationsStart,
    applicationsEnd: basicsConfig.applicationsEnd,
    performancePeriodStarts: basicsConfig.performancePeriodStarts,
    performancePeriodEnds: basicsConfig.performancePeriodEnds,
    wrapUpEnds: basicsConfig.wrapUpEnds,
    highLevelNote: basicsConfig.highLevelNote
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="read-only-model-plan--model-basics"
      data-testid="read-only-model-plan--model-basics"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={basicsMiscT('clearanceHeading')}
        heading={basicsMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={status}
        modelID={modelID}
        modifiedOrCreatedDts={
          allBasicsData.modifiedDts || allBasicsData.createdDts
        }
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <>
          <ReadOnlySection
            field="nameHistory"
            translations={modelPlanConfig}
            values={{ nameHistory: filteredNameHistory }}
            filteredView={filteredView}
          />

          {/* Other Identifiers section */}
          {!filteredView && (
            <div
              className={classNames(
                'bg-base-lightest padding-2 margin-top-4 margin-bottom-4',
                {
                  'maxw-mobile-lg': isTablet
                }
              )}
            >
              <p className="margin-top-0 text-bold">
                {basicsMiscT('otherIdentifiers')}
              </p>

              <p className="line-height-mono-4">
                {basicsMiscT('otherIdentifiersInfo1')}

                <span className="mint-no-print">
                  <TrussLink
                    aria-label="Open AMS in a new tab"
                    href="https://ams.cmmi.cms.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {basicsMiscT('otherIdentifiersInfo2')}
                  </TrussLink>
                </span>

                <span className="mint-only-print-inline">
                  {basicsMiscT('otherIdentifiersInfo2')}
                </span>

                {hasEditAccess
                  ? basicsMiscT('otherIdentifiersInfo3')
                  : basicsMiscT('otherIdentifiersInfo_noEditAccess')}
              </p>

              <Grid row gap>
                <Grid
                  col={6}
                  className={classNames({
                    'padding-bottom-2': isTablet
                  })}
                >
                  <p className="text-bold margin-top-0 margin-bottom-1">
                    {basicsT('amsModelID.label')}
                  </p>

                  {amsModelID || (
                    <div className="text-italic text-base">
                      {miscellaneousT('noneEntered')}
                    </div>
                  )}
                </Grid>
                <Grid col={6}>
                  <p className="text-bold margin-top-0 margin-bottom-1">
                    {basicsT('demoCode.label')}
                  </p>

                  {demoCode || (
                    <div className="text-italic text-base">
                      {miscellaneousT('noneEntered')}
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
          )}

          <ReadOnlyBody
            data={allBasicsData}
            config={filteredBasicsConfig}
            filteredView={filteredView}
          />

          {!!filteredView && filteredView !== 'ipc' ? (
            <ReadOnlyBody
              data={allBasicsData}
              config={timelineConfig}
              filteredView={filteredView}
            />
          ) : (
            <SectionWrapper
              className={classNames(
                'read-only-model-plan__timeline--wrapper border-base-light padding-top-4 ',
                {
                  'border-y-1px padding-bottom-2 margin-bottom-4 margin-top-6':
                    !filteredView
                }
              )}
            >
              <h3 className="margin-y-0">{basicsMiscT('highLevelTimeline')}</h3>

              <ProcessList className="read-only-model-plan__timeline">
                <ProcessListItem className="read-only-model-plan__timeline__list-item">
                  <BasicsTimelineItem
                    label={basicsT('completeICIP.label')}
                    value={completeICIP}
                  />
                </ProcessListItem>

                <ProcessListItem className="read-only-model-plan__timeline__list-item">
                  <div className="display-flex flex-align-top">
                    <ProcessListHeading
                      type="p"
                      className="font-body-sm line-height-sans-4"
                    >
                      {basicsMiscT('clearance')}
                    </ProcessListHeading>
                    <span className="margin-top-0 position-relative text-normal">
                      <Tooltip
                        label={basicsMiscT('clearanceInfo')}
                        position="right"
                        className="margin-left-05"
                      >
                        <Icon.Info className="text-base-light" />
                      </Tooltip>
                    </span>
                  </div>

                  <div className="mobile-lg:display-flex">
                    <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                      <BasicsTimelineItem
                        label={basicsT('clearanceStarts.label')}
                        value={clearanceStarts}
                      />
                    </div>

                    <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                      <BasicsTimelineItem
                        label={basicsT('clearanceEnds.label')}
                        value={clearanceEnds}
                      />
                    </div>
                  </div>
                </ProcessListItem>

                <ProcessListItem className="read-only-model-plan__timeline__list-item">
                  <BasicsTimelineItem
                    label={basicsT('announced.label')}
                    value={announced}
                  />
                </ProcessListItem>

                <ProcessListItem className="read-only-model-plan__timeline__list-item">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsMiscT('applicationPeriod')}
                  </ProcessListHeading>

                  <div className="mobile-lg:display-flex">
                    <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                      <BasicsTimelineItem
                        label={basicsT('applicationsStart.label')}
                        value={applicationsStart}
                      />
                    </div>

                    <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                      <BasicsTimelineItem
                        label={basicsT('applicationsEnd.label')}
                        value={applicationsEnd}
                      />
                    </div>
                  </div>
                </ProcessListItem>

                <ProcessListItem className="read-only-model-plan__timeline__list-item">
                  <div className="display-flex flex-align-top">
                    <ProcessListHeading
                      type="p"
                      className="font-body-sm line-height-sans-4"
                    >
                      {basicsMiscT('demonstrationPerformance')}
                    </ProcessListHeading>
                    <span className="margin-top-0 position-relative text-normal">
                      <Tooltip
                        label={basicsMiscT('demonstrationPerformanceInfo')}
                        position="right"
                        className="margin-left-05"
                      >
                        <Icon.Info className="text-base-light" />
                      </Tooltip>
                    </span>
                  </div>

                  <div className="mobile-lg:display-flex">
                    <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                      <BasicsTimelineItem
                        label={basicsT('performancePeriodStarts.label')}
                        value={performancePeriodStarts}
                      />
                    </div>

                    <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                      <BasicsTimelineItem
                        label={basicsT('performancePeriodEnds.label')}
                        value={performancePeriodEnds}
                      />
                    </div>
                  </div>
                </ProcessListItem>

                <ProcessListItem className="read-only-model-plan__timeline__list-item">
                  <BasicsTimelineItem
                    label={basicsT('wrapUpEnds.label')}
                    value={wrapUpEnds}
                  />
                </ProcessListItem>
              </ProcessList>

              <ReadOnlySection
                field="highLevelNote"
                translations={basicsConfig}
                values={{ phasedIn }}
                filteredView={filteredView}
              />
            </SectionWrapper>
          )}

          <ReadOnlySection
            field="phasedIn"
            translations={basicsConfig}
            values={{ phasedIn }}
            filteredView={filteredView}
          />

          <ReadOnlySection
            field="phasedInNote"
            translations={basicsConfig}
            values={{ phasedInNote }}
            filteredView={filteredView}
          />
        </>
      )}
    </div>
  );
};

const dateOrNoAnswer = (value: string | null | undefined) => {
  if (value) {
    return formatDateUtc(value, 'MM/dd/yyyy');
  }

  return (
    <em className="text-base">
      {i18next.t<string>('miscellaneous:dateFormat')}
    </em>
  );
};

const BasicsTimelineItem = ({
  label,
  value
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <>
    <ProcessListHeading type="p" className="font-body-sm line-height-sans-4">
      {label}
    </ProcessListHeading>

    <p className="margin-y-0 font-body-md line-height-sans-4">
      {dateOrNoAnswer(value)}
    </p>
  </>
);

export default ReadOnlyModelBasics;

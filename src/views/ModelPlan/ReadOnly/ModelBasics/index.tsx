import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Link as TrussLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetAllBasicsQuery, useGetAllBasicsQuery } from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/shared/SectionWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import ReadOnlySection from '../_components/ReadOnlySection';
import ReadOnlySectionNew from '../_components/ReadOnlySection/new';
import TitleAndStatus from '../_components/TitleAndStatus';

import './index.scss';

export type ReadOnlyProps = {
  modelID: string;
  clearance?: boolean;
  isViewingFilteredView?: boolean;
  filteredQuestions?: string[];
  filteredView?: string;
};

const ReadOnlyModelBasics = ({
  modelID,
  clearance,
  filteredView,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
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

  const allBasicsData = (data?.modelPlan.basics ||
    {}) as GetAllBasicsQuery['modelPlan']['basics'];

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

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
    highLevelNote,
    phasedIn,
    phasedInNote,
    status
  } = data?.modelPlan?.basics || {};

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

  const dateOrNoAnswer = (value: string | null | undefined) => {
    if (value) {
      return formatDateUtc(value, 'MM/dd/yyyy');
    }

    return <em className="text-base">{basicsMiscT('na')}</em>;
  };

  if (!data && loading) {
    return <PageLoading testId="basics-page-loading" />;
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
        isViewingFilteredView={isViewingFilteredView}
        status={status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      <ReadOnlySectionNew
        field="nameHistory"
        translations={modelPlanConfig}
        values={{ nameHistory: filteredNameHistory }}
        filteredView={filteredView}
      />

      {/* Other Identifiers section */}
      {!isViewingFilteredView && (
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

            {basicsMiscT('otherIdentifiersInfo3')}
          </p>

          <Grid row gap>
            <Grid
              desktop={{ col: 6 }}
              className={classNames({
                'padding-bottom-2': isTablet
              })}
            >
              <p className="text-bold margin-top-0 margin-bottom-1">
                {basicsT('amsModelID.label')}
              </p>

              {amsModelID || (
                <div className="text-italic text-base">
                  {basicsMiscT('noneEntered')}
                </div>
              )}
            </Grid>
            <Grid desktop={{ col: 6 }}>
              <p className="text-bold margin-top-0 margin-bottom-1">
                {basicsT('demoCode.label')}
              </p>

              {demoCode || (
                <div className="text-italic text-base">
                  {basicsMiscT('noneEntered')}
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

      {isViewingFilteredView && filteredView !== 'ipc' ? (
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
              'border-y-1px padding-bottom-2 margin-bottom-4 margin-top-6': !isViewingFilteredView
            }
          )}
        >
          <h3 className="margin-y-0">{basicsMiscT('highLevelTimeline')}</h3>

          <ProcessList className="read-only-model-plan__timeline">
            <ProcessListItem className="read-only-model-plan__timeline__list-item">
              <ProcessListHeading
                type="p"
                className="font-body-sm line-height-sans-4"
              >
                {basicsT('completeICIP.label')}
              </ProcessListHeading>

              <p className="margin-y-0 font-body-md line-height-sans-4">
                {dateOrNoAnswer(completeICIP)}
              </p>
            </ProcessListItem>

            <ProcessListItem className="read-only-model-plan__timeline__list-item">
              <ProcessListHeading
                type="p"
                className="font-body-sm line-height-sans-4"
              >
                {basicsMiscT('clearance')}
              </ProcessListHeading>

              <div className="mobile-lg:display-flex">
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsT('clearanceStarts.label')}
                  </ProcessListHeading>

                  <p className="margin-y-0 font-body-md line-height-sans-4">
                    {dateOrNoAnswer(clearanceStarts)}
                  </p>
                </div>
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsT('clearanceEnds.label')}
                  </ProcessListHeading>

                  <p className="margin-y-0 font-body-md line-height-sans-4">
                    {dateOrNoAnswer(clearanceEnds)}
                  </p>
                </div>
              </div>
            </ProcessListItem>
            <ProcessListItem className="read-only-model-plan__timeline__list-item">
              <ProcessListHeading
                type="p"
                className="font-body-sm line-height-sans-4"
              >
                {basicsT('announced.label')}
              </ProcessListHeading>

              <p className="margin-y-0 font-body-md line-height-sans-4">
                {dateOrNoAnswer(announced)}
              </p>
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
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsT('applicationsStart.label')}
                  </ProcessListHeading>

                  <p className="margin-y-0 font-body-md line-height-sans-4">
                    {dateOrNoAnswer(applicationsStart)}
                  </p>
                </div>
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsT('applicationsEnd.label')}
                  </ProcessListHeading>

                  <p className="margin-y-0 font-body-md line-height-sans-4">
                    {dateOrNoAnswer(applicationsEnd)}
                  </p>
                </div>
              </div>
            </ProcessListItem>

            <ProcessListItem className="read-only-model-plan__timeline__list-item">
              <ProcessListHeading
                type="p"
                className="font-body-sm line-height-sans-4"
              >
                {basicsMiscT('demonstrationPerformance')}
              </ProcessListHeading>
              <div className="mobile-lg:display-flex">
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsT('performancePeriodStarts.label')}
                  </ProcessListHeading>

                  <p className="margin-y-0 font-body-md line-height-sans-4">
                    {dateOrNoAnswer(performancePeriodStarts)}
                  </p>
                </div>
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {basicsT('performancePeriodEnds.label')}
                  </ProcessListHeading>

                  <p className="margin-y-0 font-body-md line-height-sans-4">
                    {dateOrNoAnswer(performancePeriodEnds)}
                  </p>
                </div>
              </div>
            </ProcessListItem>

            <ProcessListItem className="read-only-model-plan__timeline__list-item">
              <ProcessListHeading
                type="p"
                className="font-body-sm line-height-sans-4"
              >
                {basicsT('wrapUpEnds.label')}
              </ProcessListHeading>

              <p className="margin-y-0 font-body-md line-height-sans-4">
                {dateOrNoAnswer(wrapUpEnds)}
              </p>
            </ProcessListItem>
          </ProcessList>

          <ReadOnlySection
            heading={basicsT('highLevelNote.label')}
            copy={highLevelNote}
          />
        </SectionWrapper>
      )}

      <ReadOnlySectionNew
        field="phasedIn"
        translations={basicsConfig}
        values={{ phasedIn }}
        filteredView={filteredView}
      />

      <ReadOnlySectionNew
        field="phasedInNote"
        translations={basicsConfig}
        values={{ phasedInNote }}
        filteredView={filteredView}
      />
    </div>
  );
};

export default ReadOnlyModelBasics;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Icon,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { GetTimelineQuery, useGetTimelineQuery } from 'gql/generated/graphql';
import i18next from 'i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import Tooltip from 'components/Tooltip';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import { isAssessment } from 'utils/user';

import ReadOnlyBody from '../_components/Body';
import { FilterGroup } from '../_components/FilterView/BodyContent/_filterGroupMapping';
import ReadOnlySection from '../_components/ReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';

import './index.scss';

export type ReadOnlyProps = {
  modelID?: string;
  clearance?: boolean;
  editDates?: boolean;
  filteredView?: FilterGroup;
};

const ReadOnlyModelTimeline = ({
  modelID,
  clearance,
  editDates = true,
  filteredView
}: ReadOnlyProps) => {
  const { t: timelineT } = useTranslation('timeline');
  const { t: timelineMiscT } = useTranslation('timelineMisc');
  const modelTimelineConfig = usePlanTranslation('timeline');

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetTimelineQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  const flags = useFlags();

  const { groups } = useSelector((state: any) => state.auth);
  const hasEditAccess: boolean = isAssessment(groups, flags);

  const allTimelineData = (data?.modelPlan.timeline ||
    {}) as GetTimelineQuery['modelPlan']['timeline'];

  const {
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
    status
  } = allTimelineData;

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="read-only-model-plan--model-timeline"
      data-testid="read-only-model-plan--model-timeline"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={timelineMiscT('clearanceHeading')}
        heading={timelineMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={status}
        modelID={modelID}
        modifiedOrCreatedDts={
          allTimelineData.modifiedDts || allTimelineData.createdDts
        }
        editDates={editDates && hasEditAccess && !filteredView}
      />

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <>
          {!!filteredView && filteredView !== 'ipc' ? (
            <ReadOnlyBody
              data={allTimelineData}
              config={modelTimelineConfig}
              filteredView={filteredView}
            />
          ) : (
            <ProcessList className="read-only-model-plan__timeline margin-left-neg-1">
              <ProcessListItem className="read-only-model-plan__timeline__list-item">
                <TimelineItem
                  label={timelineT('completeICIP.label')}
                  value={completeICIP}
                />
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item">
                <div className="display-flex flex-align-top">
                  <ProcessListHeading
                    type="p"
                    className="mint-text-normal line-height-sans-4"
                  >
                    {timelineMiscT('clearance')}
                  </ProcessListHeading>
                  <span className="margin-top-0 position-relative text-normal">
                    <Tooltip
                      label={timelineMiscT('clearanceInfo')}
                      position="right"
                      className="margin-left-05"
                    >
                      <Icon.Info
                        className="text-base-light"
                        aria-label="info"
                      />
                    </Tooltip>
                  </span>
                </div>

                <div className="mobile-lg:display-flex">
                  <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                    <TimelineItem
                      label={timelineT('clearanceStarts.label')}
                      value={clearanceStarts}
                    />
                  </div>

                  <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                    <TimelineItem
                      label={timelineT('clearanceEnds.label')}
                      value={clearanceEnds}
                    />
                  </div>
                </div>
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item">
                <TimelineItem
                  label={timelineT('announced.label')}
                  value={announced}
                />
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item">
                <ProcessListHeading
                  type="p"
                  className="mint-text-normal line-height-sans-4"
                >
                  {timelineMiscT('applicationPeriod')}
                </ProcessListHeading>

                <div className="mobile-lg:display-flex">
                  <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                    <TimelineItem
                      label={timelineT('applicationsStart.label')}
                      value={applicationsStart}
                    />
                  </div>

                  <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                    <TimelineItem
                      label={timelineT('applicationsEnd.label')}
                      value={applicationsEnd}
                    />
                  </div>
                </div>
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item">
                <div className="display-flex flex-align-top">
                  <ProcessListHeading
                    type="p"
                    className="mint-text-normal line-height-sans-4"
                  >
                    {timelineMiscT('demonstrationPerformance')}
                  </ProcessListHeading>
                  <span className="margin-top-0 position-relative text-normal">
                    <Tooltip
                      label={timelineMiscT('demonstrationPerformanceInfo')}
                      position="right"
                      className="margin-left-05"
                    >
                      <Icon.Info
                        className="text-base-light"
                        aria-label="info"
                      />
                    </Tooltip>
                  </span>
                </div>

                <div className="mobile-lg:display-flex">
                  <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                    <TimelineItem
                      label={timelineT('performancePeriodStarts.label')}
                      value={performancePeriodStarts}
                    />
                  </div>

                  <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                    <TimelineItem
                      label={timelineT('performancePeriodEnds.label')}
                      value={performancePeriodEnds}
                    />
                  </div>
                </div>
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item">
                <TimelineItem
                  label={timelineT('wrapUpEnds.label')}
                  value={wrapUpEnds}
                />
              </ProcessListItem>
            </ProcessList>
          )}

          <ReadOnlySection
            field="highLevelNote"
            translations={modelTimelineConfig}
            values={{ highLevelNote }}
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
      {i18next.t<string, {}, string>('miscellaneous:dateFormat')}
    </em>
  );
};

const TimelineItem = ({
  label,
  value
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <>
    <ProcessListHeading
      type="p"
      className="mint-text-normal line-height-sans-4"
    >
      {label}
    </ProcessListHeading>

    <p className="mint-text-normal  margin-y-0 line-height-sans-4">
      {dateOrNoAnswer(value)}
    </p>
  </>
);

export default ReadOnlyModelTimeline;

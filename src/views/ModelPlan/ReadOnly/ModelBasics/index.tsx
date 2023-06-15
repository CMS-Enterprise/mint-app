import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import SectionWrapper from 'components/shared/SectionWrapper';
import GetAllBasics from 'queries/ReadOnly/GetAllBasics';
import { GetAllBasics as GetAllBasicsTypes } from 'queries/ReadOnly/types/GetAllBasics';
import { formatDateUtc } from 'utils/date';
import {
  translateBooleanOrNull,
  translateCmmiGroups,
  translateCmsCenter,
  translateModelCategory,
  translateModelType
} from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';

import './index.scss';

export type ReadOnlyProps = {
  modelID: string;
  clearance?: boolean;
  isViewingFilteredView?: boolean;
  filteredQuestions?: string[];
};

const ReadOnlyModelBasics = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t } = useTranslation('basics');
  const { t: p } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<GetAllBasicsTypes>(GetAllBasics, {
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const { nameHistory } = data?.modelPlan || {};
  const filteredNameHistory = nameHistory?.filter(
    previousName => previousName !== modelName
  );

  const {
    modelCategory,
    cmsCenters,
    cmsOther,
    cmmiGroups,
    modelType,
    problem,
    goal,
    testInterventions,
    note,
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
    highLevelNote,
    status
  } = data?.modelPlan?.basics || {};

  const dateOrNoAnswer = (value: string | null | undefined) => {
    if (value) {
      return formatDateUtc(value, 'MM/dd/yyyy');
    }
    return <em className="text-base">{t('na')}</em>;
  };

  return (
    <div
      className="read-only-model-plan--model-basics"
      data-testid="read-only-model-plan--model-basics"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance ? t('clearanceHeading') : t('heading')}
        </h2>
        {!isViewingFilteredView && status && (
          <TaskListStatusTag status={status} />
        )}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {checkGroupMap(
        isViewingFilteredView,
        filteredQuestions,
        'nameHistory',
        <ReadOnlySection
          heading={t('previousNames')}
          list
          listItems={filteredNameHistory}
        />
      )}

      {!isViewingFilteredView && (
        <ReadOnlySection
          heading={t('modelCategory')}
          copy={modelCategory && translateModelCategory(modelCategory)}
        />
      )}

      {!isViewingFilteredView && (
        <SideBySideReadOnlySection
          firstSection={{
            heading: t('cmsComponent'),
            list: true,
            listItems: cmsCenters?.map(translateCmsCenter),
            listOtherItem: cmsOther
          }}
          secondSection={{
            heading: t('cmmiGroup'),
            list: true,
            listItems: cmmiGroups?.map(translateCmmiGroups)
          }}
        />
      )}

      {checkGroupMap(
        isViewingFilteredView,
        filteredQuestions,
        'modelType',
        <ReadOnlySection
          heading={t('modelType')}
          copy={modelType && translateModelType(modelType)}
        />
      )}

      {!isViewingFilteredView && (
        <ReadOnlySection heading={t('problem')} copy={problem} />
      )}

      {checkGroupMap(
        isViewingFilteredView,
        filteredQuestions,
        'goal',
        <ReadOnlySection heading={t('goal')} copy={goal} />
      )}

      {!isViewingFilteredView && (
        <ReadOnlySection
          heading={t('testInterventions')}
          copy={testInterventions}
        />
      )}
      <ReadOnlySection heading={t('notes')} copy={note} />

      {/* TODO: timeline group mapping */}
      {isViewingFilteredView ? (
        <>
          <ReadOnlySection
            heading={t('completeICIP')}
            copy={completeICIP && formatDateUtc(completeICIP, 'MM/dd/yyyy')}
          />

          <SideBySideReadOnlySection
            firstSection={{
              heading: t('clearanceStartDate'),
              copy:
                clearanceStarts && formatDateUtc(clearanceStarts, 'MM/dd/yyyy')
            }}
            secondSection={{
              heading: t('clearanceEndDate'),
              copy: clearanceEnds && formatDateUtc(clearanceEnds, 'MM/dd/yyyy')
            }}
          />

          <ReadOnlySection
            heading={t('annouceModel')}
            copy={announced && formatDateUtc(announced, 'MM/dd/yyyy')}
          />

          <SideBySideReadOnlySection
            firstSection={{
              heading: t('applicationStartDate'),
              copy:
                applicationsStart &&
                formatDateUtc(applicationsStart, 'MM/dd/yyyy')
            }}
            secondSection={{
              heading: t('applicationEndDate'),
              copy:
                applicationsEnd && formatDateUtc(applicationsEnd, 'MM/dd/yyyy')
            }}
          />

          <SideBySideReadOnlySection
            firstSection={{
              heading: t('performanceStartDate'),
              copy:
                performancePeriodStarts &&
                formatDateUtc(performancePeriodStarts, 'MM/dd/yyyy')
            }}
            secondSection={{
              heading: t('performanceEndDate'),
              copy:
                performancePeriodEnds &&
                formatDateUtc(performancePeriodEnds, 'MM/dd/yyyy')
            }}
          />

          <ReadOnlySection
            heading={t('modelWrapUp')}
            copy={wrapUpEnds && formatDateUtc(wrapUpEnds, 'MM/dd/yyyy')}
          />
        </>
      ) : (
        <SectionWrapper className="read-only-model-plan__timeline--wrapper border-y-1px border-base-light margin-top-6 margin-bottom-4 padding-top-4 padding-bottom-2">
          <h3 className={`margin-top-0 margin-bottom-4'`}>
            {t('highLevelTimeline')}
          </h3>
          <ProcessList className="read-only-model-plan__timeline">
            <ProcessListItem className="read-only-model-plan__timeline__list-item">
              <ProcessListHeading
                type="p"
                className="font-body-sm line-height-sans-4"
              >
                {t('completeICIP')}
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
                {t('clearance')}
              </ProcessListHeading>
              <div className="mobile-lg:display-flex">
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {t('clearanceStartDate')}
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
                    {t('clearanceEndDate')}
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
                {t('annouceModel')}
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
                {t('applicationPeriod')}
              </ProcessListHeading>
              <div className="mobile-lg:display-flex">
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {t('applicationStartDate')}
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
                    {t('applicationEndDate')}
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
                {t('perforamncePeriod')}
              </ProcessListHeading>
              <div className="mobile-lg:display-flex">
                <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                  <ProcessListHeading
                    type="p"
                    className="font-body-sm line-height-sans-4"
                  >
                    {t('performanceStartDate')}
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
                    {t('performanceEndDate')}
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
                {t('modelWrapUp')}
              </ProcessListHeading>
              <p className="margin-y-0 font-body-md line-height-sans-4">
                {dateOrNoAnswer(wrapUpEnds)}
              </p>
            </ProcessListItem>
          </ProcessList>

          <ReadOnlySection heading={t('notes')} copy={highLevelNote} />
        </SectionWrapper>
      )}

      {checkGroupMap(
        isViewingFilteredView,
        filteredQuestions,
        'phasedIn',
        <ReadOnlySection
          heading={t('tightTimeline')}
          copy={translateBooleanOrNull(phasedIn)}
          notes={phasedInNote}
        />
      )}
    </div>
  );
};

export default ReadOnlyModelBasics;

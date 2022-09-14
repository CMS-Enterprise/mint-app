import React from 'react';
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
import { formatDate } from 'utils/date';
import {
  translateCmmiGroups,
  translateCmsCenter,
  translateModelCategory,
  translateModelType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

import './index.scss';

const ReadOnlyModelBasics = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('basics');
  const { t: h } = useTranslation('draftModelPlan');

  const { data, loading, error } = useQuery<GetAllBasicsTypes>(GetAllBasics, {
    variables: {
      id: modelID
    }
  });

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
    phasedInNote
  } = data?.modelPlan!.basics || {};

  const loremIpsum = ['Lorem1', 'Lorem2'];

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div className="read-only-model-plan--model-basics">
      <div className="display-flex flex-justify">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        <span className="model-plan-task-list__task-tag line-height-5 text-bold">
          In Progress
        </span>
      </div>

      <ReadOnlySection heading="Previous Name" list listItems={loremIpsum} />

      <ReadOnlySection
        heading={t('modelCategory')}
        copy={modelCategory && translateModelCategory(modelCategory)}
      />

      <ReadOnlySection
        heading={t('cmsComponent')}
        list
        listItems={cmsCenters?.map(translateCmsCenter)}
        copy={cmsOther}
      />

      <ReadOnlySection
        heading={t('cmmiGroup')}
        list
        listItems={cmmiGroups?.map(translateCmmiGroups)}
      />

      <ReadOnlySection
        heading={t('modelType')}
        copy={modelType && translateModelType(modelType)}
      />

      <ReadOnlySection heading={t('problem')} copy={problem} />
      <ReadOnlySection heading={t('goal')} copy={goal} />
      <ReadOnlySection
        heading={t('testInterventions')}
        copy={testInterventions}
      />
      <ReadOnlySection heading={t('notes')} copy={note} />

      <SectionWrapper className="read-only-model-plan__timeline--wrapper border-y-1px border-base-light margin-top-6 margin-bottom-4 padding-top-4 padding-bottom-2">
        <h3 className="margin-top-0 margin-bottom-4">
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
              {completeICIP ? formatDate(completeICIP, 'MM/dd/yyyy') : t('na')}
            </p>
          </ProcessListItem>

          <ProcessListItem className="read-only-model-plan__timeline__list-item">
            <ProcessListHeading
              type="p"
              className="font-body-sm line-height-sans-4"
            >
              {t('clearance')}
            </ProcessListHeading>
            <div className="display-flex">
              <div className="width-card-lg">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {t('clearanceStartDate')}
                </ProcessListHeading>
                <p className="margin-y-0 font-body-md line-height-sans-4">
                  {clearanceStarts
                    ? formatDate(clearanceStarts, 'MM/dd/yyyy')
                    : t('na')}
                </p>
              </div>
              <div className="width-card-lg">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {t('clearanceEndDate')}
                </ProcessListHeading>
                <p className="margin-y-0 font-body-md line-height-sans-4">
                  {clearanceEnds
                    ? formatDate(clearanceEnds, 'MM/dd/yyyy')
                    : t('na')}
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
              {announced ? formatDate(announced, 'MM/dd/yyyy') : t('na')}
            </p>
          </ProcessListItem>

          <ProcessListItem className="read-only-model-plan__timeline__list-item">
            <ProcessListHeading
              type="p"
              className="font-body-sm line-height-sans-4"
            >
              {t('applicationPeriod')}
            </ProcessListHeading>
            <div className="display-flex">
              <div className="width-card-lg">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {t('applicationStartDate')}
                </ProcessListHeading>
                <p className="margin-y-0 font-body-md line-height-sans-4">
                  {applicationsStart
                    ? formatDate(applicationsStart, 'MM/dd/yyyy')
                    : t('na')}
                </p>
              </div>
              <div className="width-card-lg">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {t('applicationEndDate')}
                </ProcessListHeading>
                <p className="margin-y-0 font-body-md line-height-sans-4">
                  {applicationsEnd
                    ? formatDate(applicationsEnd, 'MM/dd/yyyy')
                    : t('na')}
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
            <div className="display-flex">
              <div className="width-card-lg">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {t('performanceStartDate')}
                </ProcessListHeading>
                <p className="margin-y-0 font-body-md line-height-sans-4">
                  {performancePeriodStarts
                    ? formatDate(performancePeriodStarts, 'MM/dd/yyyy')
                    : t('na')}
                </p>
              </div>
              <div className="width-card-lg">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {t('performanceEndDate')}
                </ProcessListHeading>
                <p className="margin-y-0 font-body-md line-height-sans-4">
                  {performancePeriodEnds
                    ? formatDate(performancePeriodEnds, 'MM/dd/yyyy')
                    : t('na')}
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
              {wrapUpEnds ? formatDate(wrapUpEnds, 'MM/dd/yyyy') : t('na')}
            </p>
          </ProcessListItem>
        </ProcessList>
      </SectionWrapper>

      <ReadOnlySection
        heading={t('tightTimeline')}
        copy={phasedIn ? h('yes') : h('no')}
      />
      <ReadOnlySection heading={t('notes')} copy={phasedInNote} />
    </div>
  );
};

export default ReadOnlyModelBasics;

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
  translateBoolean,
  translateCmmiGroups,
  translateCmsCenter,
  translateModelCategory,
  translateModelType
} from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
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

  if ((!loading && error) || (!loading && !data) || data === undefined) {
    return <NotFoundPartial />;
  }

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
    status
  } = data.modelPlan.basics;

  const dateOrNoAnswer = (value: string | null) => {
    if (value) {
      return formatDate(value, 'MM/dd/yyyy');
    }
    return <em className="text-base">{t('na')}</em>;
  };

  return (
    <div
      className="read-only-model-plan--model-basics"
      data-testid="read-only-model-plan--model-basics"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        <TaskListStatusTag status={status} />
      </div>

      {/* <ReadOnlySection heading="Previous Name" list listItems={loremIpsum} /> */}

      <ReadOnlySection
        heading={t('modelCategory')}
        copy={modelCategory && translateModelCategory(modelCategory)}
      />

      <div className="desktop:display-flex flex-justify">
        <div className="desktop:width-card-lg">
          <ReadOnlySection
            heading={t('cmsComponent')}
            list
            listItems={cmsCenters.map(translateCmsCenter)}
            listOtherItem={cmsOther}
          />
        </div>
        <div className="desktop:width-card-lg">
          <ReadOnlySection
            heading={t('cmmiGroup')}
            list
            listItems={cmmiGroups.map(translateCmmiGroups)}
          />
        </div>
      </div>

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
      </SectionWrapper>

      <ReadOnlySection
        heading={t('tightTimeline')}
        copy={phasedIn !== null ? translateBoolean(phasedIn) : null}
        notes={phasedInNote}
      />
    </div>
  );
};

export default ReadOnlyModelBasics;

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
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

import './index.scss';

export type ReadOnlyProps = {
  modelID: string;
  clearance?: boolean;
};

const ReadOnlyModelBasics = ({ modelID, clearance }: ReadOnlyProps) => {
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: planBasicsT } = useTranslation('planBasics');
  const { t: planBasicsMiscT } = useTranslation('planBasicsMisc');
  const { t: generalT } = useTranslation('draftModelPlan');
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

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
    return <em className="text-base">{planBasicsMiscT('na')}</em>;
  };

  return (
    <div
      className="read-only-model-plan--model-basics"
      data-testid="read-only-model-plan--model-basics"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance
            ? planBasicsMiscT('clearanceHeading')
            : planBasicsMiscT('heading')}
        </h2>

        {status && <TaskListStatusTag status={status} />}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      <ReadOnlySection
        heading={modelPlanT('previousName.question')}
        list
        listItems={filteredNameHistory}
      />

      <ReadOnlySection
        heading={planBasicsT('modelCategory.question')}
        copy={planBasicsT(`modelCategory.options.${modelCategory}`, '')}
      />

      <div className="desktop:display-flex flex-justify">
        <div className="desktop:width-card-lg">
          <ReadOnlySection
            heading={planBasicsT('cmsCenters.question')}
            list
            listItems={cmsCenters?.map((cmsCenter): string =>
              planBasicsT(`cmsCenters.options.${cmsCenter}`)
            )}
            listOtherItem={cmsOther}
          />
        </div>
        <div className="desktop:width-card-lg">
          <ReadOnlySection
            heading={planBasicsT('cmmiGroups.question')}
            list
            listItems={cmmiGroups?.map((cmmiGroup): string =>
              planBasicsT(`cmmiGroups.options.${cmmiGroup}`)
            )}
          />
        </div>
      </div>

      <ReadOnlySection
        heading={planBasicsT('modelType.question')}
        copy={planBasicsT(`modelType.options.${modelType}`, '')}
      />

      <ReadOnlySection
        heading={planBasicsT('problem.question')}
        copy={problem}
      />

      <ReadOnlySection heading={planBasicsT('goal.question')} copy={goal} />

      <ReadOnlySection
        heading={planBasicsT('testInterventions.question')}
        copy={testInterventions}
      />

      <ReadOnlySection heading={generalT('note')} copy={note} />

      <SectionWrapper className="read-only-model-plan__timeline--wrapper border-y-1px border-base-light margin-top-6 margin-bottom-4 padding-top-4 padding-bottom-2">
        <h3 className="margin-top-0 margin-bottom-4">
          {planBasicsMiscT('highLevelTimeline')}
        </h3>

        <ProcessList className="read-only-model-plan__timeline">
          <ProcessListItem className="read-only-model-plan__timeline__list-item">
            <ProcessListHeading
              type="p"
              className="font-body-sm line-height-sans-4"
            >
              {planBasicsT('completeICIP.question')}
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
              {planBasicsMiscT('clearance')}
            </ProcessListHeading>

            <div className="mobile-lg:display-flex">
              <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {planBasicsT('clearanceStarts.question')}
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
                  {planBasicsT('clearanceEnds.question')}
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
              {planBasicsT('announced.question')}
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
              {planBasicsMiscT('applicationPeriod')}
            </ProcessListHeading>

            <div className="mobile-lg:display-flex">
              <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {planBasicsT('applicationsStart.question')}
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
                  {planBasicsT('applicationsEnd.question')}
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
              {planBasicsMiscT('demonstrationPerformance')}
            </ProcessListHeading>
            <div className="mobile-lg:display-flex">
              <div className="width-card-lg margin-bottom-2 mobile-lg:margin-bottom-0">
                <ProcessListHeading
                  type="p"
                  className="font-body-sm line-height-sans-4"
                >
                  {planBasicsT('performancePeriodStarts.question')}
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
                  {planBasicsT('performancePeriodEnds.question')}
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
              {planBasicsT('wrapUpEnds.question')}
            </ProcessListHeading>

            <p className="margin-y-0 font-body-md line-height-sans-4">
              {dateOrNoAnswer(wrapUpEnds)}
            </p>
          </ProcessListItem>
        </ProcessList>

        <ReadOnlySection heading={generalT('note')} copy={highLevelNote} />
      </SectionWrapper>

      <ReadOnlySection
        heading={planBasicsT('phasedIn.question')}
        copy={planBasicsT(`phasedIn.options.${phasedIn}`, '')} // Default to empty string if bool is null
        notes={phasedInNote}
      />
    </div>
  );
};

export default ReadOnlyModelBasics;

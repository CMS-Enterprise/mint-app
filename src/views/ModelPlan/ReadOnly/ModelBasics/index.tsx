import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllBasics from 'queries/ReadOnly/GetAllBasics';
import { GetAllBasics as GetAllBasicsTypes } from 'queries/ReadOnly/types/GetAllBasics';
import {
  translateCmmiGroups,
  translateCmsCenter,
  translateModelCategory,
  translateModelType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyModelBasics = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('basics');

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
    highLevelNote,
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
        copy={modelCategory ? translateModelCategory(modelCategory) : t('na')}
      />

      {/* <ReadOnlySection
        heading={t('cmsComponent')}
        list
        listItems={cmsCenters.map(translateCmsCenter)}
      />

      <ReadOnlySection
        heading={t('cmmiGroup')}
        list
        listItems={cmmiGroups.map(translateCmmiGroups)}
      />

      <ReadOnlySection
        heading={t('modelType')}
        copy={translateModelType(modelType)}
      /> */}

      <div className="romp__model-category">model Cateogry</div>

      <div className="romp__cms-component-cmmi-group">
        <div className="romp__cms-component">CMMI</div>
        <div className="romp__cmmi-group">CMMI Group</div>
      </div>

      <div className="romp__model-type">yes</div>
      <div className="romp__problem">yes</div>
      <div className="romp__goal">yes</div>
      <div className="romp__test-interventions">yes</div>
      <div className="romp__notes">yes</div>

      <div className="romp__tight-timeline">Yes</div>
      <div className="romp__tight-timeline-notes">yes</div>
    </div>
  );
};

export default ReadOnlyModelBasics;

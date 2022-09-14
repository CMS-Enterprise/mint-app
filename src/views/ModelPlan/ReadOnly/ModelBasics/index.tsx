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
        copy={modelCategory && translateModelCategory(modelCategory)}
      />

      <ReadOnlySection
        heading={t('cmsComponent')}
        list
        listItems={cmsCenters?.map(translateCmsCenter)}
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
      <ReadOnlySection
        heading={t('tightTimeline')}
        copy={phasedIn ? h('yes') : h('no')}
      />
      <ReadOnlySection heading={t('notes')} copy={phasedInNote} />
    </div>
  );
};

export default ReadOnlyModelBasics;

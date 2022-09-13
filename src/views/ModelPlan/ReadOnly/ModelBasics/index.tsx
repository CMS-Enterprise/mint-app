import React from 'react';
import { useTranslation } from 'react-i18next';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyModelBasics = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('basics');

  const loremIpsum = ['Lorem1', 'Lorem2'];

  return (
    <div className="read-only-model-plan--model-basics">
      <div className="display-flex flex-justify">
        <h2 className="margin-top-0 margin-bottom-4">Model Basics</h2>
        <span className="model-plan-task-list__task-tag line-height-5 text-bold">
          In Progress
        </span>
      </div>

      <ReadOnlySection heading="Previous Name" list listItems={loremIpsum} />

      <ReadOnlySection
        heading="Model Category"
        copy="Lorem ipsum dolor sit amet."
      />
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

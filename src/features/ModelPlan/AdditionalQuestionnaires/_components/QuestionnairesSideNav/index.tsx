import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';

const QuestionnairesSideNav = () => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  return (
    <div
      className="border-top-05 border-primary-lighter padding-top-2 margin-top-2"
      data-testid="sidenav"
    >
      <div className="margin-top-4 margin-bottom-6">
        <h4 className="margin-bottom-1">
          {additionalQuestionnairesT('sideNav.relatedContent')}
        </h4>
        <div className="margin-bottom-1">
          <UswdsReactLink
            to="/help-and-knowledge/high-level-project-plan"
            target="_blank"
            className="line-height-body-5"
          >
            {additionalQuestionnairesT('sideNav.highLevelProject')}
          </UswdsReactLink>
        </div>

        <div>
          <UswdsReactLink
            to="/help-and-knowledge/about-mto"
            target="_blank"
            className="line-height-body-5"
          >
            {additionalQuestionnairesT('sideNav.aboutMto')}
          </UswdsReactLink>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairesSideNav;

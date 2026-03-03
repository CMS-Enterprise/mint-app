import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { tArray } from 'utils/translation';

const QuestionnairesSideNav = () => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );
  const contentArticlesList = tArray<{ copy: string; href: string }>(
    'additionalQuestionnaires:sideNav.articles'
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
        {contentArticlesList.map((article: { copy: string; href: string }) => (
          <div className="margin-bottom-1" key={article.copy}>
            <UswdsReactLink
              to={article.href}
              target="_blank"
              className="line-height-body-5"
            >
              {article.copy}
            </UswdsReactLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionnairesSideNav;

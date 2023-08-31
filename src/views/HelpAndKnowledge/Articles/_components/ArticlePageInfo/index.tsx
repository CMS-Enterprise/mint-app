import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';

import helpAndKnowledgeArticles from '../..';

type ArticlePageInfoProps = {
  className?: string;
};

const ArticlePageInfo = ({ className }: ArticlePageInfoProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div className="display-flex">
      <p className="text-base margin-top-0 margin-right-4">
        {t('pageInfo', {
          pageStart: '3',
          totalPages: helpAndKnowledgeArticles.length
        })}
      </p>

      {/* TODO: add link for all articles */}
      {/* <UswdsReactLink to="/help-and-knowledge" className="margin-right-4">
        {t('browseAll')}
      </UswdsReactLink> */}

      <div className="border-right margin-bottom-2 text-base-lighter margin-right-4" />

      <UswdsReactLink
        to="/help-and-knowledge/getting-started"
        className="margin-right-4"
      >
        {t('viewGettingStarted')}
      </UswdsReactLink>

      {/* TODO: reimplement the below link when IT Implentation is available */}
      {/* <UswdsReactLink
        to="/help-and-knowledge/getting-started"
        className="margin-right-4"
      >
        {t('viewITImplementation')}
      </UswdsReactLink> */}
    </div>
  );
};

export default ArticlePageInfo;

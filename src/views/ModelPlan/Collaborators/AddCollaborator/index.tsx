import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');

  return (
    <MainContent className="margin-bottom-5">
      <div className="grid-container">
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {t('addATeamMember')}
          </PageHeading>
          <div className="margin-bottom-6 line-height-body-6">
            {t('searchTeamInfo')}
          </div>
          <DescriptionTerm term={t('teamMemberName')} />
          <DescriptionDefinition
            className="line-height-body-3 text-base-dark"
            definition={t('teamNameInfo')}
          />
          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to="/models/steps-overview"
          >
            {t('addTeamMemberButton')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;

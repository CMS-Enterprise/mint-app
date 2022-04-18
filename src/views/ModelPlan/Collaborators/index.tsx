import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');

  return (
    <MainContent className="margin-bottom-5">
      <div className="grid-container">
        <div className="tablet:grid-col-12">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('headingTeamMembers')}
          </PageHeading>
          <div className="font-body-lg margin-bottom-6">
            {t('teamMemberInfo')}
          </div>
          <h4 className="margin-bottom-1">{t('teamMembers')}</h4>
          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to={`/models/new-plan/${modelId}/add-collaborator`}
          >
            {t('addTeamMemberButton')}
          </UswdsReactLink>
          <div className="margin-top-5 display-block">
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to="/models/new-plan"
            >
              {h('back')}
            </UswdsReactLink>
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to={`/models/${modelId}/task-list`}
            >
              {t('continueWithoutAdding')}
            </UswdsReactLink>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;

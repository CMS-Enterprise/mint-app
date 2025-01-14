import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { useGetMtoCommonSolutionsQuery } from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';

const SolutionLibrary = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { data, loading, error } = useGetMtoCommonSolutionsQuery({
    variables: { id: modelID }
  });

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
        customItem={t('solutionLibrary.heading')}
      />
      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {t('solutionLibrary.heading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {t('solutionLibrary.description')}
      </p>

      <div className="margin-bottom-6">
        <UswdsReactLink
          to={`/models/${modelID}/collaboration-area/model-to-operations/matrix`}
          data-testid="return-to-mto"
        >
          <span>
            <Icon.ArrowBack className="top-3px margin-right-1" />
            {t('returnToMTO')}
          </span>
        </UswdsReactLink>
      </div>

      {loading ? (
        <PageLoading />
      ) : (
        // <MilstoneCardGroup milestones={milestones} />
        <div>TODO: Implement SolutionCardGroup</div>
      )}
    </GridContainer>
  );
};

export default SolutionLibrary;

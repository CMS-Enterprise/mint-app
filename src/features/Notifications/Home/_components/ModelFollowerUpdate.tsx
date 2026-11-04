import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import {
  ModelCategory,
  ModelFollowerUpdateActivityMeta,
  TeamRole
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateLocal } from 'utils/date';

type ModelFollowerUpdateProps = Pick<
  ModelFollowerUpdateActivityMeta,
  'modelPlanID' | 'content' | 'modelPlan'
>;

const ModelFollowerUpdate = ({
  modelPlanID,
  content,
  modelPlan
}: ModelFollowerUpdateProps) => {
  const { t } = useTranslation('notifications');
  const { status: statusConfig } = usePlanTranslation('modelPlan');
  const { modelCategory } = usePlanTranslation('basics');

  const { modelName, abbreviation, status, basics, collaborators } = modelPlan;

  const categories = [
    basics.modelCategory,
    ...(basics.additionalModelCategories ?? [])
  ]
    .filter((category): category is ModelCategory => !!category)
    .map(category => modelCategory.options[category])
    .join(', ');

  const modelLeads = collaborators
    .filter(collaborator =>
      collaborator.teamRoles.includes(TeamRole.MODEL_LEAD)
    )
    .map(collaborator => collaborator.userAccount.commonName)
    .join(', ');

  const lastUpdated = modelPlan.modifiedDts ?? modelPlan.createdDts;

  return (
    <Grid
      desktop={{ col: 12 }}
      className="border-1 border-base-lightest padding-x-3 padding-y-5 line-height-body-5"
      data-testid="notification--model-follower-update"
    >
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-3">
        {t('index.modelFollowerUpdate.heading', {
          abbreviation: abbreviation || modelName
        })}
      </PageHeading>

      <div className="border-1px border-base-lighter border-red radius-md padding-3 margin-bottom-3">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {modelName}
          {abbreviation && (
            <span className="text-normal font-body-md"> ({abbreviation})</span>
          )}
        </PageHeading>

        <p className="text-bold margin-bottom-0">
          {t('index.modelFollowerUpdate.category')}
        </p>
        <p className="margin-top-05">
          {categories || t('index.modelFollowerUpdate.toBeDetermined')}
        </p>

        <p className="text-bold margin-bottom-0">
          {t('index.modelFollowerUpdate.status')}
        </p>
        <p className="margin-top-05">{statusConfig.options[status]}</p>

        <p className="text-bold margin-bottom-0">
          {t('index.modelFollowerUpdate.lastUpdated')}
        </p>
        <p className="margin-top-05">
          {formatDateLocal(lastUpdated, 'MM/dd/yyyy')}
        </p>

        <p className="text-bold margin-bottom-0">
          {t('index.modelFollowerUpdate.modelLeads')}
        </p>
        <p className="margin-top-05">
          {modelLeads || t('index.modelFollowerUpdate.toBeDetermined')}
        </p>

        <UswdsReactLink
          to={`/models/${modelPlanID}/read-view/model-basics`}
          className="deep-underline text-bold"
        >
          {t('index.modelFollowerUpdate.viewDetails')}
        </UswdsReactLink>
      </div>

      <p className="text-bold margin-bottom-2">
        {t('index.modelFollowerUpdate.newMessage')}
      </p>

      {/* content is sanitized server-side before it is stored (sanitization.SanitizeHTML) */}
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: content }} />

      <hr className="margin-y-3 border-base-lighter" />

      <p>
        <Trans
          i18nKey="notifications:index.modelFollowerUpdate.footer"
          components={{
            link1: (
              <UswdsReactLink
                className="deep-underline"
                to="/notifications/settings"
              />
            )
          }}
        />
      </p>
    </Grid>
  );
};

export default ModelFollowerUpdate;

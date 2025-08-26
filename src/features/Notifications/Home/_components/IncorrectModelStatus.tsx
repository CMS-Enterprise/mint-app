import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import { IncorrectModelStatusActivityMeta } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

const IncorrectModelStatus = ({
  currentStatus,
  modelPlan,
  modelPlanID,
  phaseSuggestion
}: IncorrectModelStatusActivityMeta) => {
  const { t: notificationsT } = useTranslation('notifications');

  return (
    <Grid
      desktop={{ col: 12 }}
      className="border-1 border-base-lightest padding-x-3 padding-y-5"
      data-testid="incorrect-model-status"
    >
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-2">
        {notificationsT('index.incorrectModelStatus.heading', {
          modelName: modelPlan?.modelName
        })}
      </PageHeading>
      <p className="margin-top-0 margin-bottom-3">
        {notificationsT('index.incorrectModelStatus.subheading')}
      </p>

      <div>
        <p className="margin-bottom-1">
          <Trans
            i18nKey="notifications:index:incorrectModelStatus.currentStatus"
            components={{ bold: <strong /> }}
            values={{ currentStatus }}
          />
        </p>
        <p className="margin-top-1">
          <Trans
            i18nKey="notifications:index:incorrectModelStatus.newStatus"
            components={{ bold: <strong /> }}
            values={{ newStatus: phaseSuggestion?.suggestedStatuses[0] }}
          />
        </p>
      </div>

      <UswdsReactLink
        to={`/models/${modelPlanID}/collaboration-area/status?model-status=${phaseSuggestion?.suggestedStatuses[0]}`}
        className="display-block deep-underline margin-y-4"
      >
        {notificationsT('index.incorrectModelStatus.cta')}
      </UswdsReactLink>

      <p>
        <Trans
          i18nKey="notifications:index:incorrectModelStatus.adjustTimeline"
          components={{
            link1: (
              <UswdsReactLink
                className="deep-underline"
                to={`/models/${modelPlanID}/collaboration-area/model-timeline`}
              />
            )
          }}
        />
      </p>
    </Grid>
  );
};

export default IncorrectModelStatus;

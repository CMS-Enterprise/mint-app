import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';

const BeneficiariesPageOne = () => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  // Update to GetModePlanandBeneficiaries
  // const { data } = useQuery<GetModelPlanProvidersAndParticipantsType>(
  //   GetModelPlanParticipantsAndProviders,
  //   {
  //     variables: {
  //       id: modelID
  //     }
  //   }
  // );

  // const {
  //   id,
  //   participants,
  //   medicareProviderType,
  //   statesEngagement,
  //   participantsOther,
  //   participantsNote,
  //   participantsCurrentlyInModels,
  //   participantsCurrentlyInModelsNote,
  //   modelApplicationLevel
  // } =
  //   data?.modelPlan?.participantsAndProviders ||
  //   ({} as ModelPlanParticipantsAndProvidersFormType);

  // const modelName = data?.modelPlan?.modelName || '';
  const modelName = 'testing';

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />
    </>
  );
};

export default BeneficiariesPageOne;

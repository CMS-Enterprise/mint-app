import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { MutationFunction, useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconArrowForward
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import GetClearanceStatuses from 'queries/PrepareForClearance/GetClearanceStatuses';
import {
  GetClearanceStatuses as GetClearanceStatusesType,
  GetClearanceStatusesVariables
} from 'queries/PrepareForClearance/types/GetClearanceStatuses';
import { UpdateClearanceBasics as UpdateClearanceBasicsType } from 'queries/PrepareForClearance/types/UpdateClearanceBasics';
import { UpdateClearanceBeneficiaries as UpdateClearanceBeneficiariesType } from 'queries/PrepareForClearance/types/UpdateClearanceBeneficiaries';
import { UpdateClearanceCharacteristics as UpdateClearanceCharacteristicsType } from 'queries/PrepareForClearance/types/UpdateClearanceCharacteristics';
import { UpdateClearanceOpsEvalAndLearning as UpdateClearanceOpsEvalAndLearningType } from 'queries/PrepareForClearance/types/UpdateClearanceOpsEvalAndLearning';
import { UpdateClearanceParticipantsAndProviders as UpdateClearanceParticipantsAndProvidersType } from 'queries/PrepareForClearance/types/UpdateClearanceParticipantsAndProviders';
import { UpdateClearancePayments as UpdateClearancePaymentsType } from 'queries/PrepareForClearance/types/UpdateClearancePayments';
import UpdateClearanceBasics from 'queries/PrepareForClearance/UpdateClearanceBasics';
import UpdateClearanceBeneficiaries from 'queries/PrepareForClearance/UpdateClearanceBeneficiaries';
import UpdateClearanceCharacteristics from 'queries/PrepareForClearance/UpdateClearanceCharacteristics';
import UpdateClearanceOpsEvalAndLearning from 'queries/PrepareForClearance/UpdateClearanceOpsEvalAndLearning';
import UpdateClearanceParticipantsAndProviders from 'queries/PrepareForClearance/UpdateClearanceParticipantsAndProviders';
import UpdateClearancePayments from 'queries/PrepareForClearance/UpdateClearancePayments';
import { TaskStatus } from 'types/graphql-global-types';
import ReadOnlyBeneficiaries from 'views/ModelPlan/ReadOnly/Beneficiaries';
import ReadOnlyGeneralCharacteristics from 'views/ModelPlan/ReadOnly/GeneralCharacteristics';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';
import ReadOnlyParticipantsAndProviders from 'views/ModelPlan/ReadOnly/ParticipantsAndProviders';
import ReadOnlyPayments from 'views/ModelPlan/ReadOnly/Payments';
import {
  findLockedSection,
  LockStatus,
  taskListSectionMap
} from 'views/SubscriptionHandler';
import { SubscriptionContext } from 'views/SubscriptionWrapper';

import { GetClearanceStatusesModelPlanFormType } from '../Checklist';

type ClearanceReviewProps = {
  modelID: string;
};

type ClearanceParamProps = {
  section: string;
  sectionID: string;
};

type mutationObjectType = {
  [key: string]: MutationFunction;
};

type routeMapType = {
  [key: string]: string;
};

const routeMap: routeMapType = {
  basics: 'basics',
  characteristics: 'generalCharacteristics',
  'participants-and-providers': 'participantsAndProviders',
  beneficiaries: 'beneficiaries',
  'ops-eval-and-learning': 'opsEvalAndLearning',
  payment: 'payments'
};

const renderReviewTaskSection = (
  modelID: string,
  section: string
): JSX.Element => {
  switch (section) {
    case 'basics':
      return <ReadOnlyModelBasics modelID={modelID} clearance />;
    case 'characteristics':
      return <ReadOnlyGeneralCharacteristics modelID={modelID} clearance />;
    case 'participants-and-providers':
      return <ReadOnlyParticipantsAndProviders modelID={modelID} clearance />;
    case 'beneficiaries':
      return <ReadOnlyBeneficiaries modelID={modelID} clearance />;
    case 'ops-eval-and-learning':
      return <ReadOnlyModelBasics modelID={modelID} clearance />;
    case 'payment':
      return <ReadOnlyPayments modelID={modelID} clearance />;
    default:
      return <></>;
  }
};

export const ClearanceReview = ({ modelID }: ClearanceReviewProps) => {
  const [errors, setErrors] = useState<string>();
  const [isModalOpen, setModalOpen] = useState(false);
  const { section, sectionID } = useParams<ClearanceParamProps>();

  const { taskListSectionLocks } = useContext(SubscriptionContext);

  const taskListLocked: boolean =
    findLockedSection(taskListSectionLocks, taskListSectionMap[section]) ===
    LockStatus.LOCKED;

  const { t } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');
  const { t: i } = useTranslation('itTools');
  const history = useHistory();

  const taskListSections: any = t('modelPlanTaskList:numberedList', {
    returnObjects: true
  });

  const { data, loading, error } = useQuery<
    GetClearanceStatusesType,
    GetClearanceStatusesVariables
  >(GetClearanceStatuses, {
    variables: {
      id: modelID
    }
  });

  const modelPlanSection = routeMap[section];

  const readyForClearance: boolean =
    data?.modelPlan?.[
      modelPlanSection as keyof GetClearanceStatusesModelPlanFormType
    ].status === TaskStatus.READY_FOR_CLEARANCE;

  const [updateBasics] = useMutation<UpdateClearanceBasicsType>(
    UpdateClearanceBasics
  );

  const [
    updateCharacteristics
  ] = useMutation<UpdateClearanceCharacteristicsType>(
    UpdateClearanceCharacteristics
  );

  const [
    updateParticipantsAndProviders
  ] = useMutation<UpdateClearanceParticipantsAndProvidersType>(
    UpdateClearanceParticipantsAndProviders
  );

  const [updateBeneficiaries] = useMutation<UpdateClearanceBeneficiariesType>(
    UpdateClearanceBeneficiaries
  );

  const [
    updateOpsEvalAndLearning
  ] = useMutation<UpdateClearanceOpsEvalAndLearningType>(
    UpdateClearanceOpsEvalAndLearning
  );

  const [updatePayments] = useMutation<UpdateClearancePaymentsType>(
    UpdateClearancePayments
  );

  const clearanceMutations: mutationObjectType = {
    basics: updateBasics,
    characteristics: updateCharacteristics,
    'participants-and-providers': updateParticipantsAndProviders,
    beneficiaries: updateBeneficiaries,
    'ops-eval-and-learning': updateOpsEvalAndLearning,
    payment: updatePayments
  };

  const handleFormSubmit = (taskSection: string) => {
    clearanceMutations[taskSection]({
      variables: {
        id: sectionID,
        changes: { status: TaskStatus.READY_FOR_CLEARANCE }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelID}/task-list/prepare-for-clearance`);
        }
      })
      .catch(() => {
        setErrors(p('mutationError'));
      });
  };

  const renderModal = (locked: boolean) => {
    return (
      <Modal
        className="radius-lg"
        isOpen={isModalOpen}
        scroll
        closeModal={() => setModalOpen(false)}
      >
        <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-0">
          {!locked ? p('modal.heading') : i('modal.heading')}
        </PageHeading>
        <p className="margin-bottom-3">
          {!locked ? p('modal.subheading') : i('modal.subHeading')}
        </p>
        <UswdsReactLink
          data-testid="return-to-task-list"
          className="margin-right-2 usa-button text-white text-no-underline"
          to={
            !locked
              ? `/models/${modelID}/task-list/${section}`
              : `/models/${modelID}/task-list`
          }
        >
          {!locked ? p('modal.update') : i('modal.return')}
        </UswdsReactLink>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {p('modal.goBack')}
        </Button>
      </Modal>
    );
  };

  return (
    <MainContent data-testid="clearance-review">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <BreadcrumbBar variant="wrap" className="margin-bottom-4">
            <Breadcrumb>
              <BreadcrumbLink asCustom={UswdsReactLink} to="/">
                <span>{t('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={UswdsReactLink}
                to={`/models/${modelID}/task-list/`}
              >
                <span>{t('tasklistBreadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={UswdsReactLink}
                to={`/models/${modelID}/task-list/prepare-for-clearance`}
              >
                <span>{p('breadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>
              {p(`reviewBreadcrumbs.${routeMap[section]}`)}
            </Breadcrumb>
          </BreadcrumbBar>

          {errors && (
            <ErrorAlert
              testId="formik-validation-errors"
              classNames="margin-y-3"
              heading={p('errorHeading')}
            >
              <ErrorAlertMessage errorKey="error" message={errors} />
            </ErrorAlert>
          )}

          {renderModal(taskListLocked)}

          {renderReviewTaskSection(modelID, section)}
          <div className="margin-top-6 margin-bottom-3">
            <Button
              type="button"
              className="usa-button usa-button--outline margin-bottom-1"
              onClick={() => {
                history.push(
                  `/models/${modelID}/task-list/prepare-for-clearance`
                );
              }}
            >
              {t('back')}
            </Button>
            <Button type="submit" onClick={() => handleFormSubmit(section)}>
              {p('markAsReady')}
            </Button>
          </div>

          {!loading && !error && (
            <Button
              type="button"
              className="usa-button usa-button--unstyled display-flex"
              onClick={() => {
                if (taskListLocked || readyForClearance) {
                  setModalOpen(true);
                } else {
                  history.push(`/models/${modelID}/task-list/${section}`);
                }
              }}
            >
              {p('changes', {
                section: taskListSections[
                  routeMap[section]
                ]?.heading?.toLowerCase()
              })}
              <IconArrowForward className="margin-left-1" aria-hidden />
            </Button>
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ClearanceReview;

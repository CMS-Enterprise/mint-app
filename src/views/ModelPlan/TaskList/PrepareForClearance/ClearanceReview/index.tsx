/*
Clearance review component used to conditionally render readonly components
Contains submissions to update status for each section on marked 'Ready for clearance'
Link to each task list section and checks if task list sections are locked
*/

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import {
  PrepareForClearanceStatus,
  TaskStatus,
  TaskStatusInput,
  UpdateClearanceBasicsMutationFn,
  UpdateClearanceBeneficiariesMutationFn,
  UpdateClearanceCharacteristicsMutationFn,
  UpdateClearanceOpsEvalAndLearningMutationFn,
  UpdateClearanceParticipantsAndProvidersMutationFn,
  UpdateClearancePaymentsMutationFn,
  useGetClearanceStatusesQuery,
  useUpdateClearanceBasicsMutation,
  useUpdateClearanceBeneficiariesMutation,
  useUpdateClearanceCharacteristicsMutation,
  useUpdateClearanceOpsEvalAndLearningMutation,
  useUpdateClearanceParticipantsAndProvidersMutation,
  useUpdateClearancePaymentsMutation
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import ReadOnlyBeneficiaries from 'views/ModelPlan/ReadOnly/Beneficiaries';
import ReadOnlyGeneralCharacteristics from 'views/ModelPlan/ReadOnly/GeneralCharacteristics';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';
import ReadOnlyOpsEvalAndLearning from 'views/ModelPlan/ReadOnly/OpsEvalAndLearning';
import ReadOnlyParticipantsAndProviders from 'views/ModelPlan/ReadOnly/ParticipantsAndProviders';
import ReadOnlyPayments from 'views/ModelPlan/ReadOnly/Payments';
import { NotFoundPartial } from 'views/NotFound';
import {
  findLockedSection,
  LockStatus,
  taskListSectionMap
} from 'views/SubscriptionHandler';
import { SubscriptionContext } from 'views/SubscriptionWrapper';

import { ClearanceStatusesModelPlanFormType } from '../Checklist';

type ClearanceReviewProps = {
  modelID: string;
};

type MutationObjectType = {
  basics: UpdateClearanceBasicsMutationFn;
  characteristics: UpdateClearanceCharacteristicsMutationFn;
  'participants-and-providers': UpdateClearanceParticipantsAndProvidersMutationFn;
  beneficiaries: UpdateClearanceBeneficiariesMutationFn;
  'ops-eval-and-learning': UpdateClearanceOpsEvalAndLearningMutationFn;
  payment: UpdateClearancePaymentsMutationFn;
};

type ClearanceParamProps = {
  section: keyof MutationObjectType;
  sectionID: string;
};

type RouteMapType = {
  [key: string]: string;
};

// Mappping for url param to gql objects
const routeMap: RouteMapType = {
  basics: 'basics',
  characteristics: 'generalCharacteristics',
  'participants-and-providers': 'participantsAndProviders',
  beneficiaries: 'beneficiaries',
  'ops-eval-and-learning': 'opsEvalAndLearning',
  payment: 'payments'
};

// Switch statement for conditional rendering of readonly components
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
      return <ReadOnlyOpsEvalAndLearning modelID={modelID} clearance />;
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

  const { t } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');
  const { t: i } = useTranslation('opSolutionsMisc');
  const history = useHistory();

  // Subscription locks context for task list
  const { taskListSectionLocks } = useContext(SubscriptionContext);

  // Subscription lock boolean if current section is locked
  const taskListLocked: boolean =
    findLockedSection(taskListSectionLocks, taskListSectionMap[section]) ===
    LockStatus.LOCKED;

  const taskListSections: any = t('modelPlanTaskList:numberedList', {
    returnObjects: true
  });

  const { data, loading, error } = useGetClearanceStatusesQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlanSection = routeMap[section];

  const cannotStart: boolean =
    data?.modelPlan?.prepareForClearance.status ===
    PrepareForClearanceStatus.CANNOT_START;

  const readyForClearance: boolean =
    data?.modelPlan?.[
      modelPlanSection as keyof ClearanceStatusesModelPlanFormType
    ].status === TaskStatus.READY_FOR_CLEARANCE;

  const [updateBasics] = useUpdateClearanceBasicsMutation();

  const [updateCharacteristics] = useUpdateClearanceCharacteristicsMutation();

  const [
    updateParticipantsAndProviders
  ] = useUpdateClearanceParticipantsAndProvidersMutation();

  const [updateBeneficiaries] = useUpdateClearanceBeneficiariesMutation();

  const [
    updateOpsEvalAndLearning
  ] = useUpdateClearanceOpsEvalAndLearningMutation();

  const [updatePayments] = useUpdateClearancePaymentsMutation();

  // Object to dynamically call each task list mutation within handleFormSubmit
  const clearanceMutations: MutationObjectType = {
    basics: updateBasics,
    characteristics: updateCharacteristics,
    'participants-and-providers': updateParticipantsAndProviders,
    beneficiaries: updateBeneficiaries,
    'ops-eval-and-learning': updateOpsEvalAndLearning,
    payment: updatePayments
  };

  const handleFormSubmit = (taskSection: keyof MutationObjectType) => {
    clearanceMutations[taskSection]({
      variables: {
        id: sectionID,
        changes: { status: TaskStatusInput.READY_FOR_CLEARANCE }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance`
          );
        }
      })
      .catch(() => {
        setErrors(p('mutationError'));
      });
  };

  // Modal used to render task list locked info or Ready for Clearance warning
  const renderModal = (locked: boolean) => {
    return (
      <Modal
        className="confirmation-modal"
        isOpen={isModalOpen}
        scroll
        closeModal={() => setModalOpen(false)}
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
          data-testid="clearance-modal-header"
        >
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
              ? `/models/${modelID}/collaboration-area/task-list/${section}`
              : `/models/${modelID}/collaboration-area/task-list`
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

  if (!data && loading) {
    return <PageLoading />;
  }

  if ((!loading && error) || (!loading && !data?.modelPlan) || cannotStart) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="clearance-review">
      <GridContainer className="padding-x-0">
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA,
              BreadcrumbItemOptions.TASK_LIST,
              BreadcrumbItemOptions.PREPARE_FOR_CLEARANCE
            ]}
            customItem={p(`reviewBreadcrumbs.${routeMap[section]}`)}
          />

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
                  `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance`
                );
              }}
            >
              {t('back')}
            </Button>
            <Button
              type="submit"
              data-testid="mark-task-list-for-clearance"
              onClick={() => handleFormSubmit(section)}
            >
              {p('markAsReady')}
            </Button>
          </div>

          {/* Link to respective task list form section */}
          {!loading && !error && (
            <Button
              type="button"
              data-testid="modify-task-list-for-clearance"
              className="usa-button usa-button--unstyled display-flex"
              onClick={() => {
                if (taskListLocked || readyForClearance) {
                  setModalOpen(true);
                } else {
                  history.push(
                    `/models/${modelID}/collaboration-area/task-list/${section}`
                  );
                }
              }}
            >
              {p('changes', {
                section: taskListSections[
                  routeMap[section]
                ]?.heading?.toLowerCase()
              })}
              <Icon.ArrowForward className="margin-left-1" aria-hidden />
            </Button>
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ClearanceReview;

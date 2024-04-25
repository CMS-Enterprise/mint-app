/*
View for selecting/toggled 'needed' bool on possible solutions and custom solutions
Displays relevant operational need question and answers
*/

import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Fieldset, Grid, Icon } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';
import {
  GetOperationalNeedQuery,
  GetOperationalSolutionQuery,
  OperationalNeedKey,
  useGetOperationalNeedQuery,
  useUpdateOperationalSolutionMutation
} from 'gql/gen/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

import Solution from './_components/Solution';

type OperationalNeedType = GetOperationalNeedQuery['operationalNeed'];
type GetOperationalSolutionType = GetOperationalSolutionQuery['operationalSolution'];

// Passing in operationalNeed to Formik instead of array of solutions
// Fomik does not take an array structure
export const initialValues: OperationalNeedType = {
  __typename: 'OperationalNeed',
  id: '',
  modelPlanID: '',
  name: '',
  key: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  nameOther: '',
  needed: false,
  solutions: []
};

const SolutionImplementation = () => {
  const { modelID, operationalNeedID, solutionId } = useParams<{
    modelID: string;
    operationalNeedID: string;
    solutionId?: string | undefined;
  }>();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const fromSolutionDetails = params.get('fromSolutionDetails') === 'true';
  const isCustomNeed = params.get('isCustomNeed') === 'true';
  const updateDetails = params.get('update-details') === 'true';

  const history = useHistory();

  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('draftModelPlan');

  const { showMessageOnNextPage, message } = useMessage();

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const formikRef = useRef<FormikProps<OperationalNeedType>>(null);

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetOperationalNeedQuery({
    variables: {
      id: operationalNeedID,
      includeNotNeeded: false
    }
  });

  const operationalNeed = data?.operationalNeed || initialValues;

  const [updateSolution] = useUpdateOperationalSolutionMutation();

  // Cycles and updates all solutions on a need
  const handleFormSubmit = async (
    formikValues: OperationalNeedType,
    redirect?: 'back' | null,
    dontAdd?: boolean // False if user selects 'Don’t add solutions and return to tracker'
  ) => {
    const { solutions } = formikValues;

    await Promise.all(
      solutions.map(solution => {
        const solutionNeeded = dontAdd ? false : solution.needed || false;

        // Update possibleSolution needed bool and status
        if (solution.key) {
          return updateSolution({
            variables: {
              id: solution.id,
              changes: {
                needed: solutionNeeded,
                mustStartDts: solution.mustStartDts,
                mustFinishDts: solution.mustFinishDts,
                status: solution.status
              }
            }
          });
        }
        // Update custom solution needed bool - status should already be set
        return updateSolution({
          variables: {
            id: solution.id,
            changes: {
              needed: solutionNeeded,
              nameOther: solution.nameOther,
              mustStartDts: solution.mustStartDts,
              mustFinishDts: solution.mustFinishDts,
              status: solution.status
            }
          }
        });
      })
    )
      .then(response => {
        const errors = response?.find(result => result?.errors);

        if (response && !errors) {
          // If successfully submitting solution details
          if (!dontAdd && !redirect) {
            const words = (
              updateStatus: boolean,
              customNeed: boolean | undefined,
              update: boolean | null
            ) => {
              if ((!!updateStatus || update) && !customNeed)
                return t('successStatusUpdated', {
                  operationalNeedName:
                    operationalNeed.nameOther || operationalNeed.name
                });
              if (!updateStatus && !customNeed)
                return t('successSolutionAdded', {
                  operationalNeedName:
                    operationalNeed.nameOther || operationalNeed.name
                });
              return t('successMessage.operationalNeedAndSolution', {
                operationalNeedName:
                  operationalNeed.nameOther || operationalNeed.name
              });
            };

            showMessageOnNextPage(
              <Alert type="success" slim className="margin-y-4">
                <span className="mandatory-fields-alert__text">
                  {words(!!solutionId, isCustomNeed, updateDetails)}
                </span>
              </Alert>
            );

            // If fromSolutionDetails, go to previous page, otherwise, go to tracker
            if (fromSolutionDetails) {
              history.goBack();
            } else {
              history.push(`/models/${modelID}/task-list/it-solutions`);
            }

            // Go back but still save solution details
          } else if (redirect === 'back') {
            history.goBack();
            // Dont save solution details, solutions no needed, and return to tracker
          } else {
            history.push(`/models/${modelID}/task-list/it-solutions`);
          }
        } else if (errors) {
          setMutationError(true);
        }
      })
      .catch(() => {
        setMutationError(true);
      });
  };

  if (error) {
    return <NotFound />;
  }

  const renderCancelCopy = () => {
    if (!!solutionId && fromSolutionDetails) {
      return t('dontUpdateandReturnToSolutionDetails');
    }
    if (solutionId) {
      return t('dontUpdateandReturnToTracker');
    }
    return t('dontAdd');
  };

  const handleCancelClick = (values: OperationalNeedType) => {
    if (!!solutionId && fromSolutionDetails) {
      return history.goBack();
    }
    if (solutionId) {
      return history.push(`/models/${modelID}/task-list/it-solutions`);
    }
    return handleFormSubmit(values, null, true);
  };

  const statusBreadcrumb = (): string => {
    if (updateDetails) return t('updateSolutions');
    if (solutionId) return t('updateStatus');
    return t('selectSolution');
  };

  const statusText = (): string => {
    if (updateDetails) return t('updateDetails');
    if (solutionId) return t('updateStatus');
    return t('selectSolution');
  };

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeed.id}/${operationalNeed.solutions[0]?.id}/solution-details`
    },
    { text: statusBreadcrumb() }
  ];

  const formikNeed = { ...operationalNeed };
  formikNeed.solutions =
    solutionId === undefined
      ? operationalNeed.solutions
      : operationalNeed.solutions.filter(
          solution => solution.id === solutionId
        );

  return (
    <>
      <Breadcrumbs
        items={
          fromSolutionDetails || updateDetails
            ? breadcrumbs
            : breadcrumbs.filter(item => item.text !== t('solutionDetails'))
        }
      />

      {mutationError && (
        <Alert type="error" slim>
          {t('addError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {statusText()}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">
            {solutionId
              ? t('updateStatusInfo')
              : t('addImplementationDetailsInfo')}
          </p>

          <Grid tablet={{ col: 12 }} desktop={{ col: 8 }}>
            {/*
              Operational Solution ID is UNDEFINED if user is displaying ALL solutions to an Operational Need.
              Operational Solution ID is DEFINED if user is displaying an INDIVIDUAL solution to an Operational Need.
            */}
            {solutionId === undefined && (
              <NeedQuestionAndAnswer
                operationalNeedID={operationalNeedID}
                modelID={modelID}
              />
            )}

            <Formik
              initialValues={formikNeed}
              onSubmit={values => {
                handleFormSubmit(values);
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {(formikProps: FormikProps<OperationalNeedType>) => {
                const { errors, setErrors, handleSubmit, values } = formikProps;

                const flatErrors = flattenErrors(errors);

                return (
                  <>
                    {Object.keys(errors).length > 0 && (
                      <ErrorAlert
                        testId="formik-validation-errors"
                        classNames="margin-top-3"
                        heading={h('checkAndFix')}
                      >
                        {Object.keys(flatErrors).map(key => {
                          return (
                            <ErrorAlertMessage
                              key={`Error.${key}`}
                              errorKey={key}
                              message={flatErrors[key]}
                            />
                          );
                        })}
                      </ErrorAlert>
                    )}

                    <Form
                      className="margin-top-6"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        {loading ? (
                          <PageLoading />
                        ) : (
                          <>
                            {formikNeed.solutions.map((solution, index) => {
                              const identifier = (
                                solution.nameOther ||
                                solution.key ||
                                ''
                              ).replaceAll(' ', '-');
                              return (
                                <Solution
                                  key={solution.id}
                                  formikProps={formikProps}
                                  solution={
                                    solution as GetOperationalSolutionType
                                  }
                                  identifier={identifier}
                                  index={index}
                                  length={formikNeed.solutions.length}
                                  flatErrors={flatErrors}
                                  loading={loading}
                                  operationalNeedID={operationalNeedID}
                                  operationalSolutionID={solutionId}
                                  modelID={modelID}
                                />
                              );
                            })}
                          </>
                        )}

                        {message &&
                          Array.isArray(message) &&
                          message.length > 0 && (
                            <Alert type="warning" slim className="margin-top-6">
                              {t('solutionRemoveWarning')}
                              {message.map(solution => (
                                // Adding <p> instead of an unordered list here because <p> exists natively in Truss' Alert
                                // <ul> cannot exist as a descendant of <p>
                                <p
                                  key={solution?.toString()}
                                  className="margin-y-1"
                                >
                                  &bull;{' '}
                                  <span className="margin-left-1">
                                    {solution}
                                  </span>
                                </p>
                              ))}
                            </Alert>
                          )}

                        <div className="margin-top-6 margin-bottom-3">
                          {!solutionId && (
                            <Button
                              type="button"
                              className="usa-button usa-button--outline margin-bottom-1"
                              onClick={() => {
                                handleFormSubmit(values, 'back');
                              }}
                            >
                              {h('back')}
                            </Button>
                          )}

                          <Button
                            type="submit"
                            id="submit-solutions"
                            onClick={() => setErrors({})}
                          >
                            {solutionId
                              ? t('updateSolution')
                              : t('saveSolutions')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                          onClick={() => handleCancelClick(values)}
                        >
                          <Icon.ArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {renderCancelCopy()}
                        </Button>
                      </Fieldset>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </Grid>

        <Grid desktop={{ col: 3 }} className="padding-x-1">
          <ITSolutionsSidebar
            modelID={modelID}
            renderTextFor={solutionId ? 'status' : 'solution'}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SolutionImplementation;

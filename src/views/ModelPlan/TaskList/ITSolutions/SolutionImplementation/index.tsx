/*
View for selecting/toggled 'needed' bool on possible solutions and custom solutions
Displays relevant operational need question and answers
*/

import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Fieldset,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeed_operationalNeed as GetOperationalNeedOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import { UpdateCustomOperationalSolutionVariables } from 'queries/ITSolutions/types/UpdateCustomOperationalSolution';
import { UpdateOperationalNeedSolutionVariables } from 'queries/ITSolutions/types/UpdateOperationalNeedSolution';
import UpdateCustomOperationalSolution from 'queries/ITSolutions/UpdateCustomOperationalSolution';
import UpdateOperationalNeedSolution from 'queries/ITSolutions/UpdateOperationalNeedSolution';
import { OperationalNeedKey } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

import Solution from './_components/Solution';

// Passing in operationalNeed to Formik instead of array of solutions
// Fomik does not take an array structure
export const initialValues: GetOperationalNeedOperationalNeedType = {
  __typename: 'OperationalNeed',
  id: '',
  modelPlanID: '',
  name: '',
  key: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  nameOther: '',
  needed: false,
  solutions: []
};

const SolutionImplementation = ({
  isUpdatingStatus = false
}: {
  isUpdatingStatus?: boolean;
}) => {
  const { modelID, operationalNeedID, solutionId } = useParams<{
    modelID: string;
    operationalNeedID: string;
    solutionId?: string | undefined;
  }>();

  const {
    state: { fromSolutionDetails }
  } = useLocation<{
    fromSolutionDetails: boolean;
  }>();

  const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const { showMessageOnNextPage, message } = useMessage();

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const formikRef = useRef<FormikProps<GetOperationalNeedOperationalNeedType>>(
    null
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<
    GetOperationalNeedType,
    GetOperationalNeedVariables
  >(GetOperationalNeed, {
    variables: {
      id: operationalNeedID,
      includeNotNeeded: false
    }
  });

  const operationalNeed = data?.operationalNeed || initialValues;

  const [updateSolution] = useMutation<UpdateOperationalNeedSolutionVariables>(
    UpdateOperationalNeedSolution
  );

  const [
    updateCustomSolution
  ] = useMutation<UpdateCustomOperationalSolutionVariables>(
    UpdateCustomOperationalSolution
  );

  // Cycles and updates all solutions on a need
  const handleFormSubmit = async (
    formikValues: GetOperationalNeedOperationalNeedType,
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
              operationalNeedID,
              solutionType: solution.key,
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
        return updateCustomSolution({
          variables: {
            operationalNeedID,
            customSolutionType: solution.nameOther,
            changes: {
              needed: solutionNeeded,
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
          if (!dontAdd && !redirect && !isUpdatingStatus) {
            showMessageOnNextPage(
              <Alert type="success" slim className="margin-y-4">
                <span className="mandatory-fields-alert__text">
                  {isUpdatingStatus
                    ? t('successStatusUpdated', {
                        operationalNeedName: operationalNeed.name
                      })
                    : t('successSolutionAdded', {
                        operationalNeedName: operationalNeed.name
                      })}
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
    if (isUpdatingStatus && fromSolutionDetails) {
      return t('dontUpdateandReturnToSolutionDetails');
    }
    if (isUpdatingStatus) {
      return t('dontUpdateandReturnToTracker');
    }
    return t('dontAdd');
  };

  const handleCancelClick = (values: GetOperationalNeedOperationalNeedType) => {
    if (isUpdatingStatus && fromSolutionDetails) {
      return history.goBack();
    }
    if (isUpdatingStatus) {
      return history.push(`/models/${modelID}/task-list/it-solutions`);
    }
    return handleFormSubmit(values, null, true);
  };

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeed.id}/${operationalNeed.solutions[0]?.id}/solution-details`
    },
    { text: isUpdatingStatus ? t('updateStatus') : t('selectSolution') }
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
          fromSolutionDetails
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
            {isUpdatingStatus
              ? t('updateStatus')
              : t('addImplementationDetails')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">
            {isUpdatingStatus
              ? t('updateStatusInfo')
              : t('addImplementationDetailsInfo')}
          </p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
            />
          </Grid>

          <Grid gap>
            <Grid tablet={{ col: 8 }}>
              <Formik
                initialValues={formikNeed}
                onSubmit={values => {
                  handleFormSubmit(values);
                }}
                enableReinitialize
                innerRef={formikRef}
              >
                {(
                  formikProps: FormikProps<GetOperationalNeedOperationalNeedType>
                ) => {
                  const {
                    errors,
                    setErrors,
                    setFieldError,
                    setFieldValue,
                    handleSubmit,
                    values
                  } = formikProps;

                  const flatErrors = flattenErrors(errors);

                  const handleOnBlur = (
                    e: React.ChangeEvent<HTMLInputElement>,
                    field: string
                  ) => {
                    if (e.target.value === '') {
                      setFieldValue(field, null);
                      return;
                    }
                    try {
                      setFieldValue(
                        field,
                        new Date(e.target.value).toISOString()
                      );
                      delete errors[
                        field as keyof GetOperationalNeedOperationalNeedType
                      ];
                    } catch (err) {
                      setFieldError(field, h('validDate'));
                    }
                  };

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
                        data-testid="it-tools-page-seven-form"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset disabled={loading}>
                          {formikNeed.solutions.map((solution, index) => {
                            const identifier = (
                              solution.nameOther ||
                              solution.key ||
                              ''
                            ).replaceAll(' ', '-');
                            return (
                              <Solution
                                key={solution.id}
                                solution={solution}
                                identifier={identifier}
                                index={index}
                                handleOnBlur={handleOnBlur}
                                setFieldValue={setFieldValue}
                                length={formikNeed.solutions.length}
                                values={values}
                                flatErrors={flatErrors}
                                loading={loading}
                              />
                            );
                          })}

                          {message && (
                            <Alert type="warning" slim className="margin-top-6">
                              {t('solutionRemoveWarning', {
                                solutions: message
                              })}
                            </Alert>
                          )}

                          <div className="margin-top-6 margin-bottom-3">
                            {!isUpdatingStatus && (
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
                              {isUpdatingStatus
                                ? t('updateSolution')
                                : t('saveSolutions')}
                            </Button>
                          </div>

                          <Button
                            type="button"
                            className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                            onClick={() => handleCancelClick(values)}
                          >
                            <IconArrowBack
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
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
            <AskAQuestion modelID={modelID} opNeeds />
          </div>
          <div className="margin-top-4">
            <p className="text-bold margin-bottom-0">{t('helpfulLinks')}</p>
            <Button
              type="button"
              onClick={() =>
                window.open('/help-and-knowledge/model-plan-overview', '_blank')
              }
              className="usa-button usa-button--unstyled line-height-body-5"
            >
              <p>{t('availableSolutions')}</p>
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default SolutionImplementation;

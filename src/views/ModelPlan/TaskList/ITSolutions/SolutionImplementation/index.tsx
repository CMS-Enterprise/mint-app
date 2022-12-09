/*
View for selecting/toggled 'needed' bool on possible solutions and custom solutions
Displays relevant operational need question and answers
*/

import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  DatePicker,
  Fieldset,
  Grid,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
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
import {
  OperationalNeedKey,
  OpSolutionStatus
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { translateOpNeedsStatusType } from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ImplementationStatuses from '../_components/ImplementationStatus';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';
import SolutionCard from '../_components/SolutionCard';

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

const SolutionImplementation = () => {
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const { showMessageOnNextPage } = useMessage();

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
          if (!dontAdd && !redirect) {
            showMessageOnNextPage(
              <Alert type="success" slim className="margin-y-4">
                <span className="mandatory-fields-alert__text">
                  {t('successSolutionAdded', {
                    operationalNeedName: operationalNeed.name
                  })}
                </span>
              </Alert>
            );

            history.push(`/models/${modelID}/task-list/it-solutions`);
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

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={UswdsReactLink} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/`}
          >
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/it-solutions`}
          >
            <span>{t('breadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('selectSolution')}</Breadcrumb>
      </BreadcrumbBar>

      {mutationError && (
        <Alert type="error" slim>
          {t('addError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('addImplementationDetails')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">
            {t('addImplementationDetailsInfo')}
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
                initialValues={operationalNeed}
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
                          {operationalNeed.solutions.map((solution, index) => {
                            const identifier = (
                              solution.nameOther ||
                              solution.key ||
                              ''
                            ).replaceAll(' ', '-');

                            return (
                              <div key={solution.id}>
                                <p className="text-bold">{t('solution')}</p>

                                <SolutionCard solution={solution} shadow />

                                {!loading && (
                                  <>
                                    <FieldGroup
                                      scrollElement="mustStartDts"
                                      error={!!flatErrors.mustStartDts}
                                      className="margin-top-1"
                                    >
                                      <Label
                                        htmlFor={`solution-must-start-${identifier}`}
                                        className="text-bold"
                                      >
                                        {t('mustStartBy')}
                                      </Label>

                                      <div className="usa-hint margin-top-1">
                                        {h('datePlaceholder')}
                                      </div>

                                      <FieldErrorMsg>
                                        {flatErrors.mustStartDts}
                                      </FieldErrorMsg>

                                      <div className="width-card-lg position-relative">
                                        <Field
                                          as={DatePicker}
                                          error={+!!flatErrors.mustStartDts}
                                          id={`solution-must-start-${identifier}`}
                                          data-testid={`solution-must-start-${identifier}`}
                                          maxLength={50}
                                          name={`solutions[${index}].mustStartDts`}
                                          defaultValue={solution.mustStartDts}
                                          onBlur={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                          ) => {
                                            handleOnBlur(
                                              e,
                                              `solutions[${index}].mustStartDts`
                                            );
                                          }}
                                        />
                                      </div>
                                    </FieldGroup>

                                    <FieldGroup
                                      scrollElement="mustFinishDts"
                                      error={!!flatErrors.mustFinishDts}
                                    >
                                      <Label
                                        htmlFor={`solution-must-finish-${identifier}`}
                                        className="text-bold"
                                      >
                                        {t('mustFinishBy')}
                                      </Label>

                                      <div className="usa-hint margin-top-1">
                                        {h('datePlaceholder')}
                                      </div>

                                      <FieldErrorMsg>
                                        {flatErrors.mustFinishDts}
                                      </FieldErrorMsg>

                                      <div className="width-card-lg position-relative">
                                        <Field
                                          as={DatePicker}
                                          error={+!!flatErrors.mustFinishDts}
                                          id={`solution-must-finish-${identifier}`}
                                          data-testid={`solution-must-finish-${identifier}`}
                                          maxLength={50}
                                          name={`solutions[${index}].mustFinishDts`}
                                          defaultValue={solution.mustFinishDts}
                                          onBlur={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                          ) => {
                                            handleOnBlur(
                                              e,
                                              `solutions[${index}].mustFinishDts`
                                            );
                                          }}
                                        />
                                      </div>
                                    </FieldGroup>

                                    <FieldGroup>
                                      <Label
                                        htmlFor={`solution-status-${identifier}`}
                                        className="text-bold"
                                      >
                                        {t('whatIsStatus')}
                                      </Label>

                                      <FieldErrorMsg>
                                        {flatErrors.status}
                                      </FieldErrorMsg>

                                      <Fieldset>
                                        {[
                                          OpSolutionStatus.NOT_STARTED,
                                          OpSolutionStatus.ONBOARDING,
                                          OpSolutionStatus.BACKLOG,
                                          OpSolutionStatus.IN_PROGRESS,
                                          OpSolutionStatus.COMPLETED,
                                          OpSolutionStatus.AT_RISK
                                        ].map(key => (
                                          <Field
                                            as={Radio}
                                            key={key}
                                            id={`solution-status-${identifier}-${key}`}
                                            name={`solutions[${index}].status`}
                                            label={translateOpNeedsStatusType(
                                              key
                                            )}
                                            value={key}
                                            checked={
                                              values.solutions[index]
                                                ?.status === key
                                            }
                                            onChange={() => {
                                              setFieldValue(
                                                `solutions[${index}].status`,
                                                key
                                              );
                                            }}
                                          />
                                        ))}
                                      </Fieldset>
                                    </FieldGroup>

                                    <ImplementationStatuses />
                                  </>
                                )}

                                {index !==
                                  operationalNeed.solutions.length - 1 && (
                                  <Divider className="margin-bottom-6 margin-top-6" />
                                )}
                              </div>
                            );
                          })}

                          <div className="margin-top-6 margin-bottom-3">
                            <Button
                              type="button"
                              className="usa-button usa-button--outline margin-bottom-1"
                              onClick={() => {
                                handleFormSubmit(values, 'back');
                              }}
                            >
                              {h('back')}
                            </Button>

                            <Button
                              type="submit"
                              id="submit-solutions"
                              onClick={() => setErrors({})}
                            >
                              {t('saveSolutions')}
                            </Button>
                          </div>

                          <Button
                            type="button"
                            className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                            onClick={() => {
                              handleFormSubmit(values, null, true);
                            }}
                          >
                            <IconArrowBack
                              className="margin-right-1"
                              aria-hidden
                            />
                            {t('dontAdd')}
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

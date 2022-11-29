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
  CardGroup,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeed_operationalNeed as GetOperationalNeedOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import {
  UpdateCustomOperationalSolution as UpdateCustomOperationalSolutionType,
  UpdateCustomOperationalSolutionVariables
} from 'queries/ITSolutions/types/UpdateCustomOperationalSolution';
import {
  UpdateOperationalNeedSolution as UpdateOperationalNeedSolutionType,
  UpdateOperationalNeedSolutionVariables
} from 'queries/ITSolutions/types/UpdateOperationalNeedSolution';
import UpdateCustomOperationalSolution from 'queries/ITSolutions/UpdateCustomOperationalSolution';
import UpdateOperationalNeedSolution from 'queries/ITSolutions/UpdateOperationalNeedSolution';
import {
  OperationalNeedKey,
  OpSolutionStatus
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import CheckboxCard from '../_components/CheckboxCard';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

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

const SelectSolutions = () => {
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
      id: operationalNeedID
    }
  });

  const operationalNeed = data?.operationalNeed || initialValues;

  const [updateSolution] = useMutation<
    UpdateOperationalNeedSolutionType,
    UpdateOperationalNeedSolutionVariables
  >(UpdateOperationalNeedSolution);

  const [updateCustomSolution] = useMutation<
    UpdateCustomOperationalSolutionType,
    UpdateCustomOperationalSolutionVariables
  >(UpdateCustomOperationalSolution);

  // Cycles and updates all solutions on a need
  const handleFormSubmit = async (
    formikValues: GetOperationalNeedOperationalNeedType
  ) => {
    const { solutions } = formikValues;

    await Promise.all(
      solutions.map(solution => {
        // Update possibleSolution needed bool and status
        if (solution.key) {
          return updateSolution({
            variables: {
              operationalNeedID,
              solutionType: solution.key,
              changes: {
                needed: solution.needed || false,
                status: OpSolutionStatus.IN_PROGRESS
              }
            }
          });
        }
        // Update custom solution needed bool - status should already be set
        return updateCustomSolution({
          variables: {
            operationalNeedID,
            customSolutionType: solution.nameOther || '',
            changes: {
              needed: solution.needed || false
            }
          }
        });
      })
    )
      .then(response => {
        const errors = response?.find(result => result?.errors);

        if (response && !errors) {
          if (
            formikRef?.current?.values.solutions.find(
              solution => solution.needed
            )
          ) {
            showMessageOnNextPage(
              <Alert type="success" slim className="margin-y-4">
                <span className="mandatory-fields-alert__text">
                  {t('successSolutionAdded', {
                    operationalNeedName: operationalNeed.name
                  })}
                </span>
              </Alert>
            );
            history.push(
              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
            );
          } else {
            history.push(`/models/${modelID}/task-list/it-solutions`);
          }
        } else if (errors) {
          setMutationError(true);
        }
      })
      .catch(err => {
        // setMutationError(true);
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
            {t('selectSolution')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('selectInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
            />
          </Grid>

          <Grid row gap>
            <Grid tablet={{ col: 10 }}>
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
                  const { errors, handleSubmit, values } = formikProps;

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
                        data-testid="it-tools-page-seven-form"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <legend className="text-bold margin-bottom-2">
                          {t('chooseSolution')}
                        </legend>

                        {!loading && (
                          <CardGroup>
                            {values.solutions.map(
                              (solution: any, index: number) => (
                                <CheckboxCard
                                  solution={solution}
                                  index={index}
                                  key={solution.nameOther || solution.name}
                                />
                              )
                            )}
                          </CardGroup>
                        )}

                        <Button
                          type="button"
                          id="add-solution-not-listed"
                          className="usa-button usa-button--outline margin-top-2"
                          onClick={() => {
                            history.push(
                              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`
                            );
                          }}
                        >
                          {t('selectAnother')}
                        </Button>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="submit"
                            className="margin-bottom-1"
                            disabled={
                              values.solutions.filter(
                                solution => solution.needed
                              ).length === 0
                            }
                          >
                            {t('continue')}
                          </Button>
                        </div>
                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled display-flex flex-align-center"
                          onClick={() =>
                            history.push(
                              `/models/${modelID}/task-list/it-solutions`
                            )
                          }
                        >
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {t('dontAdd')}
                        </Button>
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

export default SelectSolutions;

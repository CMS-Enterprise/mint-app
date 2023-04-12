/*
View for selecting/toggled 'needed' bool on possible solutions and custom solutions
Displays relevant operational need question and answers
*/

import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  CardGroup,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import CreateOperationalSolution from 'queries/ITSolutions/CreateOperationalSolution';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import {
  CreateOperationalSolution as CreateOperationalSolutionType,
  CreateOperationalSolutionVariables
} from 'queries/ITSolutions/types/CreateOperationalSolution';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeed_operationalNeed as GetOperationalNeedOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import {
  UpdateOperationalSolution as UpdateOperationalSolutionType,
  UpdateOperationalSolutionVariables
} from 'queries/ITSolutions/types/UpdateOperationalSolution';
import UpdateOperationalSolution from 'queries/ITSolutions/UpdateOperationalSolution';
import { OperationalNeedKey } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import CheckboxCard from '../_components/CheckboxCard';
import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
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

type SelectSolutionsProps = {
  update?: boolean;
};

const SelectSolutions = ({ update }: SelectSolutionsProps) => {
  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const {
    state: { isCustomNeed }
  } = useLocation<{
    isCustomNeed?: boolean;
  }>();

  const history = useHistory();

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
      includeNotNeeded: true
    }
  });

  const operationalNeed = data?.operationalNeed || initialValues;

  const [createSolution] = useMutation<
    CreateOperationalSolutionType,
    CreateOperationalSolutionVariables
  >(CreateOperationalSolution);

  const [updateSolution] = useMutation<
    UpdateOperationalSolutionType,
    UpdateOperationalSolutionVariables
  >(UpdateOperationalSolution);

  // Cycles and updates all solutions on a need
  const handleFormSubmit = async (
    formikValues: GetOperationalNeedOperationalNeedType
  ) => {
    const { solutions } = formikValues;

    const removedSolutions: string = checkRemovedSolutions(
      operationalNeed,
      formikValues
    );

    await Promise.all(
      solutions.map(solution => {
        // if solution id is all zeros, it needs to be created
        if (solution.id === '00000000-0000-0000-0000-000000000000') {
          return createSolution({
            variables: {
              operationalNeedID,
              solutionType: solution.key,
              changes: {
                needed: solution.needed || false
              }
            }
          });
        }

        // Otherwise, set the NEEDED bool for solution
        // Custom Solution will have a "nameOther", otherwise, it will be empty
        return updateSolution({
          variables: {
            id: solution.id,
            changes: {
              needed: solution.needed || false,
              nameOther: solution.nameOther || ''
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
            ) ||
            update
          ) {
            showMessageOnNextPage(removedSolutions);
            history.push(
              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${
                update ? 'update-status' : 'solution-implementation-details'
              }`,
              {
                fromSolutionDetails: false,
                isCustomNeed
              }
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

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeed.id}/${operationalNeed.solutions[0]?.id}/solution-details`
    },
    { text: update ? t('updateStatus') : t('selectSolution') }
  ];

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs
        items={
          update
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
            {update ? t('updateSolutions') : t('selectSolution')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('selectInfo')}</p>

          <Grid tablet={{ col: 8 }} className="margin-bottom-4">
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
            />
          </Grid>

          {update && (
            <Alert type="info" slim className="margin-y-2">
              {t('updateSolutionsInfo')}
            </Alert>
          )}

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

                  const allTheSolutions = values.solutions;
                  const commonSolutions = allTheSolutions.filter(
                    solution => solution.isOther === false
                  );
                  const otherSolutions = allTheSolutions.filter(
                    solution => solution.isOther === true
                  );
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
                        className="margin-top-2"
                        data-testid="it-tools-page-seven-form"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <legend className="text-bold margin-bottom-2">
                          {t('chooseCommonSolution')}
                        </legend>

                        {!loading && (
                          <CardGroup>
                            {commonSolutions.map((solution: any) => (
                              <CheckboxCard
                                solution={solution}
                                index={allTheSolutions.findIndex(
                                  x => x.name === solution.name
                                )}
                                key={solution.nameOther || solution.name}
                              />
                            ))}
                          </CardGroup>
                        )}

                        {otherSolutions.length > 0 && (
                          <>
                            <legend className="text-bold margin-top-5 margin-bottom-2">
                              {t('chooseOtherSolution')}
                            </legend>
                            {!loading && (
                              <CardGroup>
                                {otherSolutions.map((solution: any) => (
                                  <CheckboxCard
                                    solution={solution}
                                    index={allTheSolutions.findIndex(
                                      x => x.name === solution.name
                                    )}
                                    key={solution.nameOther || solution.name}
                                  />
                                ))}
                              </CardGroup>
                            )}
                          </>
                        )}

                        <Button
                          type="button"
                          id="add-solution-not-listed"
                          className="usa-button usa-button--outline margin-top-2"
                          onClick={() => {
                            history.push(
                              `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`,
                              { isCustomNeed }
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
                              allTheSolutions.filter(
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
                          {update ? t('dontUpdate') : t('dontAdd')}
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
          <ITSolutionsSidebar modelID={modelID} renderTextFor="solution" />
        </Grid>
      </Grid>
    </>
  );
};

const checkRemovedSolutions = (
  operationalNeed: GetOperationalNeedOperationalNeedType,
  updatedNeed: GetOperationalNeedOperationalNeedType
) => {
  const removedSolutions: string[] = [];

  updatedNeed.solutions.forEach(solution => {
    const originalNeedSolution = operationalNeed.solutions.find(
      originalSolution =>
        (originalSolution.nameOther &&
          originalSolution.nameOther === solution.nameOther) ||
        originalSolution.id === solution.id
    );

    if (originalNeedSolution?.needed === true && solution.needed === false) {
      removedSolutions.push(
        // One of these values will never be null - ts doesn't recognize this
        // @ts-ignore
        originalNeedSolution.nameOther || originalNeedSolution.name
      );
    }
  });

  return removedSolutions.join(',');
};

export default SelectSolutions;

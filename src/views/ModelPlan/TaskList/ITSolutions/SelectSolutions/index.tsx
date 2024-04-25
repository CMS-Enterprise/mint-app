/*
View for selecting/toggled 'needed' bool on possible solutions and custom solutions
Displays relevant operational need question and answers
*/

import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  CardGroup,
  Fieldset,
  Grid,
  Icon
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';
import {
  GetOperationalNeedQuery,
  OperationalNeedKey,
  useCreateOperationalSolutionMutation,
  useGetOperationalNeedQuery,
  useUpdateOperationalSolutionMutation
} from 'gql/gen/graphql';
import { partition } from 'lodash';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import CheckboxCard from '../_components/CheckboxCard';
import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type GetOperationalNeedOperationalNeedType = GetOperationalNeedQuery['operationalNeed'];
type GetOperationalNeedSolutionsType = GetOperationalNeedQuery['operationalNeed']['solutions'][0];

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

export function findChangedSolution(
  solutions: GetOperationalNeedSolutionsType[],
  solution: GetOperationalNeedSolutionsType
): boolean {
  return !!solutions.find(
    sol => sol.id === solution.id && sol.needed !== solution.needed
  );
}

const SelectSolutions = () => {
  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const isDesktop = useCheckResponsiveScreen('tablet', 'larger');

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const isCustomNeed = params.get('isCustomNeed') === 'true';
  const update = params.get('update');

  const history = useHistory();

  const { showMessageOnNextPage } = useMessage();

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const formikRef = useRef<FormikProps<GetOperationalNeedOperationalNeedType>>(
    null
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetOperationalNeedQuery({
    variables: {
      id: operationalNeedID,
      includeNotNeeded: true
    }
  });

  const operationalNeed = data?.operationalNeed || initialValues;

  const [createSolution] = useCreateOperationalSolutionMutation();

  const [updateSolution] = useUpdateOperationalSolutionMutation();

  // Cycles and updates all solutions on a need
  const handleFormSubmit = async (
    formikValues: GetOperationalNeedOperationalNeedType
  ) => {
    const { solutions } = formikValues;

    const removedSolutions: string[] = checkRemovedSolutions(
      operationalNeed,
      formikValues
    );

    await Promise.all(
      solutions.map(solution => {
        // if solution id is all zeros, it needs to be created
        if (
          solution.id === '00000000-0000-0000-0000-000000000000' &&
          solution.needed
        ) {
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
        if (
          solution.id !== '00000000-0000-0000-0000-000000000000' &&
          findChangedSolution(operationalNeed.solutions, solution)
        ) {
          // Otherwise, set the NEEDED bool for solution
          return updateSolution({
            variables: {
              id: solution.id,
              changes: {
                needed: solution.needed || false
              }
            }
          });
        }
        return null;
      })
    )
      .then(responses => {
        const errors = responses?.find(result => result?.errors);

        if (responses && !errors) {
          showMessageOnNextPage(removedSolutions);
          history.push(
            `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${
              update
                ? `solution-implementation-details?isCustomNeed=${!!isCustomNeed}&update-details=true`
                : `solution-implementation-details?isCustomNeed=${!!isCustomNeed}`
            }`
          );
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
    { text: update ? t('updateSolutions') : t('selectSolution') }
  ];

  if (!data && loading) {
    return <PageLoading />;
  }

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
        <Grid tablet={{ col: 12 }} desktop={{ col: 9 }}>
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

          <Grid
            tablet={{ col: 12 }}
            desktop={{ col: 8 }}
            className="margin-bottom-4"
          >
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
        </Grid>

        {isDesktop && (
          <Grid desktop={{ col: 3 }} className="padding-x-1">
            <ITSolutionsSidebar modelID={modelID} renderTextFor="solution" />
          </Grid>
        )}
      </Grid>

      <Grid row gap>
        <Grid tablet={{ col: 12 }} desktop={{ col: 12 }}>
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

              const [commonSolutions, otherSolutions] = partition(
                allTheSolutions,
                'isCommonSolution'
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
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={!!error || loading}>
                      <legend className="text-bold margin-bottom-2">
                        {t('chooseCommonSolution')}
                      </legend>

                      <CardGroup>
                        {commonSolutions.map(
                          (solution: GetOperationalNeedSolutionsType) => (
                            <CheckboxCard
                              solution={solution}
                              index={allTheSolutions.findIndex(x =>
                                x.id === '00000000-0000-0000-0000-000000000000'
                                  ? x.name === solution.name
                                  : x.id === solution.id
                              )}
                              // Default Operational Solutions start with an id full of zeroes.
                              // if solution is default solution, then check name to find index
                              // otherwise, continue to use id to find index
                              key={`${
                                solution.nameOther
                                  ?.toLowerCase()
                                  .replaceAll(' ', '-') ||
                                solution.name
                                  ?.toLowerCase()
                                  .replaceAll(' ', '-')
                              }--${solution.id}`}
                            />
                          )
                        )}
                      </CardGroup>

                      {otherSolutions.length > 0 && (
                        <>
                          <legend className="text-bold margin-top-5 margin-bottom-2">
                            {t('chooseOtherSolution')}
                          </legend>
                          {loading ? (
                            <PageLoading />
                          ) : (
                            <CardGroup>
                              {otherSolutions.map(
                                (solution: GetOperationalNeedSolutionsType) => (
                                  <CheckboxCard
                                    solution={solution}
                                    index={allTheSolutions.findIndex(x =>
                                      x.id ===
                                      '00000000-0000-0000-0000-000000000000'
                                        ? x.name === solution.name
                                        : x.id === solution.id
                                    )}
                                    key={solution.nameOther || solution.name}
                                  />
                                )
                              )}
                            </CardGroup>
                          )}
                        </>
                      )}

                      <Button
                        type="button"
                        id="add-solution-not-listed"
                        className="usa-button usa-button--outline margin-top-2 margin-bottom-3"
                        onClick={() => {
                          history.push(
                            `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution?isCustomNeed=${!!isCustomNeed}`
                          );
                        }}
                      >
                        {t('selectAnother')}
                      </Button>

                      {/* Render alert banner if a non-other solution is selected.  Alert notifies use that email will be sent */}
                      {allTheSolutions.filter(
                        solution => solution.needed && !solution.isOther
                      ).length > 0 && (
                        <Alert type="info" slim>
                          {t('selectAlert')}
                        </Alert>
                      )}

                      <div className="margin-y-3">
                        <Button
                          type="submit"
                          className="margin-bottom-1"
                          disabled={
                            allTheSolutions.filter(solution => solution.needed)
                              .length === 0
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
                        <Icon.ArrowBack
                          className="margin-right-1"
                          aria-hidden
                        />
                        {update ? t('dontUpdate') : t('dontAdd')}
                      </Button>
                    </Fieldset>
                  </Form>
                </>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
      {!isDesktop && (
        <Grid desktop={{ col: 12 }} className="padding-x-1">
          <ITSolutionsSidebar modelID={modelID} renderTextFor="solution" />
        </Grid>
      )}
    </>
  );
};

const checkRemovedSolutions = (
  operationalNeed: GetOperationalNeedOperationalNeedType,
  updatedNeed: GetOperationalNeedOperationalNeedType
): string[] => {
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

  return removedSolutions;
};

export default SelectSolutions;

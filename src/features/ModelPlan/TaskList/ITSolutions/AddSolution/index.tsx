/*
View for adding an operational need solution from a list of possible solutions
All can select 'Other' which directs to creating a custom solution
Queries and displays SolutionCard component when a custom solution/operationalSolutionID parameter is present in url
*/

import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  ComboBox,
  Fieldset,
  Grid,
  Icon,
  Label
} from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import { Form, Formik, FormikProps } from 'formik';
import {
  GetOperationalSolutionQuery,
  OperationalSolutionKey,
  OpSolutionStatus,
  useCreateOperationalSolutionMutation,
  useGetOperationalSolutionQuery,
  useGetPossibleOperationalSolutionsQuery,
  useUpdateOperationalSolutionMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import flattenErrors from 'utils/flattenErrors';
import { sortPossibleOperationalNeeds } from 'utils/modelPlan';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';
import SolutionCard from '../_components/SolutionCard';

type OperationalSolutionFormType = {
  key?: OperationalSolutionKey;
};

type GetOperationalSolutionOperationalSolutionType =
  GetOperationalSolutionQuery['operationalSolution'];

const AddSolution = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID?: string;
  }>();
  const { t } = useTranslation('opSolutionsMisc');
  const { t: solutionsT } = useTranslation('solutions');
  const { t: h } = useTranslation('general');

  const formikRef = useRef<FormikProps<OperationalSolutionFormType>>(null);

  const history = useHistory();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const isCustomNeed = params.get('isCustomNeed') === 'true';

  const { modelName } = useContext(ModelInfoContext);

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const { data, loading, error } = useGetPossibleOperationalSolutionsQuery();

  const possibleOperationalSolutions = data?.possibleOperationalSolutions || [];

  const { data: customData } = useGetOperationalSolutionQuery({
    variables: {
      // Query will be skipped if not present, need to default to string to appease ts
      id: operationalSolutionID || ''
    },
    skip: !operationalSolutionID,
    fetchPolicy: 'no-cache'
  });

  const solutionOptions = [...possibleOperationalSolutions]
    .sort(sortPossibleOperationalNeeds)
    .map(solution => {
      return {
        label: solution.name === 'Other new process' ? 'Other' : solution.name,
        value: solution.key
      };
    });

  // If operationalSolutionID present in url, will contain queried data for custom solution
  const customOperationalSolution =
    customData?.operationalSolution ||
    ({} as GetOperationalSolutionOperationalSolutionType);

  // Initial/default formik value
  const additionalSolution: OperationalSolutionFormType = {
    key: operationalSolutionID
      ? OperationalSolutionKey.OTHER_NEW_PROCESS
      : undefined
  };

  const [createSolution] = useCreateOperationalSolutionMutation();

  const [updateCustomSolution] = useUpdateOperationalSolutionMutation();

  const treatAsOtherSolutions = [
    OperationalSolutionKey.CONTRACTOR,
    OperationalSolutionKey.CROSS_MODEL_CONTRACT,
    OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS,
    OperationalSolutionKey.INTERNAL_STAFF,
    OperationalSolutionKey.OTHER_NEW_PROCESS
  ];

  const handleFormSubmit = async (
    formikValues: OperationalSolutionFormType
  ) => {
    const { key } = formikValues;

    let updateMutation;
    try {
      // Add from list of possible solutions
      if (key !== OperationalSolutionKey.OTHER_NEW_PROCESS) {
        updateMutation = await createSolution({
          variables: {
            operationalNeedID,
            solutionType: key,
            changes: {
              needed: true,
              status: OpSolutionStatus.NOT_STARTED
            }
          }
        });
      } else if (!operationalSolutionID) {
        // Add custom solution
        updateMutation = await createSolution({
          variables: {
            operationalNeedID,
            changes: {
              needed: true,
              nameOther: t('otherSolution'),
              status: OpSolutionStatus.NOT_STARTED
            }
          }
        });
      } else {
        // Update a custom solution
        updateMutation = await updateCustomSolution({
          variables: {
            id: operationalSolutionID,
            changes: {
              needed: true,
              nameOther:
                customOperationalSolution?.nameOther || t('otherSolution'),
              status: OpSolutionStatus.NOT_STARTED
            }
          }
        });
      }
    } catch (e) {
      setMutationError(true);
    }

    if (updateMutation && !updateMutation.errors) {
      history.push(
        `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions?isCustomNeed=${isCustomNeed}`
      );
    } else if (!updateMutation || updateMutation.errors) {
      setMutationError(true);
    }
  };

  if (!data && loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.IT_TRACKER
        ]}
        customItem={t('addSolution')}
      />

      {mutationError && (
        <Alert type="error" slim>
          {t('updateError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('addSolution')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('addSolutionInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
            />
          </Grid>

          <Grid gap>
            <Grid tablet={{ col: 8 }}>
              <Formik
                initialValues={additionalSolution}
                onSubmit={values => {
                  handleFormSubmit(values);
                }}
                enableReinitialize
                innerRef={formikRef}
              >
                {(formikProps: FormikProps<OperationalSolutionFormType>) => {
                  const { errors, handleSubmit, values, setFieldValue } =
                    formikProps;

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
                        data-testid="it-solutions-add-solution"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset disabled={!!error || loading}>
                          <FieldGroup
                            scrollElement="key"
                            error={!!flatErrors.key}
                            className="margin-top-0 margin-bottom-5"
                          >
                            <Label htmlFor="it-solutions-key">
                              {solutionsT('key.label')}
                              <RequiredAsterisk />
                            </Label>

                            <p className="text-base margin-y-1 line-height-body-4">
                              {solutionsT('key.sublabel')}
                            </p>

                            <FieldErrorMsg>{flatErrors.key}</FieldErrorMsg>

                            <ComboBox
                              id="it-solutions-key"
                              name="key"
                              inputProps={{
                                id: 'it-solutions-key',
                                name: 'key',
                                'aria-describedby': 'it-solutions-key'
                              }}
                              options={solutionOptions}
                              defaultValue={
                                solutionOptions.find(
                                  solution => solution.value === values.key
                                )?.label
                              }
                              onChange={solutionKey => {
                                const foundSolution = solutionOptions.find(
                                  solution => solution.value === solutionKey
                                );
                                if (foundSolution) {
                                  setFieldValue('key', foundSolution.value);
                                } else {
                                  setFieldValue('key', '');
                                }
                              }}
                            />

                            {treatAsOtherSolutions.includes(
                              values.key as OperationalSolutionKey
                            ) &&
                              !operationalSolutionID && (
                                <Button
                                  type="button"
                                  id="add-custom-solution-button"
                                  className="usa-button usa-button--outline margin-top-3"
                                  onClick={() => {
                                    if (
                                      values.key ===
                                      OperationalSolutionKey.OTHER_NEW_PROCESS
                                    ) {
                                      history.push(
                                        `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution`
                                      );
                                    } else {
                                      history.push(
                                        `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/add-custom-solution?selectedSolution=${values.key}`
                                      );
                                    }
                                  }}
                                >
                                  {t('addSolutionDetails')}
                                </Button>
                              )}
                          </FieldGroup>

                          {/* If directed from custom solution creation, diplay SolutionCard */}
                          {operationalSolutionID &&
                            customOperationalSolution && (
                              <div data-testid="custom-added-solution">
                                <p className="text-bold margin-top-4">
                                  {t('solution')}
                                </p>
                                <SolutionCard
                                  solution={customOperationalSolution}
                                  addingCustom
                                />
                              </div>
                            )}

                          {/* Render alert banner if a non-other solution is selected.  Alert notifies use that email will be sent */}
                          {values.key &&
                            !treatAsOtherSolutions.includes(
                              values.key as OperationalSolutionKey
                            ) && (
                              <Alert
                                type="info"
                                slim
                                lessRightPadding
                                className="margin-bottom-3"
                              >
                                {t('selectCustomAlert')}
                              </Alert>
                            )}

                          <div className="margin-bottom-3">
                            <Button
                              type="submit"
                              className="margin-bottom-1"
                              id="add-solution-details-button"
                              data-testid="add-solution-details-button"
                              disabled={!values.key}
                            >
                              {t('addSolutionButton')}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            className="usa-button usa-button--unstyled display-flex flex-align-center"
                            onClick={() => {
                              history.push(
                                isCustomNeed
                                  ? // To update this to go to new update operational need page
                                    `/models/${modelID}/collaboration-area/task-list/it-solutions`
                                  : `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/select-solutions`
                              );
                            }}
                          >
                            <Icon.ArrowBack
                              className="margin-right-1"
                              aria-hidden
                            />
                            {t('dontAddSolution')}
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
          <ITSolutionsSidebar modelID={modelID} renderTextFor="solution" />
        </Grid>
      </Grid>
    </>
  );
};

export default AddSolution;

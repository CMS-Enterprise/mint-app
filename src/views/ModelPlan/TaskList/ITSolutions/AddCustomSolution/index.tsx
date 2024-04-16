import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Fieldset,
  Grid,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import CreateOperationalSolution from 'queries/ITSolutions/CreateOperationalSolution';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  CreateOperationalSolution as CreateOperationalSolutionType,
  CreateOperationalSolutionVariables
} from 'queries/ITSolutions/types/CreateOperationalSolution';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import {
  UpdateOperationalSolution as UpdateOperationalSolutionType,
  UpdateOperationalSolutionVariables
} from 'queries/ITSolutions/types/UpdateOperationalSolution';
import UpdateOperationalSolution from 'queries/ITSolutions/UpdateOperationalSolution';
import {
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type CustomOperationalSolutionFormType = Omit<
  GetOperationalSolutionOperationalSolutionType,
  | '__typename'
  | 'id'
  | 'key'
  | 'name'
  | 'status'
  | 'mustFinishDts'
  | 'mustStartDts'
  | 'operationalSolutionSubtasks'
  | 'isOther'
  | 'isCommonSolution'
>;

const initialValues: CustomOperationalSolutionFormType = {
  nameOther: '',
  otherHeader: '',
  pocName: '',
  pocEmail: '',
  documents: [],
  needed: false
};

const AddCustomSolution = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID?: string;
  }>();

  const history = useHistory();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectedSolution = params.get(
    'selectedSolution'
  ) as OperationalSolutionKey;

  const { t } = useTranslation('opSolutionsMisc');
  const { t: solutionsT } = useTranslation('solutions');
  const { t: h } = useTranslation('draftModelPlan');

  const { key: keyConfig } = usePlanTranslation('solutions');

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const formikRef = useRef<FormikProps<CustomOperationalSolutionFormType>>(
    null
  );

  const { modelName } = useContext(ModelInfoContext);

  const { showMessageOnNextPage } = useMessage();

  const { data, loading, error } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
    variables: {
      // Query will be skipped if not present, need to default to string to appease ts
      id: operationalSolutionID || ''
    },
    skip: !operationalSolutionID
  });

  const customOperationalSolution = data?.operationalSolution || initialValues;

  const [createSolution] = useMutation<
    CreateOperationalSolutionType,
    CreateOperationalSolutionVariables
  >(CreateOperationalSolution);

  const [updateSolution] = useMutation<
    UpdateOperationalSolutionType,
    UpdateOperationalSolutionVariables
  >(UpdateOperationalSolution);

  const handleFormSubmit = async (
    formikValues: CustomOperationalSolutionFormType
  ) => {
    const { nameOther, pocName, pocEmail, otherHeader } = formikValues;

    let updateMutation;

    try {
      // Add a new custom solution
      if (!operationalSolutionID) {
        updateMutation = await createSolution({
          variables: {
            operationalNeedID,
            solutionType: selectedSolution || null,
            changes: {
              needed: true,
              nameOther: !selectedSolution ? nameOther : null,
              otherHeader: selectedSolution ? otherHeader : null,
              status: OpSolutionStatus.NOT_STARTED,
              pocEmail,
              pocName
            }
          }
        });
        // Update existing custom solution
      } else {
        updateMutation = await updateSolution({
          variables: {
            id: operationalSolutionID,
            changes: {
              needed: customOperationalSolution.needed,
              nameOther: !selectedSolution ? nameOther : null,
              otherHeader: selectedSolution ? otherHeader : null,
              pocEmail,
              pocName
            }
          }
        });
      }
    } catch {
      setMutationError(true);
    }

    if (updateMutation && !updateMutation.errors && updateMutation.data) {
      setMutationError(false);

      if (!operationalSolutionID) {
        history.push(
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
        );
      } else {
        showMessageOnNextPage(
          <Alert type="success" slim className="margin-y-4">
            <span className="mandatory-fields-alert__text">
              {t('successSolutionUpdated')}
            </span>
          </Alert>
        );
        history.goBack();
      }
    } else if (updateMutation?.errors) {
      setMutationError(true);
    }
  };

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('addSolution'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`
    },
    {
      text: operationalSolutionID
        ? t('updateSolutionDetails')
        : t('addSolutionDetails')
    }
  ];

  if (!data && loading) {
    return <PageLoading />;
  }

  if (
    error ||
    (!customOperationalSolution && !loading && !operationalSolutionID)
  ) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {mutationError && (
        <Alert type="error" slim>
          {t('updateError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {operationalSolutionID
              ? t('updateSolutionDetails')
              : t('addSolution')}
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
              {loading ? (
                <PageLoading />
              ) : (
                <Formik
                  initialValues={customOperationalSolution}
                  onSubmit={values => {
                    handleFormSubmit(values);
                  }}
                  enableReinitialize
                  innerRef={formikRef}
                >
                  {(
                    formikProps: FormikProps<CustomOperationalSolutionFormType>
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
                          data-testid="it-solutions-add-solution"
                          onSubmit={e => {
                            handleSubmit(e);
                          }}
                        >
                          {selectedSolution && (
                            <h3 className="margin-top-6 margin-bottom-0">
                              {t('selectedSectionHeading')}{' '}
                              {keyConfig.options[selectedSolution]}
                            </h3>
                          )}
                          <Fieldset disabled={!!error || loading}>
                            {selectedSolution === null ? (
                              <FieldGroup
                                scrollElement="nameOther"
                                error={!!flatErrors.nameOther}
                                className="margin-top-3"
                              >
                                <Label htmlFor="it-solution-custom-name-other">
                                  {solutionsT('nameOther.label')}
                                  <RequiredAsterisk />
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.nameOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="it-solution-custom-name-other"
                                  data-testid="it-solution-custom-name-other"
                                  maxLength={50}
                                  name="nameOther"
                                  value={values.nameOther || ''}
                                />
                              </FieldGroup>
                            ) : (
                              <FieldGroup
                                scrollElement="otherHeader"
                                error={!!flatErrors.otherHeader}
                                className="margin-top-3"
                              >
                                <Label htmlFor="it-solution-other-header">
                                  {/* Other Header */}
                                  {solutionsT('otherHeader.label')}
                                  <RequiredAsterisk />
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.otherHeader}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="it-solution-other-header"
                                  data-testid="it-solution-other-header"
                                  maxLength={50}
                                  name="otherHeader"
                                  value={values.otherHeader || ''}
                                />
                              </FieldGroup>
                            )}

                            <FieldGroup
                              scrollElement="pocName"
                              error={!!flatErrors.pocName}
                              className="margin-top-3"
                            >
                              <Label htmlFor="it-solution-custom-poc-name">
                                {t('solutionPOC')}
                              </Label>

                              <p className="margin-bottom-1">
                                {solutionsT('pocName.label')}
                              </p>

                              <FieldErrorMsg>
                                {flatErrors.pocName}
                              </FieldErrorMsg>

                              <Field
                                as={TextInput}
                                id="it-solution-custom-poc-name"
                                data-testid="it-solution-custom-poc-name"
                                maxLength={50}
                                name="pocName"
                                value={values.pocName || ''}
                              />
                            </FieldGroup>

                            <FieldGroup
                              scrollElement="pocEmail"
                              error={!!flatErrors.pocEmail}
                              className="margin-top-3"
                            >
                              <Label
                                htmlFor="it-solution-custom-poc-email"
                                className="text-normal"
                              >
                                {solutionsT('pocEmail.label')}
                              </Label>

                              <FieldErrorMsg>
                                {flatErrors.pocEmail}
                              </FieldErrorMsg>

                              <Field
                                as={TextInput}
                                id="it-solution-custom-poc-email"
                                data-testid="it-solution-custom-poc-email"
                                maxLength={50}
                                name="pocEmail"
                                value={values.pocEmail || ''}
                              />
                            </FieldGroup>

                            <div className="margin-top-6 margin-bottom-3">
                              <Button
                                type="submit"
                                className="margin-bottom-1"
                                id="submit-custom-solution"
                                disabled={
                                  selectedSolution === null
                                    ? !values.nameOther
                                    : !values.otherHeader
                                }
                              >
                                {operationalSolutionID
                                  ? t('updateSolutionDetails')
                                  : t('addSolutionDetails')}
                              </Button>
                            </div>

                            <Button
                              type="button"
                              className="usa-button usa-button--unstyled display-flex flex-align-center"
                              onClick={() => {
                                history.goBack();
                              }}
                            >
                              <Icon.ArrowBack
                                className="margin-right-1"
                                aria-hidden
                              />
                              {operationalSolutionID
                                ? t('dontUpdateSolution')
                                : t('dontAddSolution')}
                            </Button>
                          </Fieldset>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              )}
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

export default AddCustomSolution;

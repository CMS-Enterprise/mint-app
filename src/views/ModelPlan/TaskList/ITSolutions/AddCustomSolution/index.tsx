import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import {
  UpdateCustomOperationalSolution as UpdateCustomOperationalSolutionType,
  UpdateCustomOperationalSolutionVariables
} from 'queries/ITSolutions/types/UpdateCustomOperationalSolution';
import {
  UpdateCustomOperationalSolutionByID as UpdateCustomOperationalSolutionByIDType,
  UpdateCustomOperationalSolutionByIDVariables
} from 'queries/ITSolutions/types/UpdateCustomOperationalSolutionByID';
import UpdateCustomOperationalSolution from 'queries/ITSolutions/UpdateCustomOperationalSolution';
import UpdateCustomOperationalSolutionByID from 'queries/ITSolutions/UpdateCustomOperationalSolutionByID';
import { OpSolutionStatus } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type CustomOperationalSolutionFormType = Omit<
  GetOperationalSolutionOperationalSolutionType,
  '__typename' | 'id' | 'key' | 'name'
>;

const initialValues: CustomOperationalSolutionFormType = {
  nameOther: '',
  pocName: '',
  pocEmail: '',
  needed: false
};

// Used to clear pocName and pocEmail on page load if redirected from remove detail link
const clearFields = (
  removeDetails: boolean,
  customSolution:
    | GetOperationalSolutionOperationalSolutionType
    | CustomOperationalSolutionFormType
) => {
  if (removeDetails) {
    return {
      nameOther: customSolution.nameOther,
      pocName: '',
      pocEmail: '',
      needed: customSolution.needed
    };
  }
  return customSolution;
};

const AddCustomSolution = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID?: string;
  }>();

  // Hash variable to trigger removal of pocName and pocEmail
  const removeDetails = useLocation().hash === '#remove-details';

  const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const formikRef = useRef<FormikProps<CustomOperationalSolutionFormType>>(
    null
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
    variables: {
      // Query will be skipped if not present, need to default to string to appease ts
      id: operationalSolutionID || ''
    },
    skip: !operationalSolutionID
  });

  // Returns either existing custom soluton data, empty custom solution, or
  // details removed from existing custom soluton
  const customOperationalSolution = clearFields(
    removeDetails,
    data?.operationalSolution || initialValues
  );

  const [addCustomSolution] = useMutation<
    UpdateCustomOperationalSolutionType,
    UpdateCustomOperationalSolutionVariables
  >(UpdateCustomOperationalSolution);

  const [updateCustomSolutionByID] = useMutation<
    UpdateCustomOperationalSolutionByIDType,
    UpdateCustomOperationalSolutionByIDVariables
  >(UpdateCustomOperationalSolutionByID);

  const handleFormSubmit = async (
    formikValues: CustomOperationalSolutionFormType
  ) => {
    const { nameOther, pocName, pocEmail } = formikValues;

    let updateMutation;

    try {
      // Add a new custom solution
      if (!operationalSolutionID) {
        updateMutation = await addCustomSolution({
          variables: {
            operationalNeedID,
            customSolutionType: nameOther || '',
            changes: {
              needed: customOperationalSolution.needed,
              status: OpSolutionStatus.IN_PROGRESS,
              pocEmail,
              pocName
            }
          }
        });
        // Update existing custom solution
      } else {
        updateMutation = await updateCustomSolutionByID({
          variables: {
            id: operationalSolutionID,
            customSolutionType: nameOther || '',
            changes: {
              needed: customOperationalSolution.needed,
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
          // If this block of code is hit, property addOrUpdateCustomOperationalSolution will always exist - ts doesn't know this
          // @ts-ignore
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution/${updateMutation.data.addOrUpdateCustomOperationalSolution.id}`
        );
      } else {
        history.goBack();
      }
    } else if (updateMutation?.errors) {
      setMutationError(true);
    }
  };

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
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-solution`}
          >
            <span>{t('addSolution')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>
          {operationalSolutionID
            ? t('updateSolutionDetails')
            : t('addSolutionDetails')}
        </Breadcrumb>
      </BreadcrumbBar>

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
                        className="margin-top-3"
                        data-testid="it-solutions-add-solution"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset disabled={loading}>
                          <FieldGroup
                            scrollElement="nameOther"
                            error={!!flatErrors.nameOther}
                            className="margin-top-3"
                          >
                            <Label htmlFor="it-solution-custom-name-other">
                              {t('solutionName')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>
                              {flatErrors.nameOther}
                            </FieldErrorMsg>

                            <Field
                              as={TextInput}
                              error={!!flatErrors.nameOther}
                              id="it-solution-custom-name-other"
                              data-testid="it-solution-custom-name-other"
                              maxLength={50}
                              name="nameOther"
                            />
                          </FieldGroup>

                          <FieldGroup
                            scrollElement="pocName"
                            error={!!flatErrors.pocName}
                            className="margin-top-3"
                          >
                            <Label htmlFor="it-solution-custom-poc-name">
                              {t('solutionPOC')}
                            </Label>

                            <p className="margin-bottom-1">
                              {t('solutionPOCInfo')}
                            </p>

                            <FieldErrorMsg>{flatErrors.pocName}</FieldErrorMsg>

                            <Field
                              as={TextInput}
                              error={!!flatErrors.pocName}
                              id="it-solution-custom-poc-name"
                              data-testid="it-solution-custom-poc-name"
                              maxLength={50}
                              name="pocName"
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
                              {t('solutionEmailInfo')}
                            </Label>

                            <FieldErrorMsg>{flatErrors.pocEmail}</FieldErrorMsg>

                            <Field
                              as={TextInput}
                              error={!!flatErrors.pocEmail}
                              id="it-solution-custom-poc-email"
                              data-testid="it-solution-custom-poc-email"
                              maxLength={50}
                              name="pocEmail"
                            />
                          </FieldGroup>

                          <div className="margin-top-6 margin-bottom-3">
                            <Button
                              type="submit"
                              className="margin-bottom-1"
                              disabled={!values.nameOther}
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
                            <IconArrowBack
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

export default AddCustomSolution;

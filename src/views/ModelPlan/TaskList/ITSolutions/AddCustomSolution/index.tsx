import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
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
import { UpdateCustomOperationalSolutionVariables } from 'queries/ITSolutions/types/UpdateCustomOperationalSolution';
import UpdateCustomOperationalSolution from 'queries/ITSolutions/UpdateCustomOperationalSolution';
import { OpSolutionStatus } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type CustomOperationalSolutionFormType = Omit<
  GetOperationalSolutionOperationalSolutionType,
  '__typename' | 'id' | 'key'
>;

const initialValues: CustomOperationalSolutionFormType = {
  name: '',
  pocName: '',
  pocEmail: ''
};

const AddCustomSolution = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID?: string;
  }>();

  const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

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

  const customOperationalSolution = data?.operationalSolution || initialValues;

  const [
    updateCustomSolution
  ] = useMutation<UpdateCustomOperationalSolutionVariables>(
    UpdateCustomOperationalSolution
  );

  const handleFormSubmit = async (
    formikValues: CustomOperationalSolutionFormType
  ) => {
    const { name, pocName, pocEmail } = formikValues;

    updateCustomSolution({
      variables: {
        operationalNeedID,
        customSolutionType: name,
        changes: {
          needed: true,
          status: OpSolutionStatus.IN_PROGRESS,
          pocEmail,
          pocName
        }
      }
    })
      .then(response => {
        if (response && !response.errors) {
          history.push(
            `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
          );
        } else if (response.errors) {
          formikRef?.current?.setErrors({
            name: JSON.stringify(response.errors)
          });
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
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
        <Breadcrumb current>{t('addSolutionDetails')}</Breadcrumb>
      </BreadcrumbBar>

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

          <p>{t('addSolutionInfo')}</p>

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
                            scrollElement="name"
                            error={!!flatErrors.name}
                            className="margin-top-3"
                          >
                            <Label htmlFor="it-solution-custom-name">
                              {t('solutionName')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>{flatErrors.name}</FieldErrorMsg>

                            <Field
                              as={TextInput}
                              error={!!flatErrors.name}
                              id="it-solution-custom-name"
                              maxLength={50}
                              name="name"
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
                              maxLength={50}
                              name="pocEmail"
                            />
                          </FieldGroup>

                          <div className="margin-top-6 margin-bottom-3">
                            <Button
                              type="submit"
                              className="margin-bottom-1"
                              disabled={
                                !values.name ||
                                !values.pocName ||
                                !values.pocEmail
                              }
                            >
                              {t('addSolutionButton')}
                            </Button>
                          </div>

                          <Button
                            type="button"
                            className="usa-button usa-button--unstyled display-flex flex-align-center"
                            onClick={() => {
                              history.push(
                                `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
                              );
                            }}
                          >
                            <IconArrowBack
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

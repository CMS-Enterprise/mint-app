import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Dropdown,
  Fieldset,
  Grid,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import GetPossibleOperationalSolutions from 'queries/ITSolutions/GetPossibleOperationalSolutions';
import { GetPossibleOperationalSolutions as GetPossibleOperationalSolutionsType } from 'queries/ITSolutions/types/GetPossibleOperationalSolutions';
import { UpdateCustomOperationalSolutionVariables } from 'queries/ITSolutions/types/UpdateCustomOperationalSolution';
import { UpdateOperationalNeedSolutionVariables } from 'queries/ITSolutions/types/UpdateOperationalNeedSolution';
import UpdateCustomOperationalSolution from 'queries/ITSolutions/UpdateCustomOperationalSolution';
import UpdateOperationalNeedSolution from 'queries/ITSolutions/UpdateOperationalNeedSolution';
import {
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { sortPossibleOperationalNeeds } from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type OperationalSolutionFormType = {
  key: OperationalSolutionKey | string;
};

const AddSolution = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID?: string;
  }>();

  const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const formikRef = useRef<FormikProps<OperationalSolutionFormType>>(null);

  const { modelName } = useContext(ModelInfoContext);

  const {
    data,
    loading,
    error
  } = useQuery<GetPossibleOperationalSolutionsType>(
    GetPossibleOperationalSolutions,
    {
      variables: {
        id: operationalNeedID
      }
    }
  );

  const possibleOperationalSolutions = data?.possibleOperationalSolutions || [];

  // Default formik value
  const additionalSolution: OperationalSolutionFormType = {
    key: operationalSolutionID ? OperationalSolutionKey.OTHER_NEW_PROCESS : ''
  };

  const [updateSolution] = useMutation<UpdateOperationalNeedSolutionVariables>(
    UpdateOperationalNeedSolution
  );

  const [
    updateCustomSolution
  ] = useMutation<UpdateCustomOperationalSolutionVariables>(
    UpdateCustomOperationalSolution
  );

  const handleFormSubmit = async (
    formikValues: OperationalSolutionFormType
  ) => {
    const { key } = formikValues;

    let updateMutation;

    try {
      if (key !== OperationalSolutionKey.OTHER_NEW_PROCESS) {
        updateMutation = await updateSolution({
          variables: {
            operationalNeedID,
            solutionType: key,
            changes: {
              needed: true,
              status: OpSolutionStatus.IN_PROGRESS
            }
          }
        });
      } else {
        updateMutation = await updateCustomSolution({
          variables: {
            operationalNeedID,
            customSolutionType: t('otherSolution'),
            changes: {
              needed: true
            }
          }
        });
      }
    } catch (errors) {
      formikRef?.current?.setErrors({
        key: JSON.stringify(errors)
      });
    }

    if (updateMutation && !updateMutation.errors) {
      history.push(
        `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions`
      );
    } else if (!updateMutation || updateMutation.errors) {
      formikRef?.current?.setErrors({
        key: JSON.stringify(updateMutation?.errors)
      });
    }
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
        <Breadcrumb current>{t('addSolution')}</Breadcrumb>
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
                initialValues={additionalSolution}
                onSubmit={values => {
                  handleFormSubmit(values);
                }}
                enableReinitialize
                innerRef={formikRef}
              >
                {(formikProps: FormikProps<OperationalSolutionFormType>) => {
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
                        data-testid="it-solutions-add-solution"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset disabled={loading}>
                          <FieldGroup
                            scrollElement="key"
                            error={!!flatErrors.key}
                          >
                            <Label htmlFor="it-solutions-key">
                              {t('howWillYouSolve')}
                              <RequiredAsterisk />
                            </Label>

                            <p className="text-base margin-y-1 line-height-body-4">
                              {t('howWillYouSolveInfo')}
                            </p>

                            <FieldErrorMsg>{flatErrors.key}</FieldErrorMsg>

                            <Field
                              as={Dropdown}
                              id="it-solutions-key"
                              name="key"
                              value={values.key}
                            >
                              <option key="default-select" disabled value="" />
                              {[...possibleOperationalSolutions]
                                .sort(sortPossibleOperationalNeeds)
                                .map(solution => {
                                  return (
                                    <option
                                      key={solution.key}
                                      value={solution.key || ''}
                                    >
                                      {solution.name}
                                    </option>
                                  );
                                })}
                            </Field>

                            {values.key ===
                              OperationalSolutionKey.OTHER_NEW_PROCESS &&
                              !operationalSolutionID && (
                                <Button
                                  type="button"
                                  className="usa-button usa-button--outline margin-top-3"
                                  onClick={() => {
                                    history.push(
                                      `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution`
                                    );
                                  }}
                                >
                                  {t('addSolutionDetails')}
                                </Button>
                              )}
                          </FieldGroup>

                          <div className="margin-top-6 margin-bottom-3">
                            <Button
                              type="submit"
                              className="margin-bottom-1"
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

export default AddSolution;

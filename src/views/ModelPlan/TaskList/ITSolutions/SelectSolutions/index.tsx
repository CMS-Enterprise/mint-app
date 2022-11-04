import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
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
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeed_operationalNeed as GetOperationalNeedOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import { UpdateOperationalNeedSolutionVariables } from 'queries/ITSolutions/types/UpdateOperationalNeedSolution';
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

const initialValues: GetOperationalNeedOperationalNeedType = {
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

  const [updateSolution] = useMutation<UpdateOperationalNeedSolutionVariables>(
    UpdateOperationalNeedSolution
  );

  const handleFormSubmit = async (
    formikValues: GetOperationalNeedOperationalNeedType
  ) => {
    const { solutions } = formikValues;

    try {
      const response = await Promise.all(
        solutions.map(solution => {
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
        })
      );

      const errors = response?.find(result => result.errors);

      if (response && !errors) {
        history.push(`/models/${modelID}/task-list/it-solutions`);
      } else if (errors) {
        formikRef?.current?.setErrors({ id: JSON.stringify(error) });
      }
    } catch (errors) {
      formikRef?.current?.setErrors({ id: JSON.stringify(errors) });
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
        <Breadcrumb current>{t('selectSolution')}</Breadcrumb>
      </BreadcrumbBar>

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

          <p>{t('selectInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeed={operationalNeed}
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
                                  key={solution.name || solution.nameOther}
                                />
                              )
                            )}
                          </CardGroup>
                        )}

                        <Button
                          type="button"
                          className="usa-button usa-button--outline margin-top-2"
                          onClick={() => {
                            handleFormSubmit(values);
                          }}
                        >
                          {t('selectAnother')}
                        </Button>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="button"
                            className="margin-bottom-1"
                            onClick={() => {
                              handleFormSubmit(values);
                            }}
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

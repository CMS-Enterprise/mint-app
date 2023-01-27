import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Fieldset,
  Grid,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import Expire from 'components/shared/Expire';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import {
  UpdateCustomOperationalNeed as MutationType,
  UpdateCustomOperationalNeed_addOrUpdateCustomOperationalNeed as FormTypes,
  UpdateCustomOperationalNeedVariables
} from 'queries/ITSolutions/types/UpdateCustomOperationalNeed';
import UpdateCustomOperationalNeed from 'queries/ITSolutions/UpdateCustomOperationalNeed';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';

type CustomOperationalNeedFormType = Omit<
  FormTypes,
  '__typename' | 'id' | 'needed' | 'key' | 'nameOther'
> & { nameOther: string };

const AddOrUpdateOperationalNeed = () => {
  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();
  const history = useHistory();
  const { message, showMessageOnNextPage } = useMessage();
  const { modelName } = useContext(ModelInfoContext);
  const formikRef = useRef<FormikProps<CustomOperationalNeedFormType>>(null);

  const isUpdating = !!operationalNeedID;

  const { data } = useQuery<
    GetOperationalNeedType,
    GetOperationalNeedVariables
  >(GetOperationalNeed, {
    variables: {
      id: operationalNeedID
    },
    skip: !operationalNeedID
  });

  const [addCustomOperationalNeed] = useMutation<
    MutationType,
    UpdateCustomOperationalNeedVariables
  >(UpdateCustomOperationalNeed);

  const handleFormSubmit = (
    formikValues: CustomOperationalNeedFormType,
    redirect?: 'it-tracker'
  ) => {
    addCustomOperationalNeed({
      variables: {
        modelPlanID: modelID,
        customNeedType: formikValues.nameOther,
        needed: true
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'it-tracker') {
            showMessageOnNextPage(
              <Alert type="success" slim className="margin-y-4">
                <span className="mandatory-fields-alert__text">
                  {t('successMessage.onlyOperationalNeed', {
                    operationalNeedName:
                      response.data?.addOrUpdateCustomOperationalNeed.nameOther
                  })}
                </span>
              </Alert>
            );
            // Save without adding solution
            history.push(`/models/${modelID}/task-list/it-solutions`);
          } else {
            // Contiues to add solution
            history.push({
              pathname: `/models/${modelID}/task-list/it-solutions/${response?.data?.addOrUpdateCustomOperationalNeed?.id}/add-solution`,
              state: { isCustomNeed: true }
            });
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions`
      // url: `/models/${modelID}/task-list/it-solutions/${operationalNeed.id}/${operationalNeed.solutions[0]?.id}/solution-details`
    },
    {
      text: isUpdating
        ? t('updateThisOpertationalNeed')
        : t('addOpertationalNeed')
    }
  ];

  const initialValues: CustomOperationalNeedFormType = {
    nameOther: data?.operationalNeed.nameOther ?? ''
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Expire delay={10000}>{message}</Expire>

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {isUpdating
              ? t('updateThisOpertationalNeed')
              : t('addOpertationalNeed')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4 margin-bottom-6">
            {t('addOpertationalNeedInfo')}
          </p>

          <Grid tablet={{ col: 8 }}>
            <Alert slim type="info">
              {t('noDuplicates')}
            </Alert>

            <Formik
              initialValues={initialValues}
              onSubmit={values => handleFormSubmit(values)}
              enableReinitialize
              innerRef={formikRef}
            >
              {(formikProps: FormikProps<CustomOperationalNeedFormType>) => {
                const { errors, dirty, handleSubmit, values } = formikProps;

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
                      data-testid="it-solutions-add-custom-operational-need"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset>
                        <FieldGroup
                          scrollElement="nameOther"
                          error={!!flatErrors.nameOther}
                          className="margin-top-3"
                        >
                          <Label htmlFor="it-solution-custom-name-other">
                            {t('customOperationalNeedName')}
                            <RequiredAsterisk />
                          </Label>

                          <FieldErrorMsg>{flatErrors.nameOther}</FieldErrorMsg>

                          <Field
                            as={TextInput}
                            error={!!flatErrors.nameOther}
                            id="it-solution-custom-name-other"
                            data-testid="it-solution-custom-name-other"
                            maxLength={50}
                            name="nameOther"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
                          {isUpdating ? (
                            <Button
                              type="submit"
                              id="submit-custom-solution"
                              disabled={!dirty}
                            >
                              {t('update')}
                            </Button>
                          ) : (
                            <>
                              {/* Saves, does not add solution, and returns to tracker */}
                              <Button
                                type="button"
                                id=""
                                disabled={!values.nameOther}
                                outline
                                onClick={() =>
                                  handleFormSubmit(values, 'it-tracker')
                                }
                              >
                                {t('saveWithoutAdding')}
                              </Button>
                              {/* Saves and continues to add solution */}
                              <Button
                                type="submit"
                                id="submit-custom-solution"
                                disabled={!values.nameOther}
                              >
                                {t('continue')}
                              </Button>
                            </>
                          )}
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
                          {t('dontAddandReturnToTracker')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          {/* to pass down remove operational need to sidebar */}
          <ITSolutionsSidebar
            modelID={modelID}
            renderTextFor="need"
            operationalNeed={data?.operationalNeed}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AddOrUpdateOperationalNeed;

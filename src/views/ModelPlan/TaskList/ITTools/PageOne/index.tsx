import React, { useContext, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import ITToolsSummary from 'components/ITToolsSummary';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetITToolsPageOne from 'queries/ITTools/GetITToolsPageOne';
import {
  GetITToolPageOne as GetITToolsPageOneType,
  GetITToolPageOne_modelPlan as ModelPlanType,
  GetITToolPageOne_modelPlan_generalCharacteristics as GeneralCharacteristicsType,
  GetITToolPageOne_modelPlan_itTools as ITToolsPageOneFormType,
  GetITToolPageOneVariables
} from 'queries/ITTools/types/GetITToolPageOne';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  GcCollectBidsType,
  GcPartCDType,
  GcUpdateContractType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  translateBoolean,
  translateGcCollectBidsType,
  translateGcPartCDType,
  translateGcUpdateContractType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';
import {
  findLockedSection,
  LockStatus,
  taskListSectionMap
} from 'views/SubscriptionHandler';
import { SubscriptionContext } from 'views/SubscriptionWrapper';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageOneFormType = {
  __typename: 'PlanITTools',
  id: '',
  gcPartCD: [],
  gcPartCDOther: '',
  gcPartCDNote: '',
  gcCollectBids: [],
  gcCollectBidsOther: '',
  gcCollectBidsNote: '',
  gcUpdateContract: [],
  gcUpdateContractOther: '',
  gcUpdateContractNote: ''
};

const initialCharacteristicValues: GeneralCharacteristicsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '',
  managePartCDEnrollment: null,
  collectPlanBids: null,
  planContactUpdated: null
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  generalCharacteristics: initialCharacteristicValues,
  itTools: initialFormValues
};

const ITToolsPageOne = () => {
  const { t } = useTranslation('itTools');
  const { t: c } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const formikRef = useRef<FormikProps<ITToolsPageOneFormType>>(null);
  const history = useHistory();

  const { taskListSectionLocks } = useContext(SubscriptionContext);
  // console.log(taskListSectionLocks);

  const { data, loading, error } = useQuery<
    GetITToolsPageOneType,
    GetITToolPageOneVariables
  >(GetITToolsPageOne, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    generalCharacteristics: {
      managePartCDEnrollment,
      collectPlanBids,
      planContactUpdated
    }
  } = modelPlan;

  // Identified the lock status of the relevant IT tools page
  const characteristicsLock: LockStatus = findLockedSection(
    taskListSectionLocks,
    taskListSectionMap.characteristics
  );

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean = managePartCDEnrollment === true;
  const questionTwoNeedsTools: boolean = collectPlanBids === true;
  const questionThreeNeedsTools: boolean = planContactUpdated === true;

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageOneFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id, __typename, ...changes } = formikValues;
    update({
      variables: {
        id,
        changes
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/it-tools/page-two`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  if ((!loading && error) || (!loading && !modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {t('subheading')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={itTools}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ITToolsPageOneFormType>) => {
          const { errors, handleSubmit, setErrors, values } = formikProps;
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

              <Grid row gap>
                <Grid desktop={{ col: 6 }}>
                  <Form
                    className="margin-top-6"
                    data-testid="it-tools-page-one-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{c('heading')}</h2>

                    <Fieldset disabled={loading}>
                      {/* Question One: Will you manage Part C/D enrollment? */}

                      <FieldGroup
                        scrollElement="gcPartCD"
                        error={!!flatErrors.gcPartCD}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('partCDTools')}
                        </legend>
                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('partCDToolsInfo')}
                        </p>
                        <FieldErrorMsg>{flatErrors.gcPartCD}</FieldErrorMsg>

                        <ITToolsSummary
                          question={c('manageEnrollment')}
                          answers={[
                            translateBoolean(managePartCDEnrollment || false)
                          ]}
                          redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
                          answered={managePartCDEnrollment !== null}
                          needsTool={questionOneNeedsTools}
                          subtext={t('yesNeedsAnswer')}
                          locked={characteristicsLock}
                          scrollElememnt="managePartCDEnrollment"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.gcPartCD}
                          fieldName="gcPartCD"
                          needsTool={questionOneNeedsTools}
                          htmlID="gc-partc"
                          EnumType={GcPartCDType}
                          translation={translateGcPartCDType}
                        />
                      </FieldGroup>

                      {/* Question Two: Will you review and collect plan bids? */}

                      <FieldGroup
                        scrollElement="gcCollectBids"
                        error={!!flatErrors.gcCollectBids}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('collectBidsTools')}
                        </legend>

                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('partCDToolsInfo')}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors.gcCollectBids}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={c('reviewPlanBids')}
                          answers={[translateBoolean(collectPlanBids || false)]}
                          redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
                          answered={collectPlanBids !== null}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('yesNeedsAnswer')}
                          locked={characteristicsLock}
                          scrollElememnt="collectPlanBids"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.gcCollectBids}
                          fieldName="gcCollectBids"
                          needsTool={questionTwoNeedsTools}
                          htmlID="gc-collect-bids"
                          EnumType={GcCollectBidsType}
                          translation={translateGcCollectBidsType}
                        />
                      </FieldGroup>

                      {/* Question Three: Have you updated the plan’s contact? */}

                      <FieldGroup
                        scrollElement="gcUpdateContract"
                        error={!!flatErrors.gcUpdateContract}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('updateContract')}
                        </legend>
                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('partCDToolsInfo')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.planContactUpdated}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={c('updatedContact')}
                          answers={[
                            translateBoolean(planContactUpdated || false)
                          ]}
                          redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
                          answered={planContactUpdated !== null}
                          needsTool={questionThreeNeedsTools}
                          subtext={t('yesNeedsAnswer')}
                          locked={characteristicsLock}
                          scrollElememnt="planContactUpdated"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.gcUpdateContract}
                          fieldName="gcUpdateContract"
                          needsTool={questionThreeNeedsTools}
                          htmlID="gc-update-contract"
                          EnumType={GcUpdateContractType}
                          translation={translateGcUpdateContractType}
                        />
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button type="submit" onClick={() => setErrors({})}>
                          {h('next')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit(values, 'task-list')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Fieldset>
                  </Form>
                </Grid>
              </Grid>

              {itTools.id && !loading && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={1} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageOne;

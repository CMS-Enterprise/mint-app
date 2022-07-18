import React, { useRef } from 'react';
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
import GetITToolsPageTwo from 'queries/ITTools/GetITToolsPageTwo';
import {
  GetITToolPageTwo as GetITToolPageTwoType,
  GetITToolPageTwo_modelPlan as ModelPlanType,
  GetITToolPageTwo_modelPlan_itTools as ITToolsPageTwoFormType,
  GetITToolPageTwo_modelPlan_participantsAndProviders as ParticipantsAndProvidersType,
  GetITToolPageTwoVariables
} from 'queries/ITTools/types/GetITToolPageTwo';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  ParticipantSelectionType,
  PpAppSupportContractorType,
  PpCollectScoreReviewType,
  PpToAdvertiseType,
  RecruitmentType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateParticipantSelectiontType,
  translatePpAppSupportContractorType,
  translatePpCollectScoreReviewType,
  translatePpToAdvertiseType,
  translateRecruitmentType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { ITToolsFormComponent } from '..';

const initialFormValues: ITToolsPageTwoFormType = {
  __typename: 'PlanITTools',
  id: '',
  ppToAdvertise: [],
  ppToAdvertiseOther: '',
  ppToAdvertiseNote: '',
  ppCollectScoreReview: [],
  ppCollectScoreReviewOther: '',
  ppCollectScoreReviewNote: '',
  ppAppSupportContractor: [],
  ppAppSupportContractorOther: '',
  ppAppSupportContractorNote: ''
};

const initialParticipantsAndProvidersValues: ParticipantsAndProvidersType = {
  __typename: 'PlanParticipantsAndProviders',
  id: '',
  selectionMethod: [],
  recruitmentMethod: null
};

const initialModelPlanValues: ModelPlanType = {
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  participantsAndProviders: initialParticipantsAndProvidersValues,
  itTools: initialFormValues
};

const ITToolsPageTwo = () => {
  const { t } = useTranslation('itTools');
  const { t: p } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const formikRef = useRef<FormikProps<ITToolsPageTwoFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageTwoType,
    GetITToolPageTwoVariables
  >(GetITToolsPageTwo, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || initialModelPlanValues;

  const {
    modelName,
    itTools,
    participantsAndProviders: { recruitmentMethod, selectionMethod }
  } = modelPlan;

  /**
   * Identifying if each question requires tooling as well as rending answers
   * Checkbox answers will not be checked despite a store truthy boolean
   * 'Specify other' answer will not be rendered even if OTHER value is true
   */
  const questionOneNeedsTools: boolean =
    recruitmentMethod === RecruitmentType.LOI ||
    recruitmentMethod === RecruitmentType.NOFO;

  const questionTwoNeedsTools: boolean = selectionMethod.includes(
    ParticipantSelectionType.APPLICATION_REVIEW_AND_SCORING_TOOL
  );

  const questionThreeNeedsTools: boolean = selectionMethod.includes(
    ParticipantSelectionType.APPLICATION_SUPPORT_CONTRACTOR
  );

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageTwoFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-three`);
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/it-tools/page-one`);
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
        {(formikProps: FormikProps<ITToolsPageTwoFormType>) => {
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
                    data-testid="oit-tools-page-two-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{p('heading')}</h2>

                    <Fieldset disabled={loading}>
                      {/* Question One: How will you recruit the participants? */}
                      <FieldGroup
                        scrollElement="ppToAdvertise"
                        error={!!flatErrors.ppToAdvertise}
                        className="margin-y-0"
                      >
                        <legend className="usa-label">
                          {t('advertiseModel')}
                        </legend>

                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('advertiseModelInfo')}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors.ppToAdvertise}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('recruitParticipants')}
                          answers={[
                            translateRecruitmentType(recruitmentMethod || '')
                          ]}
                          redirect={`/models/${modelID}/task-list/participants-and-providers/participants-options`}
                          answered={recruitmentMethod !== null}
                          needsTool={questionOneNeedsTools}
                          subtext={t('loiNeedsAnswer')}
                          scrollElememnt="recruitmentMethod"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.ppToAdvertise}
                          fieldName="ppToAdvertise"
                          subinfo={t('ppToAdvertiseInfo')}
                          needsTool={questionOneNeedsTools}
                          htmlID="pp-to-advertise"
                          EnumType={PpToAdvertiseType}
                          translation={translatePpToAdvertiseType}
                        />
                      </FieldGroup>

                      {/* Question Two: How will you select participants? */}

                      <FieldGroup
                        scrollElement="ppCollectScoreReview"
                        error={!!flatErrors.ppCollectScoreReview}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('collectTools')}
                        </legend>

                        <FieldErrorMsg>
                          {flatErrors.ppCollectScoreReview}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('howWillYouSelect')}
                          answers={[...selectionMethod]
                            .sort(sortOtherEnum)
                            .map(selection =>
                              translateParticipantSelectiontType(selection)
                            )}
                          redirect={`/models/${modelID}/task-list/participants-and-providers/participants-options`}
                          answered={selectionMethod.length > 0}
                          needsTool={questionTwoNeedsTools}
                          subtext={t('scoringToolNeedsAnswer')}
                          scrollElememnt="selectionMethod"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.ppCollectScoreReview}
                          fieldName="ppCollectScoreReview"
                          needsTool={questionTwoNeedsTools}
                          htmlID="pp-collect-score-review"
                          EnumType={PpCollectScoreReviewType}
                          translation={translatePpCollectScoreReviewType}
                        />
                      </FieldGroup>

                      {/* Question Three: How will you select participants? */}

                      <FieldGroup
                        scrollElement="ppAppSupportContractor"
                        error={!!flatErrors.ppAppSupportContractor}
                        className="margin-y-0"
                      >
                        <legend className="usa-label maxw-none">
                          {t('appSupport')}
                        </legend>

                        <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                          {t('appSupportInfo')}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors.ppAppSupportContractor}
                        </FieldErrorMsg>

                        <ITToolsSummary
                          question={p('howWillYouSelect')}
                          answers={[...selectionMethod]
                            .sort(sortOtherEnum)
                            .map(selection =>
                              translateParticipantSelectiontType(selection)
                            )}
                          redirect={`/models/${modelID}/task-list/participants-and-providers/participants-options`}
                          answered={selectionMethod.length > 0}
                          needsTool={questionThreeNeedsTools}
                          subtext={t('contractorNeedsAnswer')}
                          scrollElememnt="selectionMethod"
                        />

                        <ITToolsFormComponent
                          flatErrors={flatErrors}
                          formikValue={values.ppAppSupportContractor}
                          fieldName="ppAppSupportContractor"
                          needsTool={questionThreeNeedsTools}
                          htmlID="pp-app-support-contractor"
                          EnumType={PpAppSupportContractorType}
                          translation={translatePpAppSupportContractorType}
                        />
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="button"
                          className="usa-button usa-button--outline margin-bottom-1"
                          onClick={() => {
                            handleFormSubmit(values, 'back');
                          }}
                        >
                          {h('back')}
                        </Button>
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
      <PageNumber currentPage={2} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageTwo;

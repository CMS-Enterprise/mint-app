import React, { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsSummary from 'components/ITToolsSummary';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetITToolsPageTwo from 'queries/ITTools/GetITToolsPageTwo';
import {
  GetITToolPageTwo as GetITToolPageTwoType,
  GetITToolPageTwo_modelPlan_itTools as ITToolsPageTwoFormType,
  GetITToolPageTwo_modelPlan_participantsAndProviders as ParticipantsAndProvidersFormType,
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
  translatePpToAdvertiseType,
  translateRecruitmentType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

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

  const {
    id,
    ppToAdvertise,
    ppToAdvertiseOther,
    ppToAdvertiseNote,
    ppCollectScoreReview,
    ppCollectScoreReviewOther,
    ppCollectScoreReviewNote,
    ppAppSupportContractor,
    ppAppSupportContractorOther,
    ppAppSupportContractorNote
  } = data?.modelPlan?.itTools || ({} as ITToolsPageTwoFormType);

  const participantsAndProviders =
    data?.modelPlan?.participantsAndProviders ||
    ({} as ParticipantsAndProvidersFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageTwoFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: changeValues
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

  const initialValues: ITToolsPageTwoFormType = {
    __typename: 'PlanITTools',
    id: id ?? '',
    ppToAdvertise: ppToAdvertise ?? [],
    ppToAdvertiseOther: ppToAdvertiseOther ?? '',
    ppToAdvertiseNote: ppToAdvertiseNote ?? '',
    ppCollectScoreReview: ppCollectScoreReview ?? [],
    ppCollectScoreReviewOther: ppCollectScoreReviewOther ?? '',
    ppCollectScoreReviewNote: ppCollectScoreReviewNote ?? '',
    ppAppSupportContractor: ppAppSupportContractor ?? [],
    ppAppSupportContractorOther: ppAppSupportContractorOther ?? '',
    ppAppSupportContractorNote: ppAppSupportContractorNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
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
        initialValues={initialValues}
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

                    <FieldGroup
                      scrollElement="ppToAdvertise"
                      error={!!flatErrors.ppToAdvertise}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="ppToAdvertise"
                        render={arrayHelpers => (
                          <>
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
                                translateRecruitmentType(
                                  participantsAndProviders.recruitmentMethod ||
                                    ''
                                )
                              ]}
                              options={Object.keys(RecruitmentType).map(key =>
                                translateRecruitmentType(key)
                              )}
                              redirect={`/models/${modelID}/task-list/participants-and-providers/participants-options`}
                              answered={
                                participantsAndProviders.recruitmentMethod !==
                                null
                              }
                              needsTool={
                                participantsAndProviders.recruitmentMethod ===
                                  RecruitmentType.LOI ||
                                participantsAndProviders.recruitmentMethod ===
                                  RecruitmentType.NOFO
                              }
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            <p className="text-base">
                              {t('ppToAdvertiseInfo')}
                            </p>

                            {Object.keys(PpToAdvertiseType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        participantsAndProviders.recruitmentMethod !==
                                          RecruitmentType.NOFO &&
                                        participantsAndProviders.recruitmentMethod !==
                                          RecruitmentType.LOI
                                      }
                                      id={`it-tools-gc-pp-to-advertise-${type}`}
                                      name="ppToAdvertise"
                                      label={translatePpToAdvertiseType(type)}
                                      value={type}
                                      checked={values?.ppToAdvertise.includes(
                                        type as PpToAdvertiseType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.ppToAdvertise.indexOf(
                                            e.target.value as PpToAdvertiseType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type === PpToAdvertiseType.OTHER &&
                                      values.ppToAdvertise.includes(type) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-gc-pp-to-advertise-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {flatErrors.ppToAdvertiseOther}
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={
                                              participantsAndProviders.recruitmentMethod !==
                                                RecruitmentType.NOFO &&
                                              participantsAndProviders.recruitmentMethod !==
                                                RecruitmentType.LOI
                                            }
                                            className="maxw-none"
                                            id="it-tools-gc-pp-to-advertise-other"
                                            maxLength={50}
                                            name="ppToAdvertiseOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-gc-pp-to-advertise-note"
                              field="ppToAdvertiseDNote"
                            />
                          </>
                        )}
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
                  </Form>
                </Grid>
              </Grid>

              {id && (
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

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
import GetITToolsPageThree from 'queries/ITTools/GetITToolsPageThree';
import {
  GetITToolPageThree as GetITToolPageThreeType,
  GetITToolPageThree_modelPlan_itTools as ITToolsPageThreeFormType,
  GetITToolPageThree_modelPlan_participantsAndProviders as ParticipantsAndProvidersFormType,
  GetITToolPageThreeVariables
} from 'queries/ITTools/types/GetITToolPageThree';
import { UpdatePlanItToolsVariables } from 'queries/ITTools/types/UpdatePlanItTools';
import UpdatePlanITTools from 'queries/ITTools/UpdatePlanItTools';
import {
  BManageBeneficiaryOverlapType,
  ParticipantCommunicationType,
  PpCommunicateWithParticipantType,
  PpManageProviderOverlapType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateBManageBeneficiaryOverlapType,
  translateCommunicationType,
  translatePpCommunicateWithParticipantType,
  translatePpManageProviderOverlapType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const ITToolsPageThree = () => {
  const { t } = useTranslation('itTools');
  const { t: p } = useTranslation('participantsAndProviders');
  const { t: b } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ITToolsPageThreeFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetITToolPageThreeType,
    GetITToolPageThreeVariables
  >(GetITToolsPageThree, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    ppCommunicateWithParticipant,
    ppCommunicateWithParticipantOther,
    ppCommunicateWithParticipantNote,
    ppManageProviderOverlap,
    ppManageProviderOverlapOther,
    ppManageProviderOverlapNote,
    bManageBeneficiaryOverlap,
    bManageBeneficiaryOverlapOther,
    bManageBeneficiaryOverlapNote
  } = data?.modelPlan?.itTools || ({} as ITToolsPageThreeFormType);

  const { communicationMethod = [] } =
    data?.modelPlan?.participantsAndProviders ||
    ({} as ParticipantsAndProvidersFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanItToolsVariables>(UpdatePlanITTools);

  const handleFormSubmit = (
    formikValues: ITToolsPageThreeFormType,
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
            history.push(`/models/${modelID}/task-list/it-tools/page-four`);
          } else if (redirect === 'back') {
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

  const initialValues: ITToolsPageThreeFormType = {
    __typename: 'PlanITTools',
    id: id ?? '',
    ppCommunicateWithParticipant: ppCommunicateWithParticipant ?? [],
    ppCommunicateWithParticipantOther: ppCommunicateWithParticipantOther ?? '',
    ppCommunicateWithParticipantNote: ppCommunicateWithParticipantNote ?? '',
    ppManageProviderOverlap: ppManageProviderOverlap ?? [],
    ppManageProviderOverlapOther: ppManageProviderOverlapOther ?? '',
    ppManageProviderOverlapNote: ppManageProviderOverlapNote ?? '',
    bManageBeneficiaryOverlap: bManageBeneficiaryOverlap ?? [],
    bManageBeneficiaryOverlapOther: bManageBeneficiaryOverlapOther ?? '',
    bManageBeneficiaryOverlapNote: bManageBeneficiaryOverlapNote ?? ''
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
        {(formikProps: FormikProps<ITToolsPageThreeFormType>) => {
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
                    data-testid="oit-tools-page-three-form"
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <h2>{p('heading')}</h2>

                    <FieldGroup
                      scrollElement="ppCommunicateWithParticipant"
                      error={!!flatErrors.ppCommunicateWithParticipant}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="ppCommunicateWithParticipant"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('communicateTools')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.ppCommunicateWithParticipant}
                            </FieldErrorMsg>

                            <ITToolsSummary
                              question={p('participantCommunication')}
                              answers={[...communicationMethod]
                                .sort(sortOtherEnum)
                                .map(selection =>
                                  translateCommunicationType(selection)
                                )}
                              options={[
                                translateCommunicationType(
                                  ParticipantCommunicationType.MASS_EMAIL
                                ),
                                translateCommunicationType(
                                  ParticipantCommunicationType.IT_TOOL
                                )
                              ]}
                              redirect={`/models/${modelID}/task-list/participants-and-providers/communication`}
                              answered={communicationMethod.length > 0}
                              needsTool={
                                communicationMethod.includes(
                                  ParticipantCommunicationType.MASS_EMAIL
                                ) ||
                                communicationMethod.includes(
                                  ParticipantCommunicationType.IT_TOOL
                                )
                              }
                            />

                            <p className="margin-top-4">{t('tools')}</p>

                            {Object.keys(PpCommunicateWithParticipantType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      disabled={
                                        !communicationMethod.includes(
                                          ParticipantCommunicationType.MASS_EMAIL
                                        ) &&
                                        !communicationMethod.includes(
                                          ParticipantCommunicationType.IT_TOOL
                                        )
                                      }
                                      id={`it-tools-pp-communicate-with-participant-${type}`}
                                      name="ppCommunicateWithParticipant"
                                      label={translatePpCommunicateWithParticipantType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.ppCommunicateWithParticipant.includes(
                                        type as PpCommunicateWithParticipantType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.ppCommunicateWithParticipant.indexOf(
                                            e.target
                                              .value as PpCommunicateWithParticipantType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      PpCommunicateWithParticipantType.OTHER &&
                                      values.ppCommunicateWithParticipant.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-pp-communicate-with-participant-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.ppCommunicateWithParticipantOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            disabled={
                                              !communicationMethod.includes(
                                                ParticipantCommunicationType.MASS_EMAIL
                                              ) &&
                                              !communicationMethod.includes(
                                                ParticipantCommunicationType.IT_TOOL
                                              )
                                            }
                                            className="maxw-none"
                                            id="it-tools-pp-communicate-with-participant-other"
                                            maxLength={50}
                                            name="ppCommunicateWithParticipantOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-pp-communicate-with-participant-note"
                              field="ppCommunicateWithParticipantNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="ppManageProviderOverlap"
                      error={!!flatErrors.ppManageProviderOverlap}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="ppManageProviderOverlap"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('manageOverlap')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.ppManageProviderOverlap}
                            </FieldErrorMsg>

                            <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                              {t('manageOverlapInfo')}
                            </p>

                            <p className="margin-top-2">{t('tools')}</p>

                            {Object.keys(PpManageProviderOverlapType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      id={`it-tools-pp-provider-overlap-${type}`}
                                      name="ppManageProviderOverlap"
                                      label={translatePpManageProviderOverlapType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.ppManageProviderOverlap.includes(
                                        type as PpManageProviderOverlapType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.ppManageProviderOverlap.indexOf(
                                            e.target
                                              .value as PpManageProviderOverlapType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      PpManageProviderOverlapType.OTHER &&
                                      values.ppManageProviderOverlap.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-pp-provider-overlap-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.ppManageProviderOverlapOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            className="maxw-none"
                                            id="it-tools-pp-provider-overlap-other"
                                            maxLength={50}
                                            name="ppManageProviderOverlapOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-pp-provider-overlap-note"
                              field="ppManageProviderOverlapNote"
                            />
                          </>
                        )}
                      />
                    </FieldGroup>

                    <h2>{b('heading')}</h2>

                    <FieldGroup
                      scrollElement="bManageBeneficiaryOverlap"
                      error={!!flatErrors.bManageBeneficiaryOverlap}
                      className="margin-y-4"
                    >
                      <FieldArray
                        name="bManageBeneficiaryOverlap"
                        render={arrayHelpers => (
                          <>
                            <legend className="usa-label maxw-none">
                              {t('beneficiaryOverlaps')}
                            </legend>

                            <FieldErrorMsg>
                              {flatErrors.bManageBeneficiaryOverlap}
                            </FieldErrorMsg>

                            <p className="text-base margin-top-1 margin-bottom-3 line-height-body-3">
                              {t('beneficiaryOverlapsInfo')}
                            </p>

                            <p className="margin-top-2">{t('tools')}</p>

                            {Object.keys(BManageBeneficiaryOverlapType)
                              .sort(sortOtherEnum)
                              .map(type => {
                                return (
                                  <Fragment key={type}>
                                    <Field
                                      as={CheckboxField}
                                      id={`it-tools-b-beneficiary-overlap-${type}`}
                                      name="bManageBeneficiaryOverlap"
                                      label={translateBManageBeneficiaryOverlapType(
                                        type
                                      )}
                                      value={type}
                                      checked={values?.bManageBeneficiaryOverlap.includes(
                                        type as BManageBeneficiaryOverlapType
                                      )}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(e.target.value);
                                        } else {
                                          const idx = values.bManageBeneficiaryOverlap.indexOf(
                                            e.target
                                              .value as BManageBeneficiaryOverlapType
                                          );
                                          arrayHelpers.remove(idx);
                                        }
                                      }}
                                    />
                                    {type ===
                                      BManageBeneficiaryOverlapType.OTHER &&
                                      values.bManageBeneficiaryOverlap.includes(
                                        type
                                      ) && (
                                        <div className="margin-left-4 margin-top-1">
                                          <Label
                                            htmlFor="it-tools-b-beneficiary-overlap-other"
                                            className="text-normal"
                                          >
                                            {h('pleaseSpecify')}
                                          </Label>
                                          <FieldErrorMsg>
                                            {
                                              flatErrors.bManageBeneficiaryOverlapOther
                                            }
                                          </FieldErrorMsg>
                                          <Field
                                            as={TextInput}
                                            className="maxw-none"
                                            id="it-tools-b-beneficiary-overlap-other"
                                            maxLength={50}
                                            name="bManageBeneficiaryOverlapOther"
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                );
                              })}
                            <AddNote
                              id="it-tools-b-beneficiary-overlap-note"
                              field="bManageBeneficiaryOverlapNote"
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
      <PageNumber currentPage={3} totalPages={9} className="margin-y-6" />
    </>
  );
};

export default ITToolsPageThree;

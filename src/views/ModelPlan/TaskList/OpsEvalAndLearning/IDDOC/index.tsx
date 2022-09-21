import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  DatePicker,
  Fieldset,
  IconArrowBack,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import DatePickerWarning from 'components/shared/DatePickerWarning';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetIDDOC from 'queries/OpsEvalAndLearning/GetIDDOC';
import {
  GetIDDOC as GetIDDOCType,
  GetIDDOC_modelPlan_opsEvalAndLearning as IDDOCFormType,
  GetIDDOCVariables
} from 'queries/OpsEvalAndLearning/types/GetIDDOC';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import { isCCWInvolvement, renderCurrentPage, renderTotalPages } from '..';

const IDDOC = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();
  const [dateInPast, setDateInPast] = useState(false);

  const formikRef = useRef<FormikProps<IDDOCFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<GetIDDOCType, GetIDDOCVariables>(
    GetIDDOC,
    {
      variables: {
        id: modelID
      }
    }
  );

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    technicalContactsIdentified,
    technicalContactsIdentifiedDetail,
    technicalContactsIdentifiedNote,
    captureParticipantInfo,
    captureParticipantInfoNote,
    icdOwner,
    draftIcdDueDate,
    icdNote
  } = data?.modelPlan?.opsEvalAndLearning || ({} as IDDOCFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (
    formikValues: IDDOCFormType,
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
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/iddoc-testing`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/ops-eval-and-learning`);
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  useEffect(() => {
    if (draftIcdDueDate && new Date() > new Date(draftIcdDueDate)) {
      setDateInPast(true);
    } else {
      setDateInPast(false);
    }
  }, [draftIcdDueDate]);

  const initialValues: IDDOCFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    iddocSupport: iddocSupport ?? null,
    technicalContactsIdentified: technicalContactsIdentified ?? null,
    technicalContactsIdentifiedDetail: technicalContactsIdentifiedDetail ?? '',
    technicalContactsIdentifiedNote: technicalContactsIdentifiedNote ?? '',
    captureParticipantInfo: captureParticipantInfo ?? null,
    captureParticipantInfoNote: captureParticipantInfoNote ?? '',
    icdOwner: icdOwner ?? '',
    draftIcdDueDate: draftIcdDueDate ?? null,
    icdNote: icdNote ?? ''
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
        {h('for')} {modelName}
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
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
        {(formikProps: FormikProps<IDDOCFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            values,
            setFieldError
          } = formikProps;
          const flatErrors = flattenErrors(errors);

          const handleOnBlur = (
            e: React.ChangeEvent<HTMLInputElement>,
            field: string
          ) => {
            if (e.target.value === '') {
              setFieldValue(field, null);
              if (e.target.id !== '') {
                setDateInPast(false);
              }
              return;
            }
            try {
              setFieldValue(field, new Date(e.target.value).toISOString());
              if (new Date() > new Date(e.target.value)) {
                setDateInPast(true);
              } else {
                setDateInPast(false);
              }
              delete errors[field as keyof IDDOCFormType];
            } catch (err) {
              setFieldError(field, t('validDate'));
            }
          };

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
                className="tablet:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-iddoc-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <h3>{t('iddocHeading')}</h3>
                <FieldGroup
                  scrollElement="technicalContactsIdentified"
                  error={!!flatErrors.technicalContactsIdentified}
                  className="margin-y-4 margin-bottom-8"
                >
                  <Label htmlFor="ops-eval-and-learning-technical-contacts-identified-use">
                    {t('technicalContacts')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.technicalContactsIdentified}
                  </FieldErrorMsg>

                  <Fieldset>
                    {[true, false].map(key => (
                      <Fragment key={key.toString()}>
                        <Field
                          as={Radio}
                          id={`ops-eval-and-learning-technical-contacts-identified-use-${key}`}
                          name="technicalContactsIdentified"
                          label={key ? h('yes') : h('no')}
                          value={key ? 'YES' : 'NO'}
                          checked={values.technicalContactsIdentified === key}
                          onChange={() => {
                            setFieldValue('technicalContactsIdentified', key);
                          }}
                        />
                        {values.technicalContactsIdentified === true &&
                          key === true && (
                            <div className="margin-left-4 margin-top-1">
                              <Label
                                htmlFor="ops-eval-and-learning-technical-contacts-identified-detail"
                                className="text-normal"
                              >
                                {h('pleaseSpecify')}
                              </Label>
                              <FieldErrorMsg>
                                {flatErrors.technicalContactsIdentifiedDetail}
                              </FieldErrorMsg>
                              <Field
                                as={TextInput}
                                id="ops-eval-and-learning-technical-contacts-identified-detail"
                                maxLength={50}
                                name="technicalContactsIdentifiedDetail"
                              />
                            </div>
                          )}
                      </Fragment>
                    ))}
                  </Fieldset>

                  <AddNote
                    id="ops-eval-and-learning-technical-contacts-identified-use-note"
                    field="technicalContactsIdentifiedNote"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="captureParticipantInfo"
                  error={!!flatErrors.captureParticipantInfo}
                  className="margin-y-4 margin-bottom-8"
                >
                  <Label htmlFor="ops-eval-and-learning-capture-participant-info">
                    {t('participantInformation')}
                  </Label>
                  <p className="text-base margin-bottom-1 margin-top-1">
                    {t('participantInformationInfo')}
                  </p>
                  <FieldErrorMsg>
                    {flatErrors.captureParticipantInfo}
                  </FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="ops-eval-and-learning-capture-participant-info"
                      name="captureParticipantInfo"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.captureParticipantInfo === true}
                      onChange={() => {
                        setFieldValue('captureParticipantInfo', true);
                      }}
                    />
                    <Field
                      as={Radio}
                      id="ops-eval-and-learning-capture-participant-info-no"
                      name="captureParticipantInfo"
                      label={h('no')}
                      value="FALSE"
                      checked={values.captureParticipantInfo === false}
                      onChange={() => {
                        setFieldValue('captureParticipantInfo', false);
                      }}
                    />
                  </Fieldset>

                  <AddNote
                    id="ops-eval-and-learning-capture-participant-info-note"
                    field="captureParticipantInfoNote"
                  />
                </FieldGroup>

                <h3>{t('icdHeading')}</h3>

                <p className="margin-y-1 margin-top-2 line-height-body-4">
                  {t('icdSubheading')}
                </p>

                <FieldGroup
                  scrollElement="icdOwner"
                  className="margin-top-4"
                  error={!!flatErrors.icdOwner}
                >
                  <Label htmlFor="ops-eval-and-learning-capture-icd-owner">
                    {t('icdOwner')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.icdOwner}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors.icdOwner}
                    id="ops-eval-and-learning-capture-icd-owner"
                    data-testid="ops-eval-and-learning-capture-icd-owner"
                    maxLength={50}
                    name="icdOwner"
                  />
                </FieldGroup>

                {!loading && (
                  <FieldGroup
                    scrollElement="draftIcdDueDate"
                    error={!!flatErrors.draftIcdDueDate}
                    className="margin-top-6 width-half"
                  >
                    <label
                      htmlFor="ops-eval-and-learning-icd-due-date"
                      className="text-bold"
                    >
                      {t('draftIDC')}
                    </label>
                    <div className="usa-hint margin-y-1">
                      {h('datePlaceholder')}
                    </div>
                    <FieldErrorMsg>{flatErrors.draftIcdDueDate}</FieldErrorMsg>
                    <div className="width-card-lg position-relative">
                      <Field
                        as={DatePicker}
                        error={+!!flatErrors.draftIcdDueDate}
                        id="ops-eval-and-learning-icd-due-date"
                        maxLength={50}
                        name="draftIcdDueDate"
                        defaultValue={draftIcdDueDate}
                        onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleOnBlur(e, 'draftIcdDueDate');
                        }}
                      />
                      {dateInPast && (
                        <DatePickerWarning label={h('dateWarning')} />
                      )}
                    </div>

                    {dateInPast && (
                      <Alert type="warning" className="margin-top-4">
                        {h('dateWarning')}
                      </Alert>
                    )}

                    <AddNote
                      id="ops-eval-and-learning-icd-due-date-note"
                      field="icdNote"
                    />
                  </FieldGroup>
                )}

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
      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            2,
            iddocSupport,
            isCCWInvolvement(ccmInvolvment)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default IDDOC;

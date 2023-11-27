import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useUpdatePlanOpsEvalAndLearningMutation } from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import MINTDatePicker from 'components/shared/DatePicker';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import GetIDDOC from 'queries/OpsEvalAndLearning/GetIDDOC';
import {
  GetIDDOC as GetIDDOCType,
  GetIDDOC_modelPlan_opsEvalAndLearning as IDDOCFormType,
  GetIDDOCVariables
} from 'queries/OpsEvalAndLearning/types/GetIDDOC';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const IDDOC = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    technicalContactsIdentified: technicalContactsIdentifiedConfig,
    captureParticipantInfo: captureParticipantInfoConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

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
    dataNeededForMonitoring,
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

  const [update] = useUpdatePlanOpsEvalAndLearningMutation();

  const handleFormSubmit = (redirect?: 'next' | 'back' | 'task-list') => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
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

  const initialValues: IDDOCFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
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
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{opsEvalAndLearningMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {opsEvalAndLearningMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          handleFormSubmit('next');
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
              return;
            }
            try {
              setFieldValue(field, new Date(e.target.value).toISOString());
              delete errors[field as keyof IDDOCFormType];
            } catch (err) {
              setFieldError(field, opsEvalAndLearningT('validDate'));
            }
          };

          return (
            <>
              {getKeys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {getKeys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={`${key}`}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-iddoc-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <h3>{opsEvalAndLearningMiscT('iddocHeading')}</h3>

                  <FieldGroup
                    scrollElement="technicalContactsIdentified"
                    error={!!flatErrors.technicalContactsIdentified}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="ops-eval-and-learning-technical-contacts-identified-use">
                      {opsEvalAndLearningT('technicalContactsIdentified.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.technicalContactsIdentified}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="technicalContactsIdentified"
                      id="ops-eval-and-learning-technical-contacts-identified-use"
                      value={values.technicalContactsIdentified}
                      setFieldValue={setFieldValue}
                      options={technicalContactsIdentifiedConfig.options}
                      childName="technicalContactsIdentifiedDetail"
                    >
                      {values.technicalContactsIdentified === true ? (
                        <div className="margin-left-4 margin-top-1">
                          <Label
                            htmlFor="ops-eval-and-learning-technical-contacts-identified-detail"
                            className="text-normal"
                          >
                            {opsEvalAndLearningT(
                              'technicalContactsIdentifiedDetail.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.technicalContactsIdentifiedDetail}
                          </FieldErrorMsg>

                          <Field
                            as={TextAreaField}
                            id="ops-eval-and-learning-technical-contacts-identified-detail"
                            maxLength={5000}
                            className="mint-textarea"
                            name="technicalContactsIdentifiedDetail"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>

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
                      {opsEvalAndLearningT('captureParticipantInfo.label')}
                    </Label>

                    <p className="text-base margin-bottom-1 margin-top-1">
                      {opsEvalAndLearningT('captureParticipantInfo.sublabel')}
                    </p>

                    <FieldErrorMsg>
                      {flatErrors.captureParticipantInfo}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="captureParticipantInfo"
                      id="ops-eval-and-learning-capture-participant-info"
                      value={values.captureParticipantInfo}
                      setFieldValue={setFieldValue}
                      options={captureParticipantInfoConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-capture-participant-info-note"
                      field="captureParticipantInfoNote"
                    />
                  </FieldGroup>

                  <h3>{opsEvalAndLearningMiscT('icdHeading')}</h3>

                  <p className="margin-y-1 margin-top-2 line-height-body-4">
                    {opsEvalAndLearningMiscT('icdSubheading')}
                  </p>

                  <FieldGroup
                    scrollElement="icdOwner"
                    className="margin-top-4"
                    error={!!flatErrors.icdOwner}
                  >
                    <Label htmlFor="ops-eval-and-learning-capture-icd-owner">
                      {opsEvalAndLearningT('icdOwner.label')}
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
                    <>
                      <MINTDatePicker
                        fieldName="draftIcdDueDate"
                        id="ops-eval-and-learning-icd-due-date"
                        className="margin-top-6"
                        label={opsEvalAndLearningT('draftIcdDueDate.label')}
                        placeHolder
                        handleOnBlur={handleOnBlur}
                        formikValue={values.draftIcdDueDate}
                        value={draftIcdDueDate}
                        error={flatErrors.draftIcdDueDate}
                      />

                      <AddNote
                        id="ops-eval-and-learning-icd-due-date-note"
                        field="icdNote"
                      />
                    </>
                  )}

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        handleFormSubmit('back');
                      }}
                    >
                      {miscellaneousT('back')}
                    </Button>

                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('next')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>

              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit();
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
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default IDDOC;

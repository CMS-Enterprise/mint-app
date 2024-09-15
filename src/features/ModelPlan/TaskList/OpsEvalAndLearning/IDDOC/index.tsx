import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetIddocQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetIddocQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import MINTDatePicker from 'components/DatePicker';
import FieldGroup from 'components/FieldGroup';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { NotFoundPartial } from 'features/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type IDDOCFormType = GetIddocQuery['modelPlan']['opsEvalAndLearning'];

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

  const { data, loading, error } = useGetIddocQuery({
    variables: {
      id: modelID
    }
  });

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
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as IDDOCFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

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
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.OPS_EVAL_AND_LEARNING
        ]}
      />

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
          history.push(
            `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<IDDOCFormType>) => {
          const {
            handleSubmit,
            setErrors,
            setFieldValue,
            values,
            setFieldError
          } = formikProps;

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
            } catch (err) {
              setFieldError(field, opsEvalAndLearningT('validDate'));
            }
          };

          return (
            <>
              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-iddoc-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <h3>{opsEvalAndLearningMiscT('iddocHeading')}</h3>

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="ops-eval-and-learning-technical-contacts-identified-use">
                      {opsEvalAndLearningT('technicalContactsIdentified.label')}
                    </Label>

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

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="ops-eval-and-learning-capture-participant-info">
                      {opsEvalAndLearningT('captureParticipantInfo.label')}
                    </Label>

                    <p className="text-base margin-bottom-1 margin-top-1">
                      {opsEvalAndLearningT('captureParticipantInfo.sublabel')}
                    </p>

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

                  <FieldGroup className="margin-top-4">
                    <Label htmlFor="ops-eval-and-learning-capture-icd-owner">
                      {opsEvalAndLearningT('icdOwner.label')}
                    </Label>

                    <Field
                      as={TextInput}
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
                        shouldShowWarning={
                          initialValues.draftIcdDueDate !==
                          values.draftIcdDueDate
                        }
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
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning`
                        );
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
                    onClick={() =>
                      history.push(
                        `/models/${modelID}/collaboration-area/task-list`
                      )
                    }
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
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

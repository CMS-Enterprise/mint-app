import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Fieldset, Icon, Label, Select } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  DataStartsType,
  GetDataSharingQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetDataSharingQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import FrequencyForm from 'components/FrequencyForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type GetDataSharingFormType =
  GetDataSharingQuery['modelPlan']['opsEvalAndLearning'];

const DataSharing = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    dataSharingStarts: dataSharingStartsConfig,
    dataSharingFrequency: dataSharingFrequencyConfig,
    dataCollectionStarts: dataCollectionStartsConfig,
    dataCollectionFrequency: dataCollectionFrequencyConfig,
    qualityReportingStarts: qualityReportingStartsConfig,
    qualityReportingFrequency: qualityReportingFrequencyConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<GetDataSharingFormType>>(null);
  const navigate = useNavigate();

  const { data, loading, error } = useGetDataSharingQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    dataSharingStarts,
    dataSharingStartsOther,
    dataSharingFrequency,
    dataSharingFrequencyContinually,
    dataSharingFrequencyOther,
    dataSharingStartsNote,
    dataCollectionStarts,
    dataCollectionStartsOther,
    dataCollectionFrequency,
    dataCollectionFrequencyContinually,
    dataCollectionFrequencyOther,
    dataCollectionFrequencyNote,
    qualityReportingStarts,
    qualityReportingStartsOther,
    qualityReportingStartsNote,
    qualityReportingFrequency,
    qualityReportingFrequencyContinually,
    qualityReportingFrequencyOther
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as GetDataSharingFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

  const backPage = () => {
    if (
      isCCWInvolvement(formikRef?.current?.values.ccmInvolvment) ||
      isQualityMeasures(formikRef?.current?.values.dataNeededForMonitoring)
    ) {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality`
      );
    } else {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/evaluation`
      );
    }
  };

  const initialValues: GetDataSharingFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    iddocSupport: iddocSupport ?? null,
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    dataSharingStarts: dataSharingStarts ?? null,
    dataSharingStartsOther: dataSharingStartsOther ?? '',
    dataSharingFrequency: dataSharingFrequency ?? [],
    dataSharingFrequencyContinually: dataSharingFrequencyContinually ?? '',
    dataSharingFrequencyOther: dataSharingFrequencyOther ?? '',
    dataSharingStartsNote: dataSharingStartsNote ?? '',
    dataCollectionStarts: dataCollectionStarts ?? null,
    dataCollectionStartsOther: dataCollectionStartsOther ?? '',
    dataCollectionFrequency: dataCollectionFrequency ?? [],
    dataCollectionFrequencyContinually:
      dataCollectionFrequencyContinually ?? '',
    dataCollectionFrequencyOther: dataCollectionFrequencyOther ?? '',
    dataCollectionFrequencyNote: dataCollectionFrequencyNote ?? '',
    qualityReportingStarts: qualityReportingStarts ?? null,
    qualityReportingStartsOther: qualityReportingStartsOther ?? '',
    qualityReportingStartsNote: qualityReportingStartsNote ?? '',
    qualityReportingFrequency: qualityReportingFrequency ?? [],
    qualityReportingFrequencyContinually:
      qualityReportingFrequencyContinually ?? '',
    qualityReportingFrequencyOther: qualityReportingFrequencyOther ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.closeModal()}
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
          navigate(
            `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/learning`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<GetDataSharingFormType>) => {
          const { handleSubmit, setErrors, values, setFieldValue } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-data-sharing-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup>
                    <strong>
                      {opsEvalAndLearningMiscT('reportingTiming')}
                    </strong>

                    <Label
                      htmlFor="ops-eval-and-learning-data-sharing-starts"
                      className="text-normal margin-top-2"
                    >
                      {opsEvalAndLearningT('dataSharingStarts.label')}
                    </Label>

                    <p className="text-base margin-y-1 line-height-body-4">
                      {opsEvalAndLearningT('dataSharingStarts.sublabel')}
                    </p>

                    <Field
                      as={Select}
                      id="ops-eval-and-learning-data-sharing-starts"
                      name="dataSharingStarts"
                      value={values.dataSharingStarts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('dataSharingStarts', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${miscellaneousT('select')}-`}
                      </option>

                      {getKeys(dataSharingStartsConfig.options).map(type => {
                        return (
                          <option key={type} value={type}>
                            {dataSharingStartsConfig.options[type]}
                          </option>
                        );
                      })}
                    </Field>

                    {values.dataSharingStarts === DataStartsType.OTHER && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="ops-eval-and-learning-data-sharing-starts-other"
                          className="text-normal"
                        >
                          {opsEvalAndLearningT('dataSharingStartsOther.label')}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="maxw-none mint-textarea"
                          id="ops-eval-and-learning-data-sharing-starts-other"
                          maxLength={5000}
                          name="dataSharingStartsOther"
                        />
                      </div>
                    )}
                  </FieldGroup>

                  <FrequencyForm
                    field="dataSharingFrequency"
                    values={values.dataSharingFrequency}
                    config={dataSharingFrequencyConfig}
                    nameSpace="opsEvalAndLearning"
                    id="ops-eval-and-learning-data-sharing-frequency"
                    label={opsEvalAndLearningT('dataSharingFrequency.label')}
                    disabled={loading}
                    boldLabel={false}
                    addNote={false}
                  />

                  <AddNote
                    id="ops-eval-and-learning-data-sharing-starts-note"
                    field="dataSharingStartsNote"
                  />

                  <FieldGroup>
                    <strong>
                      {opsEvalAndLearningMiscT('dataCollectionTiming')}
                    </strong>

                    <Label
                      htmlFor="ops-eval-and-learning-data-collection-starts"
                      className="text-normal margin-top-2"
                    >
                      {opsEvalAndLearningT('dataCollectionStarts.label')}
                    </Label>

                    <Field
                      as={Select}
                      id="ops-eval-and-learning-data-collection-starts"
                      name="dataCollectionStarts"
                      value={values.dataCollectionStarts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('dataCollectionStarts', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${miscellaneousT('select')}-`}
                      </option>

                      {getKeys(dataCollectionStartsConfig.options).map(type => {
                        return (
                          <option key={type} value={type}>
                            {dataCollectionStartsConfig.options[type]}
                          </option>
                        );
                      })}
                    </Field>

                    {values.dataCollectionStarts === DataStartsType.OTHER && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="ops-eval-and-learning-data-collection-starts-other"
                          className="text-normal"
                        >
                          {opsEvalAndLearningT(
                            'dataCollectionStartsOther.label'
                          )}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="maxw-none mint-textarea"
                          id="ops-eval-and-learning-data-collection-starts-other"
                          maxLength={5000}
                          name="dataCollectionStartsOther"
                        />
                      </div>
                    )}
                  </FieldGroup>

                  <FrequencyForm
                    field="dataCollectionFrequency"
                    values={values.dataCollectionFrequency}
                    config={dataCollectionFrequencyConfig}
                    nameSpace="opsEvalAndLearning"
                    id="ops-eval-and-learning-data-collection-frequency"
                    label={opsEvalAndLearningT('dataCollectionFrequency.label')}
                    disabled={loading}
                    boldLabel={false}
                  />

                  <FieldGroup>
                    <strong>
                      {opsEvalAndLearningMiscT('qualityReportTiming')}
                    </strong>
                    <Label
                      htmlFor="ops-eval-and-learning-data-reporting-starts"
                      className="text-normal margin-top-2"
                    >
                      {opsEvalAndLearningT('qualityReportingStarts.label')}
                    </Label>

                    <Field
                      as={Select}
                      id="ops-eval-and-learning-data-reporting-starts"
                      name="qualityReportingStarts"
                      value={values.qualityReportingStarts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('qualityReportingStarts', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${miscellaneousT('select')}-`}
                      </option>

                      {getKeys(qualityReportingStartsConfig.options).map(
                        type => {
                          return (
                            <option key={type} value={type}>
                              {qualityReportingStartsConfig.options[type]}
                            </option>
                          );
                        }
                      )}
                    </Field>

                    {values.qualityReportingStarts === DataStartsType.OTHER && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="ops-eval-and-learning-data-reporting-starts-other"
                          className="text-normal"
                        >
                          {opsEvalAndLearningT(
                            'qualityReportingStartsOther.label'
                          )}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="maxw-none mint-textarea"
                          id="ops-eval-and-learning-data-reporting-starts-other"
                          data-testid="ops-eval-and-learning-data-reporting-starts-other"
                          maxLength={5000}
                          name="qualityReportingStartsOther"
                        />
                      </div>
                    )}

                    <FrequencyForm
                      field="qualityReportingFrequency"
                      values={values.qualityReportingFrequency}
                      config={qualityReportingFrequencyConfig}
                      nameSpace="opsEvalAndLearning"
                      id="ops-eval-and-learning-quality-reporting-frequency"
                      label={opsEvalAndLearningT(
                        'qualityReportingFrequency.label'
                      )}
                      disabled={loading}
                      boldLabel={false}
                      addNote={false}
                    />

                    <AddNote
                      id="ops-eval-and-learning-data-reporting-frequency-note"
                      field="qualityReportingStartsNote"
                    />
                  </FieldGroup>

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        backPage();
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
                      navigate(
                        `/models/${modelID}/collaboration-area/task-list`
                      )
                    }
                  >
                    <Icon.ArrowBack
                      className="margin-right-1"
                      aria-hidden
                      aria-label="back"
                    />

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
            8,
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

export default DataSharing;

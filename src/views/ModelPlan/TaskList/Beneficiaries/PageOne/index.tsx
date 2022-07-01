import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanBeneficiaries from 'queries/GetModelPlanBeneficiaries';
import {
  GetModelPlanBeneficiaries as GetModelPlanBeneficiariesType,
  GetModelPlanBeneficiaries_modelPlan_beneficiaries as ModelPlanBeneficiariesFormType
} from 'queries/types/GetModelPlanBeneficiaries';
import { UpdateModelPlanBeneficiariesVariables } from 'queries/types/UpdateModelPlanBeneficiaries';
import UpdateModelPlanBeneficiaries from 'queries/UpdateModelPlanBeneficiaries';
import flattenErrors from 'utils/flattenErrors';

const BeneficiariesPageOne = () => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanBeneficiariesFormType>>(null);
  const history = useHistory();

  const { data } = useQuery<GetModelPlanBeneficiariesType>(
    GetModelPlanBeneficiaries,
    {
      variables: {
        id: modelID
      }
    }
  );

  const {
    id,
    beneficiaries,
    beneficiariesOther,
    beneficiariesNote,
    treatDualElligibleDifferentHow,
    treatDualElligibleDifferentNote,
    excludeCertainCharacteristics,
    excludeCertainCharacteristicsCriteria,
    excludeCertainCharacteristicsNote
  } = data?.modelPlan?.beneficiaries || ({} as ModelPlanBeneficiariesFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdateModelPlanBeneficiariesVariables>(
    UpdateModelPlanBeneficiaries
  );

  const handleFormSubmit = (
    formikValues: ModelPlanBeneficiariesFormType,
    redirect?: 'next' | 'back'
  ) => {
    update({
      variables: {
        id,
        changes: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers/participants-options`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues = {
    beneficiaries: beneficiaries ?? '',
    beneficiariesOther: beneficiariesOther ?? '',
    beneficiariesNote: beneficiariesNote ?? '',
    treatDualElligibleDifferentHow: treatDualElligibleDifferentHow ?? '',
    treatDualElligibleDifferentNote: treatDualElligibleDifferentNote ?? '',
    excludeCertainCharacteristics: excludeCertainCharacteristics ?? '',
    excludeCertainCharacteristicsCriteria:
      excludeCertainCharacteristicsCriteria ?? '',
    excludeCertainCharacteristicsNote: excludeCertainCharacteristicsNote ?? ''
  } as ModelPlanBeneficiariesFormType;

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
        {(formikProps: FormikProps<ModelPlanBeneficiariesFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            values
          } = formikProps;
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
              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap className="participants-and-providers__info">
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="participants-and-providers-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="participants"
                        error={!!flatErrors.participants}
                        className="margin-top-4"
                      >
                        <Label htmlFor="participants-and-providers-participants">
                          {t('whoAreParticipants')}
                        </Label>
                        <FieldErrorMsg>{flatErrors.participants}</FieldErrorMsg>

                        <Field
                          as={MultiSelect}
                          id="participants-and-providers-participants"
                          name="participants"
                          options={mappedParticipants}
                          selectedLabel={t('selectedParticipants')}
                          onChange={(value: string[] | []) => {
                            setFieldValue('participants', value);
                          }}
                          initialValues={initialValues.beneficiaries}
                        />

                        {((values?.beneficiaries || []).includes(
                          'MEDICARE_PROVIDERS' as ParticipantsType
                        ) ||
                          (values?.beneficiaries || []).includes(
                            'STATES' as ParticipantsType
                          ) ||
                          (values?.beneficiaries || []).includes(
                            'OTHER' as ParticipantsType
                          )) && (
                          <p className="margin-top-4 text-bold">
                            {t('participantQuestions')}
                          </p>
                        )}

                        {(values?.beneficiaries || []).includes(
                          'MEDICARE_PROVIDERS' as ParticipantsType
                        ) && (
                          <FieldGroup
                            scrollElement="medicareProviderType"
                            error={!!flatErrors.medicareProviderType}
                          >
                            <Label
                              htmlFor="participants-and-providers-medicare-type"
                              className="text-normal"
                            >
                              {t('typeMedicateProvider')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.medicareProviderType}
                            </FieldErrorMsg>
                            <Field
                              as={TextAreaField}
                              className="height-15"
                              error={flatErrors.medicareProviderType}
                              id="participants-and-providers-medicare-type"
                              data-testid="participants-and-providers-medicare-type"
                              name="medicareProviderType"
                            />
                          </FieldGroup>
                        )}

                        {(values?.beneficiaries || []).includes(
                          'STATES' as ParticipantsType
                        ) && (
                          <FieldGroup
                            scrollElement="statesEngagement"
                            error={!!flatErrors.statesEngagement}
                          >
                            <Label
                              htmlFor="participants-and-providers-states-engagement"
                              className="text-normal"
                            >
                              {t('describeStates')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.statesEngagement}
                            </FieldErrorMsg>
                            <Field
                              as={TextAreaField}
                              className="height-15"
                              error={flatErrors.statesEngagement}
                              id="participants-and-providers-states-engagement"
                              data-testid="participants-and-providers-states-engagement"
                              name="statesEngagement"
                            />
                          </FieldGroup>
                        )}

                        {(values?.beneficiaries || []).includes(
                          'OTHER' as ParticipantsType
                        ) && (
                          <FieldGroup
                            scrollElement="participantsOther"
                            error={!!flatErrors.participantsOther}
                          >
                            <Label
                              htmlFor="participants-and-providers-participants-other"
                              className="text-normal"
                            >
                              {t('describeOther')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.participantsOther}
                            </FieldErrorMsg>
                            <Field
                              as={TextAreaField}
                              className="height-15"
                              error={flatErrors.participantsOther}
                              id="participants-and-providers-participants-other"
                              data-testid="participants-and-providers-participants-other"
                              name="participantsOther"
                            />
                          </FieldGroup>
                        )}

                        <AddNote
                          id="participants-and-providers-participants-note"
                          field="participantsNote"
                        />
                      </FieldGroup>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
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
      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default BeneficiariesPageOne;

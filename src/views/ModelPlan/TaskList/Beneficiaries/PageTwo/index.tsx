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
  GridContainer,
  IconArrowBack,
  Label,
  Radio,
  RangeInput,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import GetModelPlanBeneficiaries from 'queries/GetModelPlanBeneficiaries';
import {
  GetModelPlanBeneficiaries as GetModelPlanBeneficiariesType,
  GetModelPlanBeneficiaries_modelPlan_beneficiaries as ModelPlanBeneficiariesFormType
} from 'queries/types/GetModelPlanBeneficiaries';
import { UpdateModelPlanBeneficiariesVariables } from 'queries/types/UpdateModelPlanBeneficiaries';
import UpdateModelPlanBeneficiaries from 'queries/UpdateModelPlanBeneficiaries';
import {
  BeneficiariesType,
  ConfidenceType,
  TriStateAnswer
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateBeneficiariesType,
  translateConfidenceType
} from 'utils/modelPlan';

const BeneficiariesPageTwo = () => {
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
    numberPeopleImpacted,
    estimateConfidence,
    confidenceNote,
    beneficiarySelectionMethod,
    beneficiarySelectionNote,
    beneficiarySelectionOther
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
              `/models/${modelID}/task-list/beneficiaries/page-three`
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

  // const mappedBeneficiariesType = Object.keys(BeneficiariesType)
  //   .sort(sortOtherEnum)
  //   .map(key => ({
  //     value: key,
  //     label: translateBeneficiariesType(key)
  //   }));

  const initialValues = {
    numberPeopleImpacted: numberPeopleImpacted ?? 0,
    estimateConfidence: estimateConfidence ?? null,
    confidenceNote: confidenceNote ?? '',
    beneficiarySelectionMethod: beneficiarySelectionMethod ?? null,
    beneficiarySelectionNote: beneficiarySelectionNote ?? '',
    beneficiarySelectionOther: beneficiarySelectionOther ?? ''
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
                <Grid row gap className="beneficiaries__info">
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="beneficiaries-participants-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="numberPeopleImpacted"
                        error={!!flatErrors.numberPeopleImpacted}
                      >
                        <Label htmlFor="expected-people-impacted">
                          {t('howManyImpacted')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.numberPeopleImpacted}
                        </FieldErrorMsg>
                        <Field
                          as={RangeInput}
                          className="maxw-none"
                          error={flatErrors.numberPeopleImpacted}
                          id="expected-people-impacted"
                          data-testid="expected-people-impacted"
                          name="numberPeopleImpacted"
                          min={0}
                          max={10000}
                          step={1}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue(
                              'numberPeopleImpacted',
                              Number(e.target.value)
                            );
                          }}
                        />
                        <div className="display-flex mint-header__basic">
                          <span>{t('zero')}</span>
                          <span>{t('tenThousand')}</span>
                        </div>
                        <Label
                          htmlFor="participants-and-providers-participants-other-input"
                          className="text-normal"
                        >
                          {t('numberOfPeopleImpacted')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.numberPeopleImpacted}
                        </FieldErrorMsg>
                        <Field
                          as={TextInput}
                          type="number"
                          className="maxw-card"
                          error={flatErrors.numberPeopleImpacted}
                          id="participants-and-providers-participants-other-input"
                          name="expectedNumberOfParticipants"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (Number.isNaN(e.target.value)) return;
                            setFieldValue(
                              'expectedNumberOfParticipants',
                              Number(e.target.value)
                            );
                          }}
                        />

                        <Label
                          htmlFor="beneficiaries-impact-estimateConfidence"
                          className="text-normal"
                        >
                          {t('levelOfConfidence')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.participantsCurrentlyInModels}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(ConfidenceType).map(key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`beneficiaries-impact-confidence-${key}`}
                              name="beneficiaries-impact-estimateConfidence"
                              label={translateConfidenceType(key)}
                              value={key}
                              checked={values.estimateConfidence === key}
                              onChange={() => {
                                setFieldValue('estimateConfidence', key);
                              }}
                            />
                          ))}
                        </Fieldset>
                        <AddNote
                          id="beneficiaries-impact-confidence-note"
                          field="confidenceNote"
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
                        onClick={() => handleFormSubmit(values, 'back')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
              {/* TODO: Comment to stop obnoxious errors */}
              {/* {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )} */}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default BeneficiariesPageTwo;

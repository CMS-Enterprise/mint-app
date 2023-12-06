import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  DatePicker,
  Fieldset,
  Grid,
  GridContainer,
  Label,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import CreateCRTDL from 'queries/CRTDL/CreateCRTDL';
import GetCRTDL from 'queries/CRTDL/GetCRTDL';
import {
  CreateCRTDL as CreateCRTDLType,
  CreateCRTDL_createPlanCrTdl as CreateCRTDLFormType,
  CreateCRTDLVariables
} from 'queries/CRTDL/types/CreateCRTDL';
import {
  GetCRTDL as GetCRTDLType,
  GetCRTDLVariables
} from 'queries/CRTDL/types/GetCRTDL';
import {
  UpdateCRTDL as UpdateCRTDLType,
  UpdateCRTDL_updatePlanCrTdl as UpdateCRTDLIDType,
  UpdateCRTDLVariables
} from 'queries/CRTDL/types/UpdateCRTDL';
import UpdateCRTDL from 'queries/CRTDL/UpdateCRTDL';
import flattenErrors from 'utils/flattenErrors';
import CRTDLValidationSchema from 'validations/crtdl';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

interface CRTDLInputType extends CreateCRTDLFormType, UpdateCRTDLIDType {}

const initialFormValues: CRTDLInputType = {
  __typename: 'PlanCrTdl',
  id: '',
  modelPlanID: '',
  title: '',
  idNumber: '',
  dateInitiated: '',
  note: null
};

const AddCRTDL = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { crtdlID } = useParams<{ crtdlID: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('crtdl');

  const { modelName } = useContext(ModelInfoContext);

  const { showMessageOnNextPage } = useMessage();

  const formikRef = useRef<FormikProps<CRTDLInputType>>(null);

  const history = useHistory();
  const readOnly = useLocation().hash === '#read-only';

  const { data, loading, error } = useQuery<GetCRTDLType, GetCRTDLVariables>(
    GetCRTDL,
    {
      variables: {
        id: crtdlID
      },
      skip: !crtdlID
    }
  );

  const crtdl = data?.crTdl || initialFormValues;

  const [create] = useMutation<CreateCRTDLType, CreateCRTDLVariables>(
    CreateCRTDL
  );

  const [update] = useMutation<UpdateCRTDLType, UpdateCRTDLVariables>(
    UpdateCRTDL
  );

  const handleUpdateDraftModelPlan = (formikValues: CRTDLInputType) => {
    const { __typename, modelPlanID, id, ...changes } = formikValues;

    if (crtdlID) {
      update({
        variables: {
          id: crtdlID,
          changes
        }
      })
        .then(response => {
          if (!response?.errors) {
            showMessageOnNextPage(
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {t('successUpdate', {
                    crtdl: changes.idNumber,
                    modelName
                  })}
                </span>
              </Alert>
            );
            history.push(`/models/${modelID}/cr-and-tdl`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    } else {
      create({
        variables: {
          input: {
            modelPlanID: modelID,
            ...changes
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            showMessageOnNextPage(
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {t('successAdd', {
                    crtdl: changes.idNumber,
                    modelName
                  })}
                </span>
              </Alert>
            );
            history.push(`/models/${modelID}/cr-and-tdl`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  };

  return (
    <MainContent className="margin-bottom-6">
      <GridContainer>
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {t('heading')}
          </PageHeading>
          <div className="margin-bottom-2 line-height-body-4">
            {!crtdlID ? t('createDescription') : t('updateDescription')}
          </div>

          <p className="margin-bottom-0">
            {t('required1')}
            <RequiredAsterisk />
            {t('required2')}
          </p>

          {error && (
            <ErrorAlert
              testId="formik-validation-errors"
              classNames="margin-top-3"
              heading={t('error')}
            >
              <ErrorAlertMessage errorKey="1" message={t('errorInfo')} />
            </ErrorAlert>
          )}

          <Formik
            initialValues={crtdl}
            enableReinitialize
            onSubmit={handleUpdateDraftModelPlan}
            validationSchema={CRTDLValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<CRTDLInputType>) => {
              const {
                errors,
                values,
                setErrors,
                setFieldValue,
                handleSubmit,
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
                  delete errors[field as keyof CreateCRTDLFormType];
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
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Fieldset disabled={!!error || loading}>
                      <Grid row>
                        <Grid desktop={{ col: 6 }}>
                          <FieldGroup
                            scrollElement="idNumber"
                            error={!!flatErrors.idNumber}
                          >
                            <Label htmlFor="cr-tdl-id-number">
                              {t('idNumber')}
                              <RequiredAsterisk />
                            </Label>
                            <div className="usa-hint margin-top-1">
                              {t('idNumberInfo')}
                            </div>
                            <FieldErrorMsg>{flatErrors.idNumber}</FieldErrorMsg>
                            <Field
                              as={TextInput}
                              id="cr-tdl-id-number"
                              data-testid="cr-tdl-id-number"
                              maxLength={50}
                              name="idNumber"
                            />
                          </FieldGroup>
                          {!loading && (
                            <FieldGroup
                              scrollElement="dateInitiated"
                              error={!!flatErrors.dateInitiated}
                            >
                              <Label
                                htmlFor="cr-tdl-date-initiated"
                                className="text-bold"
                              >
                                {t('dateInitiated')}
                                <RequiredAsterisk />
                              </Label>
                              <div className="usa-hint margin-top-1">
                                {h('datePlaceholder')}
                              </div>
                              <FieldErrorMsg>
                                {flatErrors.dateInitiated}
                              </FieldErrorMsg>
                              <div className="width-card-lg position-relative">
                                <Field
                                  as={DatePicker}
                                  id="cr-tdl-date-initiated"
                                  error={+!!flatErrors.dateInitiated}
                                  data-testid="cr-tdl-date-initiated"
                                  maxLength={50}
                                  name="dateInitiated"
                                  defaultValue={crtdl.dateInitiated}
                                  onBlur={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleOnBlur(e, 'dateInitiated');
                                  }}
                                />
                              </div>
                            </FieldGroup>
                          )}
                        </Grid>
                      </Grid>
                      <Grid row>
                        <Grid desktop={{ col: 12 }}>
                          <FieldGroup
                            scrollElement="title"
                            error={!!flatErrors.title}
                          >
                            <Label htmlFor="cr-tdl-title">
                              {t('title')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>{flatErrors.title}</FieldErrorMsg>
                            <Field
                              as={TextAreaField}
                              className="maxw-none mint-textarea"
                              id="cr-tdl-title"
                              data-testid="cr-tdl-title"
                              maxLength={5000}
                              name="title"
                            />
                          </FieldGroup>
                          <Divider className="margin-y-4" />
                          <FieldGroup
                            scrollElement="note"
                            error={!!flatErrors.note}
                          >
                            <Label htmlFor="cr-tdl-note">{t('notes')}</Label>
                            <div className="usa-hint margin-top-1">
                              {t('notesInfo')}
                            </div>
                            <FieldErrorMsg>{flatErrors.note}</FieldErrorMsg>
                            <Field
                              as={Textarea}
                              className="height-15"
                              id="cr-tdl-note"
                              data-testid="cr-tdl-note"
                              value={values.note || ''}
                              name="note"
                            />
                          </FieldGroup>
                        </Grid>
                      </Grid>

                      <div className="margin-y-4 display-block">
                        <Button
                          type="submit"
                          id="submit-cr-and-tdl"
                          disabled={
                            !values.idNumber ||
                            !values.dateInitiated ||
                            !values.title
                          }
                          onClick={() => setErrors({})}
                        >
                          {!crtdlID ? t('addCRTDL') : t('updateCRTDL')}
                        </Button>
                      </div>
                    </Fieldset>
                  </Form>
                </>
              );
            }}
          </Formik>
          <UswdsReactLink
            to={
              readOnly
                ? `/models/${modelID}/read-only/crs-and-tdl`
                : `/models/${modelID}/cr-and-tdl`
            }
          >
            <span>&larr; </span>{' '}
            {!crtdlID ? t('addRedirect') : t('updateRedirect')}
          </UswdsReactLink>
        </div>
      </GridContainer>
    </MainContent>
  );
};

export default AddCRTDL;

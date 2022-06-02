import React, { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Dropdown,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import GetModelPlanCharacteristics from 'queries/GetModelPlanCharacteristics';
import {
  GetModelPlanCharacteristics as GetModelPlanCharacteristicsType,
  GetModelPlanCharacteristics_modelPlan as ModelPlanCharacteristicsType
} from 'queries/types/GetModelPlanCharacteristics';
import { UpdateModelPlanCharacteristicsVariables } from 'queries/types/UpdateModelPlanCharacteristics';
import UpdateModelPlanCharacteristics from 'queries/UpdateModelPlanCharacteristics';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import Authority from './Authority';
import Involvements from './Involvements';
import KeyCharacteristics from './KeyCharacteristics';
import TargetsAndOptions from './TargetsAndOptions';

type ModelPlanCharacteristicsFormType = {
  isNewModel: boolean | null;
  existingModel: string | null;
  resemblesExistingModel: boolean | null;
  resemblesExistingModelWhich: string[];
  resemblesExistingModelHow: string;
  resemblesExistingModelNote: string;
  hasComponentsOrTracks: boolean | null;
  hasComponentsOrTracksDiffer: string;
  hasComponentsOrTracksNote: string;
};

const CharacteristicsContent = () => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanCharacteristicsFormType>>(null);
  const history = useHistory();
  const [areCmmiGroupsShown, setAreCmmiGroupsShown] = useState(false);
  const [showOther, setShowOther] = useState(false);

  const { data } = useQuery<GetModelPlanCharacteristicsType>(
    GetModelPlanCharacteristics,
    {
      variables: {
        id: modelID
      }
    }
  );

  console.log(data);

  const { generalCharacteristics } =
    data?.modelPlan ||
    ({ generalCharacteristics: {} } as ModelPlanCharacteristicsType);

  const [update] = useMutation<UpdateModelPlanCharacteristicsVariables>(
    UpdateModelPlanCharacteristics
  );

  const handleFormSubmit = (
    formikValues: ModelPlanCharacteristicsFormType,
    redirect?: 'next' | 'back'
  ) => {
    update({
      variables: {
        id: modelID,
        changes: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/characteristics/involvements`
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

  const initialValues: ModelPlanCharacteristicsFormType = {
    isNewModel: generalCharacteristics.isNewModel || null,
    existingModel: generalCharacteristics.existingModel || null,
    resemblesExistingModel:
      generalCharacteristics.resemblesExistingModel || null,
    resemblesExistingModelWhich:
      generalCharacteristics.resemblesExistingModelWhich || [],
    resemblesExistingModelHow:
      generalCharacteristics.resemblesExistingModelHow || '',
    resemblesExistingModelNote:
      generalCharacteristics.resemblesExistingModelNote || '',
    hasComponentsOrTracks: generalCharacteristics.hasComponentsOrTracks || null,
    hasComponentsOrTracksDiffer:
      generalCharacteristics.hasComponentsOrTracksDiffer || '',
    hasComponentsOrTracksNote:
      generalCharacteristics.hasComponentsOrTracksNote || ''
  };

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
      <PageHeading className="margin-top-4">{t('heading')}</PageHeading>

      <AskAQuestion modelID={modelID} />

      <Alert
        type="info"
        slim
        data-testid="mandatory-fields-alert"
        className="margin-bottom-4"
      >
        <span className="mandatory-fields-alert__text">
          {h('mandatoryFields')}
        </span>
      </Alert>

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        // validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ModelPlanCharacteristicsFormType>) => {
          const {
            dirty,
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            isValid,
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
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                {/* <FieldGroup
                  scrollElement="modelName"
                  error={!!flatErrors.modelName}
                  className="margin-top-4"
                >
                  <Label htmlFor="plan-basics-model-name">
                    {t('modelName')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors.modelName}
                    id="plan-basics-model-name"
                    maxLength={50}
                    name="modelName"
                    defaultValue={modelName}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="modelCategory"
                  error={!!flatErrors.modelCategory}
                  className="margin-top-4"
                >
                  <Label htmlFor="plan-basics-model-category">
                    {t('modelCategory')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.modelCategory}</FieldErrorMsg>
                  <Field
                    as={Dropdown}
                    id="plan-basics-model-category"
                    name="modelCategory"
                    value={values.modelCategory || ''}
                    onChange={(e: any) => {
                      setFieldValue('modelCategory', e.target.value);
                    }}
                  >
                    <option key="default-select" disabled value="">
                      {`-${h('select')}-`}
                    </option>
                    {Object.keys(modelCategoryEnum).map(role => {
                      return (
                        <option
                          key={`Model-Category-${translateModelCategory(
                            modelCategoryEnum[role]
                          )}`}
                          value={role || ''}
                        >
                          {translateModelCategory(modelCategoryEnum[role])}
                        </option>
                      );
                    })}
                  </Field>
                </FieldGroup>

                <FieldGroup
                  scrollElement="cmsCenters"
                  error={!!flatErrors.cmsCenters}
                  className="margin-top-4"
                >
                  <FieldArray
                    name="cmsCenters"
                    render={arrayHelpers => (
                      <>
                        <legend className="usa-label">
                          {t('cmsComponent')}
                        </legend>
                        <FieldErrorMsg>{flatErrors.cmsCenters}</FieldErrorMsg>

                        {(t('cmsComponents', {
                          returnObjects: true
                        }) as string[]).map((item, key) => {
                          return (
                            <Fragment key={item}>
                              <Field
                                as={CheckboxField}
                                id={`new-plan-cmsCenters--${key}`}
                                name="cmsCenters"
                                label={item}
                                value={translateCmsCenter(item)}
                                checked={values.cmsCenters.includes(
                                  translateCmsCenter(item)
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.cmsCenters.indexOf(
                                      e.target.value
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                  if (e.target.value === 'CMMI') {
                                    setAreCmmiGroupsShown(true);
                                  }
                                  if (e.target.value === 'OTHER') {
                                    setShowOther(!showOther);
                                  }
                                }}
                              />
                            </Fragment>
                          );
                        })}

                        {values.cmsCenters.includes('OTHER') && (
                          <FieldGroup
                            className="margin-top-4"
                            error={!!flatErrors.cmsOther}
                          >
                            <Label htmlFor="plan-basics-cmsCategory--Other">
                              {h('pleaseSpecify')}
                            </Label>
                            <FieldErrorMsg>{flatErrors.cmsOther}</FieldErrorMsg>
                            <Field
                              as={TextInput}
                              id="plan-basics-cmsCategory--Other"
                              maxLength={50}
                              name="cmsOther"
                            />
                          </FieldGroup>
                        )}
                      </>
                    )}
                  />
                </FieldGroup>
                {values.cmsCenters.includes('CMMI') && (
                  <FieldGroup
                    error={!!flatErrors.cmmiGroup}
                    className="margin-top-4"
                  >
                    <FieldArray
                      name="cmmiGroups"
                      render={arrayHelpers => (
                        <>
                          <legend className="usa-label text-normal">
                            {t('cmmiGroup')}
                          </legend>
                          <FieldErrorMsg>{flatErrors.cmmiGroups}</FieldErrorMsg>

                          {(t('cmmiGroups', {
                            returnObjects: true
                          }) as string[]).map((item, key) => {
                            return (
                              <Fragment key={item}>
                                <Field
                                  as={CheckboxField}
                                  id={`new-plan-cmmiGroup--${key}`}
                                  name="cmmiGroup"
                                  label={item}
                                  value={translateCmmiGroups(item)}
                                  checked={values.cmmiGroups.includes(
                                    translateCmmiGroups(item)
                                  )}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(e.target.value);
                                    } else {
                                      const idx = values.cmmiGroups.indexOf(
                                        e.target.value
                                      );
                                      arrayHelpers.remove(idx);
                                    }
                                  }}
                                />
                              </Fragment>
                            );
                          })}
                        </>
                      )}
                    />
                  </FieldGroup>
                )} */}

                <div className="margin-top-6 margin-bottom-3">
                  <Button
                    type="submit"
                    disabled={!(dirty || isValid)}
                    onClick={() => setErrors({})}
                  >
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
              <AutoSave
                values={values}
                onSave={() => {
                  handleFormSubmit(formikRef.current!.values);
                }}
                debounceDelay={3000}
              />
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={1} totalPages={5} className="margin-bottom-10" />
    </>
  );
};

export const Characteristics = () => {
  return (
    <MainContent data-testid="model-characteristics">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/characteristics"
              exact
              render={() => <CharacteristicsContent />}
            />
            <Route
              path="/models/:modelID/task-list/characteristics/key-characteristics"
              exact
              render={() => <KeyCharacteristics />}
            />
            <Route
              path="/models/:modelID/task-list/characteristics/involvements"
              exact
              render={() => <Involvements />}
            />
            <Route
              path="/models/:modelID/task-list/characteristics/targets-and-options"
              exact
              render={() => <TargetsAndOptions />}
            />
            <Route
              path="/models/:modelID/task-list/characteristics/authority"
              exact
              render={() => <Authority />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Characteristics;

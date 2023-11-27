import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ComboBox,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetExistingModelPlansQuery,
  GetGeneralCharacteristicsQuery,
  GetModelPlansBaseQuery,
  ModelPlanFilter,
  useGetExistingModelPlansQuery,
  useGetGeneralCharacteristicsQuery,
  useGetModelPlansBaseQuery,
  useUpdateExistingModelLinksMutation,
  useUpdatePlanGeneralCharacteristicsMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

import Authority from './Authority';
import Involvements from './Involvements';
import KeyCharacteristics from './KeyCharacteristics';
import TargetsAndOptions from './TargetsAndOptions';

type GeneralCharacteristicsFormType = GetGeneralCharacteristicsQuery['modelPlan']['generalCharacteristics'];

interface GetGeneralCharacteristicsFormTypeWithLinks
  extends Omit<
    GeneralCharacteristicsFormType,
    'currentModelPlanID' | 'existingModelID'
  > {
  existingModelLinks: (string | number)[];
  existingModel: string | number | null;
}

export const CharacteristicsContent = () => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    isNewModel: isNewModelConfig,
    resemblesExistingModel: resemblesExistingModelConfig,
    hasComponentsOrTracks: hasComponentsOrTracksConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<
    FormikProps<GetGeneralCharacteristicsFormTypeWithLinks>
  >(null);

  const history = useHistory();

  const {
    data: modelData,
    error: modelError,
    loading: modelLoading
  } = useGetModelPlansBaseQuery({
    variables: {
      filter: ModelPlanFilter.INCLUDE_ALL
    }
  });

  const {
    data: existingModelData,
    error: existingModelError,
    loading: existingModelLoading
  } = useGetExistingModelPlansQuery();

  // Combined MINT models with existing models from DB.  Sorts them alphabetically and returns options for MultiSelect
  const modelPlanOptions = useMemo(() => {
    // Test suite fails on error - ((intermediate value) || []) is not iterable
    // Needs to assert that these values are iterable, fallback to [] does not appease
    const modelPlans =
      modelData?.modelPlanCollection &&
      Array.isArray(modelData?.modelPlanCollection)
        ? modelData?.modelPlanCollection
        : [];

    const existingPlans =
      existingModelData?.existingModelCollection &&
      Array.isArray(existingModelData?.existingModelCollection)
        ? existingModelData?.existingModelCollection
        : [];

    const combinedModels = [...modelPlans, ...existingPlans].sort((a, b) =>
      (a.modelName || '') > (b.modelName || '') ? 1 : -1
    );
    return combinedModels.map(model => {
      return {
        label: model!.modelName!,
        value: model!.id! as string
      };
    });
  }, [modelData, existingModelData]);

  const { data, loading, error } = useGetGeneralCharacteristicsQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    isNewModel,
    currentModelPlanID,
    existingModelID,
    resemblesExistingModel,
    resemblesExistingModelHow,
    resemblesExistingModelNote,
    hasComponentsOrTracks,
    hasComponentsOrTracksDiffer,
    hasComponentsOrTracksNote
  } =
    data?.modelPlan?.generalCharacteristics ||
    ({} as GeneralCharacteristicsFormType);

  const existingModel = currentModelPlanID || existingModelID;

  const modelName = data?.modelPlan?.modelName || '';

  const existingModelLinks: (string | number)[] = useMemo(() => {
    return (
      data?.modelPlan.existingModelLinks?.map(
        link => (link.existingModelID || link.currentModelPlanID)!
      ) || []
    );
  }, [data?.modelPlan?.existingModelLinks]);

  const [update] = useUpdatePlanGeneralCharacteristicsMutation();

  const [updateExistingLinks] = useUpdateExistingModelLinksMutation();

  const handleFormSubmit = async (redirect?: 'next' | 'back') => {
    const formValues = formikRef?.current?.values!;

    const { existingModelLinks: existingLinksInitial, ...initialValues } =
      formikRef?.current?.initialValues || {};

    const { existingModelLinks: existingLinks, ...values } = formValues || {};

    const linksToUpdate = separateLinksByType(
      existingLinks || [],
      modelData?.modelPlanCollection || [],
      existingModelData?.existingModelCollection || []
    );

    const genCharUpdates = dirtyInput(initialValues, values);

    // Checking if the existing model is a MINT model plan or an import/existing model plan
    if (typeof genCharUpdates.existingModel === 'number') {
      genCharUpdates.existingModelID = genCharUpdates.existingModel;
    } else if (typeof genCharUpdates.existingModel === 'string') {
      genCharUpdates.currentModelPlanID = genCharUpdates.existingModel;
    } else if (genCharUpdates.existingModel === null) {
      genCharUpdates.existingModelID = null;
      genCharUpdates.currentModelPlanID = null;
    }

    // As existingModel is only a FE value/not persisted on BE, we want to remove it from the payload
    delete genCharUpdates.existingModel;

    await Promise.allSettled([
      update({
        variables: {
          id,
          changes: genCharUpdates
        }
      }),
      updateExistingLinks({
        variables: {
          modelPlanID: modelID,
          ...linksToUpdate
        }
      })
    ])
      .then(response => {
        const anyError = response.find(res => res.status === 'rejected');

        if (anyError) {
          formikRef?.current?.setErrors({
            existingModelLinks: miscellaneousT('apolloFailField')
          });
          return;
        }

        if (redirect === 'next') {
          history.push(
            `/models/${modelID}/task-list/characteristics/key-characteristics`
          );
        } else if (redirect === 'back') {
          history.push(`/models/${modelID}/task-list/`);
        }
      })
      .catch(err => {
        formikRef?.current?.setErrors(err);
      });
  };

  const initialValues: GetGeneralCharacteristicsFormTypeWithLinks = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    isNewModel: isNewModel ?? null,
    existingModel: existingModel ?? null,
    resemblesExistingModel: resemblesExistingModel ?? null,
    existingModelLinks: existingModelLinks ?? [],
    resemblesExistingModelHow: resemblesExistingModelHow ?? '',
    resemblesExistingModelNote: resemblesExistingModelNote ?? '',
    hasComponentsOrTracks: hasComponentsOrTracks ?? null,
    hasComponentsOrTracksDiffer: hasComponentsOrTracksDiffer ?? '',
    hasComponentsOrTracksNote: hasComponentsOrTracksNote ?? ''
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
        <Breadcrumb current>
          {generalCharacteristicsMiscT('breadcrumb')}
        </Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {generalCharacteristicsMiscT('heading')}
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
        {(
          formikProps: FormikProps<GetGeneralCharacteristicsFormTypeWithLinks>
        ) => {
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
                data-testid="plan-characteristics-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset
                  disabled={
                    !!error || loading || modelLoading || existingModelLoading
                  }
                >
                  <FieldGroup
                    scrollElement="isNewModel"
                    error={!!flatErrors.isNewModel}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="plan-characteristics-is-new-model">
                      {generalCharacteristicsT('isNewModel.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.isNewModel}</FieldErrorMsg>

                    <BooleanRadio
                      field="isNewModel"
                      id="plan-characteristics-is-new-model"
                      value={values.isNewModel}
                      setFieldValue={setFieldValue}
                      options={isNewModelConfig.options}
                      childName="existingModel"
                    />

                    {values.isNewModel === false && (
                      <FieldGroup
                        scrollElement="existingModel"
                        error={!!flatErrors.existingModel}
                      >
                        <Label
                          htmlFor="plan-characteristics-existing-model"
                          className="margin-bottom-1 text-normal"
                        >
                          {generalCharacteristicsT('existingModel.label')}
                        </Label>

                        <p className="text-base margin-0">
                          {generalCharacteristicsT('existingModel.sublabel')}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors.existingModel}
                        </FieldErrorMsg>

                        {!loading && (
                          <Field
                            as={ComboBox}
                            disabled={!!modelError || !!existingModelError}
                            data-test-id="plan-characteristics-existing-model"
                            id="plan-characteristics-existing-model"
                            name="existingModel"
                            className={classNames({
                              disabled: !!modelError || !!existingModelError
                            })}
                            inputProps={{
                              id: 'plan-characteristics-existing-model',
                              name: 'existingModel',
                              'aria-describedby':
                                'plan-characteristics-existing-model'
                            }}
                            options={modelPlanOptions}
                            defaultValue={
                              modelPlanOptions.find(
                                modelPlan => modelPlan.value === existingModel
                              )?.value || undefined
                            }
                            onChange={(modelPlanID: string | number) => {
                              const model = modelPlanOptions.find(
                                modelPlan => modelPlan.value === modelPlanID
                              );
                              if (model) {
                                setFieldValue('existingModel', model.value);
                              } else {
                                setFieldValue('existingModel', null);
                              }
                            }}
                          />
                        )}
                      </FieldGroup>
                    )}
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="resemblesExistingModel"
                    error={!!flatErrors.resemblesExistingModel}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="plan-characteristics-resembles-existing-model">
                      {generalCharacteristicsT('resemblesExistingModel.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.resemblesExistingModel}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="resemblesExistingModel"
                      id="plan-characteristics-resembles-existing-model"
                      value={values.resemblesExistingModel}
                      setFieldValue={setFieldValue}
                      options={resemblesExistingModelConfig.options}
                    />

                    {values.resemblesExistingModel && (
                      <>
                        <FieldGroup
                          scrollElement="resemblesExistingModelWhich"
                          error={!!flatErrors.resemblesExistingModelWhich}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="plan-characteristics-resembles-which-model"
                            className="text-normal"
                            id="label-plan-characteristics-resembles-which-model"
                          >
                            {generalCharacteristicsT(
                              'existingModelLinks.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {generalCharacteristicsT(
                              'existingModelLinks.sublabel'
                            )}
                          </p>

                          <FieldErrorMsg>
                            {flatErrors.resemblesExistingModelWhich}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="plan-characteristics-resembles-which-model"
                            ariaLabel="label-plan-characteristics-resembles-which-model"
                            name="existingModelLinks"
                            options={modelPlanOptions}
                            selectedLabel={generalCharacteristicsT(
                              'existingModelLinks.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue('existingModelLinks', value);
                            }}
                            initialValues={initialValues.existingModelLinks}
                          />
                        </FieldGroup>
                        <FieldGroup
                          scrollElement="resemblesExistingModelHow"
                          error={!!flatErrors.resemblesExistingModelHow}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="plan-characteristics-resembles-how-model"
                            className="text-normal"
                          >
                            {generalCharacteristicsT(
                              'resemblesExistingModelHow.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.resemblesExistingModelHow}
                          </FieldErrorMsg>

                          <Field
                            as={TextAreaField}
                            className="height-15"
                            error={flatErrors.resemblesExistingModelHow}
                            id="plan-characteristics-resembles-how-model"
                            name="resemblesExistingModelHow"
                          />
                        </FieldGroup>

                        <AddNote
                          id="plan-characteristics-resemble-existing-note"
                          field="resemblesExistingModelNote"
                        />
                      </>
                    )}
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="hasComponentsOrTracks"
                    error={!!flatErrors.hasComponentsOrTracks}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="plan-characteristics-has-component-or-tracks">
                      {generalCharacteristicsT('hasComponentsOrTracks.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.hasComponentsOrTracks}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="hasComponentsOrTracks"
                      id="plan-characteristics-has-component-or-tracks"
                      value={values.hasComponentsOrTracks}
                      setFieldValue={setFieldValue}
                      options={hasComponentsOrTracksConfig.options}
                      childName="hasComponentsOrTracksDiffer"
                    >
                      {values.hasComponentsOrTracks === true ? (
                        <div className="display-flex margin-left-4 margin-bottom-1">
                          <FieldGroup
                            className="flex-1"
                            scrollElement="hasComponentsOrTracksDiffer"
                            error={!!flatErrors.hasComponentsOrTracksDiffer}
                          >
                            <Label
                              htmlFor="plan-characteristics-tracks-differ-how"
                              className="margin-bottom-1 text-normal"
                            >
                              {generalCharacteristicsT(
                                'hasComponentsOrTracksDiffer.label'
                              )}
                            </Label>

                            <FieldErrorMsg>
                              {flatErrors.hasComponentsOrTracksDiffer}
                            </FieldErrorMsg>

                            <Field
                              as={TextAreaField}
                              error={!!flatErrors.hasComponentsOrTracksDiffer}
                              className="margin-top-0 height-15"
                              data-testid="plan-characteristics-tracks-differ-how"
                              id="plan-characteristics-tracks-differ-how"
                              name="hasComponentsOrTracksDiffer"
                            />
                          </FieldGroup>
                        </div>
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>

                    <AddNote
                      id="plan-characteristics-has-component-or-tracks-note"
                      field="hasComponentsOrTracksNote"
                    />
                  </FieldGroup>

                  <div className="margin-top-6 margin-bottom-3">
                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('next')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => handleFormSubmit('back')}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>

              {id && !(loading || modelLoading || existingModelLoading) && (
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

      <PageNumber currentPage={1} totalPages={5} className="margin-y-6" />
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

type SeparateLinksType = {
  existingModelIDs: number[];
  currentModelPlanIDs: string[];
};

// Function to get a formatted object for the input payload of UpdateExistingModelLinks mutation
// Separates all selected existingModelLinks values into a type of either draftModelPlans or existingModelPlans
export const separateLinksByType = (
  existingLinks: (string | number)[],
  draftModelPlans: GetModelPlansBaseQuery['modelPlanCollection'],
  existingModelPlans: GetExistingModelPlansQuery['existingModelCollection']
): SeparateLinksType => {
  const existingModelIDs = [...existingLinks].filter(linkID =>
    existingModelPlans.find(modelPlan => modelPlan.id === linkID)
  ) as number[];

  const currentModelPlanIDs = [...existingLinks].filter(linkID =>
    draftModelPlans.find(modelPlan => modelPlan.id === linkID?.toString())
  ) as string[];

  return {
    existingModelIDs,
    currentModelPlanIDs
  };
};

export default Characteristics;

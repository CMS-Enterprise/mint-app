import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams
} from 'react-router-dom';
import {
  Button,
  ComboBox,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ExisitingModelLinkFieldType,
  ExistingModelLinks,
  GetExistingModelPlansQuery,
  GetGeneralCharacteristicsQuery,
  GetModelPlansBaseQuery,
  ModelPlanFilter,
  useGetExistingModelPlansQuery,
  useGetGeneralCharacteristicsQuery,
  useGetModelPlansBaseQuery,
  useUpdateExistingModelLinksMutation,
  useUpdatePlanGeneralCharacteristicsMutation,
  YesNoOtherType
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ProtectedRoute from 'components/ProtectedRoute';
import TextAreaField from 'components/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { dirtyInput } from 'utils/formDiff';

import Authority from './Authority';
import Involvements from './Involvements';
import KeyCharacteristics from './KeyCharacteristics';
import TargetsAndOptions from './TargetsAndOptions';

type GeneralCharacteristicsFormType =
  GetGeneralCharacteristicsQuery['modelPlan']['generalCharacteristics'];

interface GetGeneralCharacteristicsFormTypeWithLinks
  extends Omit<
    GeneralCharacteristicsFormType,
    'currentModelPlanID' | 'existingModelID'
  > {
  resemblesExistingModelLinks: (string | number)[];
  participationInModelPreconditionLinks: (string | number)[];
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
    participationInModelPrecondition: participationInModelPreconditionConfig,
    hasComponentsOrTracks: hasComponentsOrTracksConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef =
    useRef<FormikProps<GetGeneralCharacteristicsFormTypeWithLinks>>(null);

  const history = useHistory();
  const location = useLocation();

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
    return (
      combinedModels
        .map(model => {
          return {
            label: model!.modelName!,
            value: model!.id! as string
          };
        })
        // Superficially adding 'other' as an option for existing links - does not persist to the db as an existing model plan however
        .concat({
          label: miscellaneousT('other'),
          value: 'other'
        })
    );
  }, [modelData, existingModelData, miscellaneousT]);

  const modelPlanOptionsWithoutOther = useMemo(() => {
    return modelPlanOptions.filter(option => option.value !== 'other');
  }, [modelPlanOptions]);

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
    resemblesExistingModelWhyHow,
    resemblesExistingModelHow,
    resemblesExistingModelNote,
    resemblesExistingModelWhich,
    resemblesExistingModelOtherSpecify,
    resemblesExistingModelOtherOption,
    resemblesExistingModelOtherSelected,
    participationInModelPrecondition,
    participationInModelPreconditionWhich,
    participationInModelPreconditionOtherSpecify,
    participationInModelPreconditionOtherSelected,
    participationInModelPreconditionOtherOption,
    participationInModelPreconditionWhyHow,
    participationInModelPreconditionNote,
    hasComponentsOrTracks,
    hasComponentsOrTracksDiffer,
    hasComponentsOrTracksNote
  } =
    data?.modelPlan?.generalCharacteristics ||
    ({} as GeneralCharacteristicsFormType);

  const existingModel = currentModelPlanID || existingModelID;

  const modelName = data?.modelPlan?.modelName || '';

  // Formats query data of existing links to feed into multiselect
  // Checks if Other field is selected, if so append Other to the list of existing models
  const formatExistingLinkData = useCallback(
    (
      existingLinks: ExistingModelLinks | undefined | null,
      isOtherSelected: boolean | undefined | null
    ): (string | number)[] => {
      if (!existingLinks) return [];

      const formattedLinks =
        existingLinks.links?.map(
          link => (link.existingModelID || link.currentModelPlanID)!
        ) || [];

      // Checking if Other was persisted to db, if so add it as an resemblesExistingModelLinks value
      if (isOtherSelected) {
        formattedLinks.push('other');
      }

      return formattedLinks;
    },
    []
  );

  const resemblesExistingModelLinks: (string | number)[] = useMemo(() => {
    return formatExistingLinkData(
      resemblesExistingModelWhich as ExistingModelLinks,
      resemblesExistingModelOtherSelected
    );
  }, [
    resemblesExistingModelWhich,
    resemblesExistingModelOtherSelected,
    formatExistingLinkData
  ]);

  const participationInModelPreconditionLinks: (string | number)[] =
    useMemo(() => {
      return formatExistingLinkData(
        participationInModelPreconditionWhich as ExistingModelLinks,
        participationInModelPreconditionOtherSelected
      );
    }, [
      participationInModelPreconditionWhich,
      participationInModelPreconditionOtherSelected,
      formatExistingLinkData
    ]);

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [update] = useUpdatePlanGeneralCharacteristicsMutation();

  const [updateExistingLinks] = useUpdateExistingModelLinksMutation();

  useEffect(() => {
    if (!isModalOpen && id) {
      // Submit handler for existing links as well as regular form updates
      const unblock = history.block(destination => {
        // Don't call mutation if attempting to access a locked section
        if (destination.pathname.includes('locked-task-list-section')) {
          unblock();
          history.push({
            pathname: destination.pathname,
            state: destination.state
          });
          return false;
        }

        if (destination.pathname === location.pathname) {
          return false;
        }

        const formValues = formikRef?.current?.values;

        // Getting the initial values of model links
        const {
          resemblesExistingModelLinks: resemblesExistingModelLinksInitial,
          participationInModelPreconditionLinks:
            participationInModelPreconditionLinksInitial,
          ...initialValues
        } = formikRef?.current?.initialValues || {};

        // Getting the current form values of model links
        const {
          resemblesExistingModelLinks: resemblesExistingModelLinksValues,
          participationInModelPreconditionLinks:
            participationInModelPreconditionLinksValues,
          ...values
        } = formValues || {};

        // Separates the resemblesExistingModelLinks by type (string/number) to pass into the appropriate mutation
        const resemblesExistingModelLinksToUpdate = separateLinksByType(
          resemblesExistingModelLinksValues || [],
          modelData?.modelPlanCollection || [],
          existingModelData?.existingModelCollection || []
        );

        // Separates the participationInModelPreconditionLinks by type (string/number) to pass into the appropriate mutation
        const participationInModelPreconditionLinksToUpdate =
          separateLinksByType(
            participationInModelPreconditionLinksValues || [],
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

        Promise.allSettled([
          update({
            variables: {
              id,
              changes: genCharUpdates
            }
          }),
          updateExistingLinks({
            variables: {
              modelPlanID: modelID,
              fieldName:
                ExisitingModelLinkFieldType.GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH,
              ...resemblesExistingModelLinksToUpdate
            }
          }),
          updateExistingLinks({
            variables: {
              modelPlanID: modelID,
              fieldName:
                ExisitingModelLinkFieldType.GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH,
              ...participationInModelPreconditionLinksToUpdate
            }
          })
        ])
          .then(response => {
            unblock();
            const anyError = response.find(res => res.status === 'rejected');

            if (anyError) {
              formikRef?.current?.setErrors({
                resemblesExistingModelLinks: miscellaneousT('apolloFailField')
              });
            } else {
              history.push(destination.pathname);
            }
          })
          .catch(errors => {
            unblock();
            setDestinationURL(destination.pathname);
            setIsModalOpen(true);

            formikRef?.current?.setErrors(errors);
          });
        return false;
      });

      return () => {
        unblock();
      };
    }
    return () => {};
  }, [
    history,
    id,
    update,
    isModalOpen,
    formikRef,
    setIsModalOpen,
    existingModelData?.existingModelCollection,
    miscellaneousT,
    modelData?.modelPlanCollection,
    updateExistingLinks,
    modelID,
    location.pathname
  ]);

  const initialValues: GetGeneralCharacteristicsFormTypeWithLinks = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    isNewModel: isNewModel ?? null,
    existingModel: existingModel ?? null,
    resemblesExistingModel: resemblesExistingModel ?? null,
    resemblesExistingModelWhyHow: resemblesExistingModelWhyHow ?? '',
    resemblesExistingModelLinks: resemblesExistingModelLinks ?? [],
    resemblesExistingModelOtherSpecify:
      resemblesExistingModelOtherSpecify ?? '',
    resemblesExistingModelOtherOption: resemblesExistingModelOtherOption ?? '',
    resemblesExistingModelOtherSelected:
      resemblesExistingModelOtherSelected ?? null,
    resemblesExistingModelHow: resemblesExistingModelHow ?? '',
    resemblesExistingModelNote: resemblesExistingModelNote ?? '',
    participationInModelPrecondition: participationInModelPrecondition ?? null,
    participationInModelPreconditionLinks:
      participationInModelPreconditionLinks ?? [],
    participationInModelPreconditionOtherSpecify:
      participationInModelPreconditionOtherSpecify ?? '',
    participationInModelPreconditionOtherSelected:
      participationInModelPreconditionOtherSelected ?? null,
    participationInModelPreconditionOtherOption:
      participationInModelPreconditionOtherOption ?? '',
    participationInModelPreconditionWhyHow:
      participationInModelPreconditionWhyHow ?? '',
    participationInModelPreconditionNote:
      participationInModelPreconditionNote ?? '',
    hasComponentsOrTracks: hasComponentsOrTracks ?? null,
    hasComponentsOrTracksDiffer: hasComponentsOrTracksDiffer ?? '',
    hasComponentsOrTracksNote: hasComponentsOrTracksNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        url={destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.GENERAL_CHARACTERISTICS
        ]}
      />

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
          history.push(
            `/models/${modelID}/collaboration-area/task-list/characteristics/key-characteristics`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(
          formikProps: FormikProps<GetGeneralCharacteristicsFormTypeWithLinks>
        ) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

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
                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="plan-characteristics-is-new-model">
                      {generalCharacteristicsT('isNewModel.label')}
                    </Label>

                    <BooleanRadio
                      field="isNewModel"
                      id="plan-characteristics-is-new-model"
                      value={values.isNewModel}
                      setFieldValue={setFieldValue}
                      options={isNewModelConfig.options}
                      childName="existingModel"
                    />

                    {values.isNewModel === false && (
                      <FieldGroup>
                        <Label
                          htmlFor="plan-characteristics-existing-model"
                          className="margin-bottom-1 text-normal"
                        >
                          {generalCharacteristicsT('existingModel.label')}
                        </Label>

                        <p className="text-base margin-0">
                          {generalCharacteristicsT('existingModel.sublabel')}
                        </p>

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
                            options={modelPlanOptionsWithoutOther}
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

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label
                      htmlFor="plan-characteristics-resembles-existing-model"
                      className="maxw-none"
                    >
                      {generalCharacteristicsT('resemblesExistingModel.label')}
                    </Label>

                    {getKeys(resemblesExistingModelConfig.options).map(key => (
                      <Fragment key={key}>
                        <Field
                          as={Radio}
                          id={`plan-characteristics-resembles-existing-model-${key}`}
                          data-testid={`plan-characteristics-resembles-existing-model-${key}`}
                          name="resemblesExistingModel"
                          label={resemblesExistingModelConfig.options[key]}
                          value={key}
                          checked={values.resemblesExistingModel === key}
                        />

                        {/* Conditional question if Other is selected */}
                        {key === YesNoOtherType.OTHER &&
                          values.resemblesExistingModel ===
                            YesNoOtherType.OTHER && (
                            <div className="margin-left-4 margin-top-1">
                              <Label
                                htmlFor="plan-characteristics-resembles-model-other-specify"
                                className="text-normal"
                              >
                                {generalCharacteristicsT(
                                  'resemblesExistingModelOtherSpecify.label'
                                )}
                              </Label>

                              <Field
                                as={TextInput}
                                id="plan-characteristics-resembles-existing-model-other-specify"
                                data-testid="plan-characteristics-resembles-existing-model-other-specify"
                                disabled={
                                  values.resemblesExistingModel !==
                                  YesNoOtherType.OTHER
                                }
                                name="resemblesExistingModelOtherSpecify"
                              />
                            </div>
                          )}
                      </Fragment>
                    ))}

                    {/* Conditional question if Yes or No is selected */}
                    {(values.resemblesExistingModel === YesNoOtherType.YES ||
                      values.resemblesExistingModel === YesNoOtherType.NO) && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="plan-characteristics-resembles-model-why-how"
                          className="text-normal"
                        >
                          {generalCharacteristicsT(
                            'resemblesExistingModelWhyHow.label'
                          )}
                        </Label>

                        <Field
                          as={TextAreaField}
                          className="height-15"
                          id="plan-characteristics-resembles-existing-model-why-how"
                          data-testid="plan-characteristics-resembles-existing-model--why-how"
                          name="resemblesExistingModelWhyHow"
                        />
                      </div>
                    )}

                    {/* Conditional question if Yes is selected */}
                    {values.resemblesExistingModel === YesNoOtherType.YES && (
                      <>
                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="plan-characteristics-resembles-which-model"
                            className="text-normal maxw-none"
                            id="label-plan-characteristics-resembles-which-model"
                          >
                            {generalCharacteristicsT(
                              'resemblesExistingModelWhich.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {generalCharacteristicsT(
                              'resemblesExistingModelWhich.sublabel'
                            )}
                          </p>

                          <Field
                            as={MultiSelect}
                            id="plan-characteristics-resembles-which-model"
                            ariaLabel="label-plan-characteristics-resembles-which-model"
                            name="resemblesExistingModelLinks"
                            options={modelPlanOptions}
                            selectedLabel={generalCharacteristicsT(
                              'resemblesExistingModelWhich.multiSelectLabel'
                            )}
                            onChange={(value: string[]) => {
                              setFieldValue(
                                'resemblesExistingModelLinks',
                                value
                              );
                              setFieldValue(
                                'resemblesExistingModelOtherSelected',
                                value.includes('other')
                              );
                            }}
                            initialValues={
                              initialValues.resemblesExistingModelLinks
                            }
                          />

                          {values.resemblesExistingModelLinks.includes(
                            'other'
                          ) && (
                            <div className="margin-top-1">
                              <Label
                                htmlFor="plan-characteristics-resembles-model-other-option"
                                className="text-normal"
                              >
                                {generalCharacteristicsT(
                                  'resemblesExistingModelOtherOption.label'
                                )}
                              </Label>

                              <Field
                                as={TextInput}
                                id="plan-characteristics-resembles-existing-model-other-option"
                                data-testid="plan-characteristics-resembles-existing-model-other-option"
                                name="resemblesExistingModelOtherOption"
                              />
                            </div>
                          )}
                        </FieldGroup>

                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="plan-characteristics-resembles-how-model"
                            className="text-normal"
                          >
                            {generalCharacteristicsT(
                              'resemblesExistingModelHow.label'
                            )}
                          </Label>

                          <Field
                            as={TextAreaField}
                            className="height-15"
                            id="plan-characteristics-resembles-how-model"
                            name="resemblesExistingModelHow"
                          />
                        </FieldGroup>
                      </>
                    )}

                    <AddNote
                      id="plan-characteristics-resemble-existing-note"
                      field="resemblesExistingModelNote"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label
                      htmlFor="plan-characteristics-participation-model-precondition"
                      className="maxw-none"
                    >
                      {generalCharacteristicsT(
                        'participationInModelPrecondition.label'
                      )}
                    </Label>

                    {getKeys(
                      participationInModelPreconditionConfig.options
                    ).map(key => (
                      <Fragment key={key}>
                        <Field
                          as={Radio}
                          id={`plan-characteristics-participation-model-precondition-${key}`}
                          data-testid={`plan-characteristics-participation-model-precondition-${key}`}
                          name="participationInModelPrecondition"
                          label={
                            participationInModelPreconditionConfig.options[key]
                          }
                          value={key}
                          checked={
                            values.participationInModelPrecondition === key
                          }
                        />

                        {/* Conditional question if Other is selected */}
                        {key === YesNoOtherType.OTHER &&
                          values.participationInModelPrecondition ===
                            YesNoOtherType.OTHER && (
                            <div className="margin-left-4 margin-top-1">
                              <Label
                                htmlFor="plan-characteristics-participation-model-precondition-other-specify"
                                className="text-normal"
                              >
                                {generalCharacteristicsT(
                                  'participationInModelPreconditionOtherSpecify.label'
                                )}
                              </Label>

                              <Field
                                as={TextInput}
                                id="plan-characteristics-participation-model-precondition-other-specify"
                                data-testid="plan-characteristics-participation-model-precondition-other-specify"
                                disabled={
                                  values.participationInModelPrecondition !==
                                  YesNoOtherType.OTHER
                                }
                                name="participationInModelPreconditionOtherSpecify"
                              />
                            </div>
                          )}
                      </Fragment>
                    ))}

                    {/* Conditional question if Yes is selected */}
                    {values.participationInModelPrecondition ===
                      YesNoOtherType.YES && (
                      <>
                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="plan-characteristics-participation-model-precondition-which"
                            className="text-normal maxw-none"
                            id="label-plan-characteristics-participation-model-precondition-which"
                          >
                            {generalCharacteristicsT(
                              'participationInModelPreconditionWhich.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {generalCharacteristicsT(
                              'participationInModelPreconditionWhich.sublabel'
                            )}
                          </p>

                          <Field
                            as={MultiSelect}
                            id="plan-characteristics-participation-model-precondition-which"
                            ariaLabel="label-plan-characteristics-participation-model-precondition-which"
                            name="participationInModelPreconditionLinks"
                            options={modelPlanOptions}
                            selectedLabel={generalCharacteristicsT(
                              'participationInModelPreconditionWhich.multiSelectLabel'
                            )}
                            onChange={(value: string[]) => {
                              setFieldValue(
                                'participationInModelPreconditionLinks',
                                value
                              );
                              setFieldValue(
                                'participationInModelPreconditionOtherSelected',
                                value.includes('other')
                              );
                            }}
                            initialValues={
                              initialValues.participationInModelPreconditionLinks
                            }
                          />

                          {values.participationInModelPreconditionLinks.includes(
                            'other'
                          ) && (
                            <div className="margin-top-1">
                              <Label
                                htmlFor="plan-characteristics-participation-model-precondition-other-option"
                                className="text-normal"
                              >
                                {generalCharacteristicsT(
                                  'participationInModelPreconditionOtherOption.label'
                                )}
                              </Label>

                              <Field
                                as={TextInput}
                                id="plan-characteristics-participation-model-precondition-other-option"
                                data-testid="plan-characteristics-participation-model-precondition-other-option"
                                name="participationInModelPreconditionOtherOption"
                              />
                            </div>
                          )}
                        </FieldGroup>

                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="plan-characteristics-participation-model-precondition-why-how"
                            className="text-normal"
                          >
                            {generalCharacteristicsT(
                              'participationInModelPreconditionWhyHow.label'
                            )}
                          </Label>

                          <Field
                            as={TextAreaField}
                            className="height-15"
                            id="plan-characteristics-participation-model-precondition-why-how"
                            name="participationInModelPreconditionWhyHow"
                          />
                        </FieldGroup>
                      </>
                    )}

                    <AddNote
                      id="plan-characteristics-participation-model-precondition-note"
                      field="participationInModelPreconditionNote"
                    />
                  </FieldGroup>

                  <FieldGroup className="margin-y-4 margin-bottom-8">
                    <Label htmlFor="plan-characteristics-has-component-or-tracks">
                      {generalCharacteristicsT('hasComponentsOrTracks.label')}
                    </Label>

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
                          >
                            <Label
                              htmlFor="plan-characteristics-tracks-differ-how"
                              className="margin-bottom-1 text-normal"
                            >
                              {generalCharacteristicsT(
                                'hasComponentsOrTracksDiffer.label'
                              )}
                            </Label>

                            <Field
                              as={TextAreaField}
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
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/characteristics"
              exact
              render={() => <CharacteristicsContent />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/characteristics/key-characteristics"
              exact
              render={() => <KeyCharacteristics />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/characteristics/involvements"
              exact
              render={() => <Involvements />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/characteristics/targets-and-options"
              exact
              render={() => <TargetsAndOptions />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/characteristics/authority"
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
// Separates all selected resemblesExistingModelLinks values into a type of either draftModelPlans or existingModelPlans
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

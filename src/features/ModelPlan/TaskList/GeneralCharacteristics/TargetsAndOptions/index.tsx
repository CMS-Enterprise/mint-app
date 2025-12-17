import React, { Fragment, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  GridContainer,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  AgreementType,
  GeographyApplication,
  GeographyType,
  GetTargetsAndOptionsQuery,
  TypedUpdatePlanGeneralCharacteristicsDocument,
  useGetTargetsAndOptionsQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MTOWarning from 'components/MTOWarning';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

type TargetsAndOptionsFormType =
  GetTargetsAndOptionsQuery['modelPlan']['generalCharacteristics'];

const TargetsAndOptions = () => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    geographiesTargeted: geographiesTargetedConfig,
    geographiesTargetedTypes: geographiesTargetedTypesConfig,
    geographiesTargetedAppliedTo: geographiesTargetedAppliedToConfig,
    geographiesStatesAndTerritories: geographiesStatesAndTerritoriesConfig,
    geographiesRegionTypes: geographiesRegionTypesConfig,
    participationOptions: participationOptionsConfig,
    agreementTypes: agreementTypesConfig,
    multiplePatricipationAgreementsNeeded:
      multiplePatricipationAgreementsNeededConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<TargetsAndOptionsFormType>>(null);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useGetTargetsAndOptionsQuery({
    variables: {
      id: modelID
    }
  });

  const { modelName, abbreviation } = useContext(ModelInfoContext);

  const {
    id,
    geographiesTargeted,
    geographiesTargetedTypes,
    geographiesTargetedTypesOther,
    geographiesStatesAndTerritories,
    geographiesRegionTypes,
    geographiesTargetedAppliedTo,
    geographiesTargetedAppliedToOther,
    geographiesTargetedNote,
    participationOptions,
    participationOptionsNote,
    agreementTypes,
    agreementTypesOther,
    multiplePatricipationAgreementsNeeded,
    multiplePatricipationAgreementsNeededNote
  } = (data?.modelPlan?.generalCharacteristics ||
    {}) as TargetsAndOptionsFormType;

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanGeneralCharacteristicsDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const initialValues: TargetsAndOptionsFormType = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    geographiesTargeted: geographiesTargeted ?? null,
    geographiesTargetedTypes: geographiesTargetedTypes ?? [],
    geographiesTargetedTypesOther: geographiesTargetedTypesOther ?? '',
    geographiesStatesAndTerritories: geographiesStatesAndTerritories ?? [],
    geographiesRegionTypes: geographiesRegionTypes ?? [],
    geographiesTargetedAppliedTo: geographiesTargetedAppliedTo ?? [],
    geographiesTargetedAppliedToOther: geographiesTargetedAppliedToOther ?? '',
    geographiesTargetedNote: geographiesTargetedNote ?? null,
    participationOptions: participationOptions ?? null,
    participationOptionsNote: participationOptionsNote ?? '',
    agreementTypes: agreementTypes ?? [],
    agreementTypesOther: agreementTypesOther ?? '',
    multiplePatricipationAgreementsNeeded:
      multiplePatricipationAgreementsNeeded ?? null,
    multiplePatricipationAgreementsNeededNote:
      multiplePatricipationAgreementsNeededNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <MainContent data-testid="general-characteristics-targets-and-options">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
          url={mutationError.destinationURL}
        />
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.TASK_LIST,
            BreadcrumbItemOptions.GENERAL_CHARACTERISTICS
          ]}
        />

        <PageHeading className="margin-top-4 margin-bottom-2" ref={headerRef}>
          {generalCharacteristicsMiscT('heading')}
        </PageHeading>

        <p
          className="margin-top-0 margin-bottom-1 font-body-lg"
          data-testid="model-plan-name"
        >
          {miscellaneousT('for')} {modelName}
        </p>
      </GridContainer>
      <StickyModelNameWrapper triggerRef={headerRef}>
        <div className="padding-y-2">
          <h3 className="margin-y-0">
            {generalCharacteristicsMiscT('modelPlanHeading', {
              heading: generalCharacteristicsMiscT('heading')
            })}
          </h3>
          <p className="margin-y-0 font-body-lg" data-testid="model-plan-name">
            {miscellaneousT('for')} {modelName}
            {abbreviation && ` (${abbreviation})`}
          </p>
        </div>
      </StickyModelNameWrapper>

      <GridContainer>
        <p className="margin-bottom-2 font-body-md line-height-sans-4">
          {miscellaneousT('helpText')}
        </p>

        <AskAQuestion modelID={modelID} />

        <Formik
          initialValues={initialValues}
          onSubmit={() => {
            navigate(
              `/models/${modelID}/collaboration-area/model-plan/characteristics/authority`
            );
          }}
          enableReinitialize
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<TargetsAndOptionsFormType>) => {
            const { handleSubmit, setErrors, setFieldValue, values } =
              formikProps;

            return (
              <>
                <ConfirmLeave />

                <MINTForm
                  className="desktop:grid-col-6 margin-top-6"
                  data-testid="plan-characteristics-targets-and-options-form"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    <FieldGroup className="margin-y-4 margin-bottom-8">
                      <Label htmlFor="plan-characteristics-geographies-targeted">
                        {generalCharacteristicsT('geographiesTargeted.label')}
                      </Label>

                      <BooleanRadio
                        field="geographiesTargeted"
                        id="plan-characteristics-geographies-targeted"
                        value={values.geographiesTargeted}
                        setFieldValue={setFieldValue}
                        options={geographiesTargetedConfig.options}
                      />

                      {values.geographiesTargeted && (
                        <>
                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="plan-characteristics-geographies-type"
                              className="text-normal"
                            >
                              {generalCharacteristicsT(
                                'geographiesTargetedTypes.label'
                              )}
                            </Label>

                            {getKeys(
                              geographiesTargetedTypesConfig.options
                            ).map(type => (
                              <Fragment key={type}>
                                <Field
                                  as={CheckboxField}
                                  id={`plan-characteristics-geographies-type-${type}`}
                                  name="geographiesTargetedTypes"
                                  label={
                                    geographiesTargetedTypesConfig.options[type]
                                  }
                                  value={type}
                                  checked={values.geographiesTargetedTypes.includes(
                                    type
                                  )}
                                />

                                {type === GeographyType.STATE &&
                                  values.geographiesTargetedTypes.includes(
                                    type
                                  ) && (
                                    <FieldGroup className="margin-left-4 margin-y-2">
                                      <Label
                                        htmlFor="plan-characteristics-geographies-state-and-territories-type"
                                        className="text-normal"
                                      >
                                        {generalCharacteristicsT(
                                          'geographiesStatesAndTerritories.label'
                                        )}
                                      </Label>
                                      <Field
                                        as={MultiSelect}
                                        id="plan-characteristics-geographies-state-and-territories-type"
                                        name="geographiesStatesAndTerritories"
                                        ariaLabel="label-plan-characteristics-geographies-state-and-territories-type"
                                        role="combobox"
                                        options={composeMultiSelectOptions(
                                          geographiesStatesAndTerritoriesConfig.options
                                        )}
                                        selectedLabel={generalCharacteristicsT(
                                          'geographiesStatesAndTerritories.multiSelectLabel'
                                        )}
                                        onChange={(value: string[] | []) => {
                                          setFieldValue(
                                            'geographiesStatesAndTerritories',
                                            value
                                          );
                                        }}
                                        initialValues={
                                          initialValues.geographiesStatesAndTerritories
                                        }
                                      />
                                    </FieldGroup>
                                  )}

                                {type === GeographyType.REGION &&
                                  values.geographiesTargetedTypes.includes(
                                    type
                                  ) && (
                                    <FieldGroup className="margin-left-4 margin-y-2">
                                      {getKeys(
                                        geographiesRegionTypesConfig.options
                                      ).map(regionType => (
                                        <Fragment key={regionType}>
                                          <Field
                                            as={CheckboxField}
                                            id={`plan-characteristics-geographies-region-type-${regionType}`}
                                            name="geographiesRegionTypes"
                                            label={
                                              geographiesRegionTypesConfig
                                                .options[regionType]
                                            }
                                            value={regionType}
                                            checked={values.geographiesRegionTypes?.includes(
                                              regionType
                                            )}
                                          />
                                        </Fragment>
                                      ))}
                                    </FieldGroup>
                                  )}
                                {type === GeographyType.OTHER &&
                                  values.geographiesTargetedTypes.includes(
                                    type
                                  ) && (
                                    <FieldGroup className="margin-left-4 margin-y-2">
                                      <Label
                                        htmlFor="plan-characteristics-geographies-targeted-other"
                                        className="text-normal"
                                      >
                                        {generalCharacteristicsT(
                                          'geographiesTargetedTypesOther.label'
                                        )}
                                      </Label>
                                      <Field
                                        as={TextInput}
                                        data-testid="plan-characteristics-geographies-targeted-other"
                                        id="plan-characteristics-geographies-targeted-other"
                                        name="geographiesTargetedTypesOther"
                                      />
                                    </FieldGroup>
                                  )}
                              </Fragment>
                            ))}
                          </FieldGroup>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="plan-characteristics-geographies-applied-to"
                              className="text-normal"
                            >
                              {generalCharacteristicsT(
                                'geographiesTargetedAppliedTo.label'
                              )}
                            </Label>

                            {getKeys(
                              geographiesTargetedAppliedToConfig.options
                            ).map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    as={CheckboxField}
                                    id={`plan-characteristics-geographies-applied-to-${type}`}
                                    name="geographiesTargetedAppliedTo"
                                    label={
                                      geographiesTargetedAppliedToConfig
                                        .options[type]
                                    }
                                    value={type}
                                    checked={values.geographiesTargetedAppliedTo.includes(
                                      type
                                    )}
                                  />

                                  {type === GeographyApplication.OTHER &&
                                    values.geographiesTargetedAppliedTo.includes(
                                      type
                                    ) && (
                                      <FieldGroup className="margin-left-4 margin-top-2 margin-bottom-0">
                                        <Label
                                          htmlFor="plan-characteristics-geographies-applied-to-other"
                                          className="text-normal"
                                        >
                                          {generalCharacteristicsT(
                                            'geographiesTargetedAppliedToOther.label'
                                          )}
                                        </Label>
                                        <Field
                                          as={TextInput}
                                          id="plan-characteristics-geographies-applied-to-other"
                                          name="geographiesTargetedAppliedToOther"
                                        />
                                      </FieldGroup>
                                    )}
                                </Fragment>
                              );
                            })}
                          </FieldGroup>
                        </>
                      )}
                      <AddNote
                        id="plan-characteristics-geographies-targeted-note"
                        field="geographiesTargetedNote"
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-y-4">
                      <Label htmlFor="plan-characteristics-participation">
                        {generalCharacteristicsT('participationOptions.label')}
                      </Label>

                      <BooleanRadio
                        field="participationOptions"
                        id="plan-characteristics-participation"
                        value={values.participationOptions}
                        setFieldValue={setFieldValue}
                        options={participationOptionsConfig.options}
                      />
                    </FieldGroup>

                    <AddNote
                      id="plan-characteristics-participation-note"
                      field="participationOptionsNote"
                    />

                    <FieldGroup scrollElement="agreementTypes">
                      <Label htmlFor="plan-characteristics-agreement-type">
                        {generalCharacteristicsT('agreementTypes.label')}
                      </Label>

                      <MTOWarning id="ops-eval-and-learning-data-needed-warning" />

                      <p className="text-base margin-y-1">
                        {generalCharacteristicsT('agreementTypes.sublabel')}
                      </p>

                      {getKeys(agreementTypesConfig.options).map(type => (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`plan-characteristics-agreement-type-${type}`}
                            name="agreementTypes"
                            label={agreementTypesConfig.options[type]}
                            value={type}
                            checked={values.agreementTypes.includes(type)}
                          />
                          {type === AgreementType.OTHER &&
                            values.agreementTypes.includes(type) && (
                              <FieldGroup className="margin-left-4 margin-top-2 margin-bottom-0">
                                <Label
                                  htmlFor="plan-characteristics-agreement-type-other"
                                  className="text-normal"
                                >
                                  {generalCharacteristicsT(
                                    'agreementTypesOther.label'
                                  )}
                                </Label>

                                <Field
                                  as={TextInput}
                                  id="plan-characteristics-agreement-type-other"
                                  name="agreementTypesOther"
                                />
                              </FieldGroup>
                            )}
                        </Fragment>
                      ))}
                    </FieldGroup>

                    {values.agreementTypes.includes(
                      AgreementType.PARTICIPATION
                    ) && (
                      <>
                        <FieldGroup className="margin-y-4">
                          <Label
                            htmlFor="plan-characteristics-multiple-participation-needed"
                            className="text-normal"
                          >
                            {generalCharacteristicsT(
                              'multiplePatricipationAgreementsNeeded.label'
                            )}
                          </Label>

                          <p className="text-base margin-y-1">
                            {generalCharacteristicsT(
                              'multiplePatricipationAgreementsNeeded.sublabel'
                            )}
                          </p>

                          <BooleanRadio
                            field="multiplePatricipationAgreementsNeeded"
                            id="plan-characteristics-multiple-participation-needed"
                            value={values.multiplePatricipationAgreementsNeeded}
                            setFieldValue={setFieldValue}
                            options={
                              multiplePatricipationAgreementsNeededConfig.options
                            }
                          />
                        </FieldGroup>
                      </>
                    )}
                    <AddNote
                      id="plan-characteristics-multiple-participation-needed-note"
                      field="multiplePatricipationAgreementsNeededNote"
                    />

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() => {
                          navigate(
                            `/models/${modelID}/collaboration-area/model-plan/characteristics/involvements`
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
                        navigate(
                          `/models/${modelID}/collaboration-area/model-plan`
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
                </MINTForm>
              </>
            );
          }}
        </Formik>
        <PageNumber currentPage={4} totalPages={5} className="margin-y-6" />
      </GridContainer>
    </MainContent>
  );
};

export default TargetsAndOptions;

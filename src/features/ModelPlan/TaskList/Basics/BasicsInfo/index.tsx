import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BlockerFunction,
  useBlocker,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Link as TrussLink,
  Radio,
  SummaryBox,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  CmsCenter,
  GetBasicsQuery,
  ModelCategory,
  useGetBasicsQuery,
  useUpdateModelPlanAndBasicsMutation
} from 'gql/generated/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import RequiredAsterisk from 'components/RequiredAsterisk';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import Tooltip from 'components/Tooltip';
import { useErrorMessage } from 'contexts/ErrorContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useStickyHeader from 'hooks/useStickyHeader';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import dirtyInput from 'utils/formUtil';
import sanitizeStatus from 'utils/status';
import planBasicsSchema from 'validations/planBasics';

type ModelPlanInfoFormType = Omit<GetBasicsQuery['modelPlan'], 'nameHistory'>;

const BasicsInfo = () => {
  const { t: modelPlanT } = useTranslation('modelPlan');
  const { t: basicsT } = useTranslation('basics');
  const { t: basicsMiscT } = useTranslation('basicsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    modelCategory: modelCategoryConfig,
    additionalModelCategories: additionalModelCategoriesConfig,
    cmsCenters: cmsCentersConfig,
    cmmiGroups: cmmiGroupsConfig
  } = usePlanTranslation('basics');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const formikRef = useRef<FormikProps<ModelPlanInfoFormType>>(null);

  const navigate = useNavigate();
  const {
    headerRef: basicsInfoRef,
    modelName: stickyModelName,
    abbreviation: stickyAbbreviation
  } = useStickyHeader();

  const { data, loading, error } = useGetBasicsQuery({
    variables: {
      id: modelID
    }
  });

  const { nameHistory } = data?.modelPlan || {};

  const {
    id,
    modelName: queryModelName,
    abbreviation: queryAbbreviation,
    basics
  } = (data?.modelPlan || {}) as ModelPlanInfoFormType;

  const modelName = queryModelName;
  const abbreviation = queryAbbreviation;

  const filteredNameHistory = nameHistory?.filter(
    previousName => previousName !== modelName
  );

  const {
    demoCode,
    amsModelID,
    modelCategory,
    additionalModelCategories,
    cmsCenters,
    cmmiGroups
  } = basics || {};

  const { pathname } = useLocation();

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingLocation, setPendingLocation] = useState<string | null>(null);

  const [update] = useUpdateModelPlanAndBasicsMutation();

  // Skip global error handling, this is handled by the mutation modal
  useErrorMessage('skip', true);

  // Create a blocker function that determines if navigation should be blocked
  const shouldBlock: BlockerFunction = tx => {
    // Don't call mutation if attempting to access a locked section
    if (tx.nextLocation.pathname.includes('locked-task-list-section')) {
      return false;
    }

    if (tx.nextLocation.pathname === pathname) {
      return false;
    }

    if (!formikRef.current?.values.modelName) {
      formikRef?.current?.setFieldError('modelName', 'Enter the Model name');
      return false;
    }

    const updateId = formikRef?.current?.initialValues.id;
    const basicsId = formikRef?.current?.values.basics.id;

    const changes = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    const basicsChanges = dirtyInput(
      formikRef?.current?.initialValues.basics,
      formikRef?.current?.values.basics
    );

    // If no changes, don't call mutation
    if (Object.keys(changes).length === 0) {
      return false;
    }

    // Store the pending location for later navigation
    setPendingLocation(tx.nextLocation.pathname);

    if (changes.status) {
      changes.status = sanitizeStatus(changes.status);
    }

    // If no changes, don't call mutation
    if (
      Object.keys(changes).length === 0 &&
      Object.keys(basicsChanges).length === 0
    ) {
      return false;
    }

    const { modelName: updateModelName, abbreviation: updateAbbreviation } =
      changes;

    update({
      variables: {
        id: updateId ?? '',
        changes: {
          modelName: updateModelName,
          abbreviation: updateAbbreviation
        },
        basicsId: basicsId ?? '',
        basicsChanges
      }
    })
      .then(response => {
        if (!response?.errors) {
          setDestinationURL(tx.nextLocation.pathname);
          blocker?.proceed?.();
        }
      })
      .catch(errors => {
        setDestinationURL(tx.nextLocation.pathname);
        setIsModalOpen(true);

        formikRef?.current?.setErrors(errors);
        blocker?.proceed?.();
      });

    return true; // Block the navigation
  };

  // Use the useBlocker hook
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (destinationURL && !isModalOpen) {
      blocker?.proceed?.();
    }
  }, [destinationURL, isModalOpen, blocker]);

  // Handle the blocker state
  useEffect(() => {
    if (blocker.state === 'blocked' && pendingLocation) {
      // The navigation was blocked, we can handle it here if needed
      // The mutation is already running from the shouldBlock function
    }
  }, [blocker.state, pendingLocation]);

  const clearDestinationURL = () => setDestinationURL('');

  const closeModal = ({
    clearDestination = true
  }: { clearDestination?: boolean } = {}) => {
    setIsModalOpen(false);
    if (clearDestination) {
      clearDestinationURL();
    }
  };

  const initialValues: ModelPlanInfoFormType = {
    __typename: 'ModelPlan',
    id: id ?? '',
    modelName: modelName ?? '',
    abbreviation: abbreviation ?? '',
    basics: {
      __typename: 'PlanBasics',
      id: basics?.id ?? '',
      demoCode: demoCode ?? '',
      amsModelID: amsModelID ?? '',
      modelCategory: modelCategory ?? null,
      additionalModelCategories: additionalModelCategories ?? [],
      cmsCenters: cmsCenters ?? [],
      cmmiGroups: cmmiGroups ?? []
    }
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="model-plan-basics">
      <GridContainer>
        <MutationErrorModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          url={destinationURL}
        />

        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.TASK_LIST,
            BreadcrumbItemOptions.BASICS
          ]}
        />
        <PageHeading className="margin-top-4" ref={basicsInfoRef}>
          {basicsMiscT('heading')}
        </PageHeading>
      </GridContainer>
      <StickyModelNameWrapper
        triggerRef={basicsInfoRef}
        sectionHeading={basicsMiscT('heading')}
        modelName={stickyModelName}
        abbreviation={stickyAbbreviation || undefined}
      />
      <GridContainer>
        <p className="margin-top-1 margin-bottom-2 line-height-sans-3">
          {basicsMiscT('description')}
        </p>

        <AskAQuestion modelID={modelID} />

        <p className="margin-bottom-0 margin-top-6">
          {basicsMiscT('required1')}
          <RequiredAsterisk />
          {basicsMiscT('required2')}
        </p>

        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            navigate(
              `/models/${modelID}/collaboration-area/model-plan/basics/overview`
            );
          }}
          enableReinitialize
          validationSchema={planBasicsSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<ModelPlanInfoFormType>) => {
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
                <ConfirmLeave />

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
                <GridContainer className="padding-x-0">
                  <Grid row gap>
                    <Grid desktop={{ col: 6 }}>
                      <MINTForm
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          handleSubmit(e);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <Fieldset disabled={!!error || loading}>
                          <FieldGroup
                            scrollElement="modelName"
                            error={!!flatErrors.modelName}
                            className="margin-top-4"
                          >
                            <Label htmlFor="plan-basics-model-name">
                              {modelPlanT('modelName.label')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>
                              {flatErrors.modelName}
                            </FieldErrorMsg>

                            <Field
                              as={TextInput}
                              id="plan-basics-model-name"
                              maxLength={200}
                              name="modelName"
                              data-testid="plan-basics-model-name"
                            />
                          </FieldGroup>

                          <FieldGroup className="margin-top-4">
                            <Label htmlFor="plan-basics-abbreviation">
                              {modelPlanT('abbreviation.label')}
                            </Label>

                            <span className="usa-hint display-block text-normal margin-top-1">
                              {modelPlanT('abbreviation.sublabel')}
                            </span>

                            <Field
                              as={TextInput}
                              id="plan-basics-abbreviation"
                              maxLength={50}
                              name="abbreviation"
                            />
                          </FieldGroup>

                          <div
                            className={classNames(
                              'bg-base-lightest padding-2 margin-top-4',
                              {
                                'maxw-mobile-lg': isTablet
                              }
                            )}
                          >
                            <Label
                              htmlFor="plan-basics-demo-code"
                              className="margin-top-0"
                            >
                              {basicsMiscT('otherIdentifiers')}
                            </Label>

                            <p className="line-height-mono-4">
                              {basicsMiscT('otherIdentifiersInfo1')}

                              <TrussLink
                                aria-label="Open AMS in a new tab"
                                href="https://ams.cmmi.cms.gov"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="external"
                              >
                                {basicsMiscT('otherIdentifiersInfo2')}
                              </TrussLink>

                              {basicsMiscT('otherIdentifiersInfo3')}
                            </p>
                            <Grid row gap>
                              <Grid desktop={{ col: 6 }}>
                                <FieldGroup className="margin-top-0">
                                  <Label htmlFor="plan-basics-ams-model-id">
                                    {basicsT('amsModelID.label')}
                                  </Label>

                                  <Field
                                    as={TextInput}
                                    id="plan-basics-ams-model-id"
                                    maxLength={50}
                                    name="basics.amsModelID"
                                  />
                                </FieldGroup>
                              </Grid>
                              <Grid desktop={{ col: 6 }}>
                                <FieldGroup className="margin-top-0">
                                  <Label htmlFor="plan-basics-demo-code">
                                    {basicsT('demoCode.label')}
                                  </Label>

                                  <Field
                                    as={TextInput}
                                    id="plan-basics-demo-code"
                                    maxLength={50}
                                    name="basics.demoCode"
                                  />
                                </FieldGroup>
                              </Grid>
                            </Grid>
                          </div>

                          <FieldGroup
                            scrollElement="plan-basics-model-category"
                            error={!!flatErrors['basics.modelCategory']}
                            className="margin-top-4"
                          >
                            <Label htmlFor="plan-basics-model-category">
                              {basicsT('modelCategory.label')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>
                              {flatErrors['basics.modelCategory']}
                            </FieldErrorMsg>

                            <Fieldset>
                              {getKeys(modelCategoryConfig.options).map(key => (
                                <Fragment key={key}>
                                  <Field
                                    as={Radio}
                                    id={`plan-basics-model-category-${key}`}
                                    data-testid={`plan-basics-model-category-${key}`}
                                    name="basics.modelCategory"
                                    label={
                                      <span
                                        className="display-flex flex-align-center"
                                        style={{ gap: '4px' }}
                                      >
                                        {modelCategoryConfig.options[key]}
                                        {key !==
                                          ModelCategory.TO_BE_DETERMINED && (
                                          <Tooltip
                                            label={
                                              modelCategoryConfig.tooltips?.[
                                                key
                                              ] || ''
                                            }
                                            position="right"
                                          >
                                            <Icon.Info
                                              className="text-base-light"
                                              aria-label="info"
                                            />
                                          </Tooltip>
                                        )}
                                      </span>
                                    }
                                    value={key}
                                    checked={
                                      values.basics.modelCategory === key
                                    }
                                    // the onChange below is necessary to have a dynamic interaction
                                    // with the Additional Model Categories question
                                    onChange={() => {
                                      setFieldValue(
                                        'basics.modelCategory',
                                        key
                                      );
                                      if (
                                        values.basics.additionalModelCategories.includes(
                                          key
                                        )
                                      ) {
                                        values.basics.additionalModelCategories.splice(
                                          values.basics.additionalModelCategories.indexOf(
                                            key
                                          ),
                                          1
                                        );
                                      }
                                    }}
                                  />
                                </Fragment>
                              ))}
                            </Fieldset>
                          </FieldGroup>

                          <FieldGroup className="margin-top-4">
                            <Label
                              htmlFor="plan-basics-model-additional-category"
                              className="text-normal"
                            >
                              {basicsT('additionalModelCategories.label')}
                            </Label>

                            <span className="usa-hint display-block text-normal margin-top-1">
                              {basicsT('additionalModelCategories.sublabel')}
                            </span>

                            {getKeys(additionalModelCategoriesConfig.options)
                              .filter(
                                key => key !== ModelCategory.TO_BE_DETERMINED
                              )
                              .map(group => {
                                return (
                                  <Fragment key={group}>
                                    <Field
                                      as={CheckboxField}
                                      id={`plan-basics-model-additional-category-${group}`}
                                      testid={`plan-basics-model-additional-category-${group}`}
                                      name="basics.additionalModelCategories"
                                      disabled={
                                        values.basics.modelCategory === group
                                      }
                                      label={
                                        <span
                                          className="display-flex flex-align-center"
                                          style={{ gap: '4px' }}
                                        >
                                          {
                                            additionalModelCategoriesConfig
                                              .options[group]
                                          }

                                          <Tooltip
                                            label={
                                              additionalModelCategoriesConfig
                                                .tooltips?.[group] || ''
                                            }
                                            position="right"
                                          >
                                            <Icon.Info
                                              className="text-base-light"
                                              aria-label="info"
                                            />
                                          </Tooltip>
                                        </span>
                                      }
                                      value={group}
                                      checked={values.basics.additionalModelCategories.includes(
                                        group
                                      )}
                                    />
                                  </Fragment>
                                );
                              })}
                          </FieldGroup>

                          <FieldGroup
                            scrollElement="new-plan-cmsCenters"
                            error={!!flatErrors['basics.cmsCenters']}
                            className="margin-top-4"
                          >
                            <Label htmlFor="new-plan-cmsCenters">
                              {basicsT('cmsCenters.label')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>
                              {flatErrors['basics.cmsCenters']}
                            </FieldErrorMsg>

                            {getKeys(cmsCentersConfig.options).map(center => {
                              return (
                                <Field
                                  key={center}
                                  as={CheckboxField}
                                  id={`new-plan-cmsCenters-${center}`}
                                  name="basics.cmsCenters"
                                  label={cmsCentersConfig.options[center]}
                                  value={center}
                                  checked={values.basics.cmsCenters.includes(
                                    center
                                  )}
                                />
                              );
                            })}
                          </FieldGroup>

                          <FieldGroup
                            scrollElement="new-plan-cmmiGroup"
                            error={!!flatErrors['basics.cmmiGroups']}
                            className="margin-top-4"
                          >
                            <Label
                              htmlFor="new-plan-cmmiGroup"
                              className="text-normal"
                            >
                              {basicsT('cmmiGroups.label')}
                            </Label>

                            <p className="text-base margin-bottom-1 margin-top-1">
                              {basicsT('cmmiGroups.sublabel')}
                            </p>

                            <FieldErrorMsg>
                              {flatErrors['basics.cmmiGroups']}
                            </FieldErrorMsg>

                            {getKeys(cmmiGroupsConfig.options).map(group => {
                              return (
                                <Fragment key={group}>
                                  <Field
                                    as={CheckboxField}
                                    disabled={
                                      !values.basics.cmsCenters.includes(
                                        CmsCenter.CMMI
                                      )
                                    }
                                    id={`new-plan-cmmiGroup-${group}`}
                                    name="basics.cmmiGroups"
                                    label={cmmiGroupsConfig.options[group]}
                                    value={group}
                                    checked={values.basics.cmmiGroups.includes(
                                      group
                                    )}
                                  />
                                </Fragment>
                              );
                            })}
                          </FieldGroup>

                          <div className="margin-top-6 margin-bottom-3">
                            <Button
                              type="submit"
                              disabled={!(dirty || isValid)}
                              onClick={() => setErrors({})}
                            >
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
                    </Grid>

                    <Grid desktop={{ col: 6 }}>
                      {filteredNameHistory &&
                        filteredNameHistory.length > 0 && (
                          <SummaryBox
                            className="margin-top-6"
                            data-testid="summary-box--previous-name"
                          >
                            <p className="margin-y-0 text-bold">
                              {basicsMiscT('previousNames')}
                            </p>

                            <ul className="margin-top-1 margin-bottom-0 padding-left-2">
                              {filteredNameHistory.map(previousName => {
                                return (
                                  <li key={`${modelName}-${previousName}`}>
                                    {previousName}
                                  </li>
                                );
                              })}
                            </ul>
                          </SummaryBox>
                        )}
                    </Grid>
                  </Grid>
                </GridContainer>
              </>
            );
          }}
        </Formik>

        <PageNumber
          currentPage={1}
          totalPages={2}
          className="margin-bottom-10"
        />
      </GridContainer>
    </MainContent>
  );
};

export default BasicsInfo;

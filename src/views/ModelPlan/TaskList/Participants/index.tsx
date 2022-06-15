import React, { useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ComboBox,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanParticipantsAndProviders from 'queries/GetModelPlanParticipantsAndProviders';
import {
  GetModelPlanProvidersAndParticipants as GetModelPlanProvidersAndParticipantsType,
  GetModelPlanProvidersAndParticipants_modelPlan_providersAndParticipants as ModelPlanParticipantsAndProvidersFormType
} from 'queries/types/GetModelPlanProvidersAndParticipants';
import { UpdateModelPlanProvidersAndParticipantsVariables } from 'queries/types/UpdateModelPlanProvidersAndParticipants';
import UpdateModelPlanProvidersAndParticipants from 'queries/UpdateModelPlanProvidersAndParticipants';
import { ParticipantsType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { sortOtherEnum, translateParticipantsType } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

export const ParticipantsAndProvidersContent = () => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<
    FormikProps<ModelPlanParticipantsAndProvidersFormType>
  >(null);
  const history = useHistory();

  const { data } = useQuery<GetModelPlanProvidersAndParticipantsType>(
    GetModelPlanParticipantsAndProviders,
    {
      variables: {
        id: modelID
      }
    }
  );

  const {
    id,
    participants,
    medicareProviderType,
    statesEngagement,
    participantsOther,
    participantsNote,
    participantsCurrentlyInModels,
    participantsCurrentlyInModelsNote,
    modelApplicationLevel
  } =
    data?.modelPlan?.providersAndParticipants ||
    ({} as ModelPlanParticipantsAndProvidersFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [
    update
  ] = useMutation<UpdateModelPlanProvidersAndParticipantsVariables>(
    UpdateModelPlanProvidersAndParticipants
  );

  const handleFormSubmit = (
    formikValues: ModelPlanParticipantsAndProvidersFormType,
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
              `/models/${modelID}/task-list/participants-and-providers/key-characteristics`
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

  const mappedParticipants = Object.keys(ParticipantsType)
    .sort(sortOtherEnum)
    .map(key => ({
      value: key,
      label: translateParticipantsType(key)
    }));

  const initialValues = {
    participants: participants ?? [],
    medicareProviderType: medicareProviderType ?? [],
    statesEngagement: statesEngagement ?? '',
    participantsOther: participantsOther ?? '',
    participantsNote: participantsNote ?? '',
    participantsCurrentlyInModels: participantsCurrentlyInModels ?? null,
    participantsCurrentlyInModelsNote: participantsCurrentlyInModelsNote ?? '',
    modelApplicationLevel: modelApplicationLevel ?? ''
  } as ModelPlanParticipantsAndProvidersFormType;

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
        {(
          formikProps: FormikProps<ModelPlanParticipantsAndProvidersFormType>
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
                className="tablet:grid-col-6 margin-top-6"
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
                  <Label
                    htmlFor="participants-and-providers-participants"
                    className="text-normal"
                  >
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
                    initialValues={initialValues.participants}
                  />

                  <AddNote
                    id="participants-and-providers-participants"
                    field="participants"
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
      <PageNumber currentPage={1} totalPages={5} className="margin-y-6" />
    </>
  );
};

export const ParticipantsAndProviders = () => {
  return (
    <MainContent data-testid="model-participants-and-providers">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Route
              path="/models/:modelID/task-list/participants-and-providers"
              exact
              render={() => <ParticipantsAndProvidersContent />}
            />
            {/* <Route
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
            /> */}
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ParticipantsAndProviders;

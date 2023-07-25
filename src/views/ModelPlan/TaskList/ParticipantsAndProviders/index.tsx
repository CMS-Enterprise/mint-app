import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
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
  SummaryBox
} from '@trussworks/react-uswds';
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
import GetParticipantsAndProviders from 'queries/ParticipantsAndProviders/GetParticipantsAndProviders';
import {
  GetParticipantsAndProviders as GetParticipantsAndProvidersType,
  GetParticipantsAndProviders_modelPlan_participantsAndProviders as ParticipantsAndProvidersFormType,
  GetParticipantsAndProvidersVariables
} from 'queries/ParticipantsAndProviders/types/GetParticipantsAndProviders';
import { UpdatePlanParticipantsAndProvidersVariables } from 'queries/ParticipantsAndProviders/types/UpdatePlanParticipantsAndProviders';
import UpdatePlanParticipantsAndProviders from 'queries/ParticipantsAndProviders/UpdatePlanParticipantsAndProviders';
import { ParticipantsType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  mapMultiSelectOptions,
  translateParticipantsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import Communication from './Communication';
import Coordination from './Coordination';
import ParticipantOptions from './ParticipantOptions';
import ProviderOptions from './ProviderOptions';

import './index.scss';

export const ParticipantsAndProvidersContent = () => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ParticipantsAndProvidersFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetParticipantsAndProvidersType,
    GetParticipantsAndProvidersVariables
  >(GetParticipantsAndProviders, {
    variables: {
      id: modelID
    }
  });

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
    data?.modelPlan?.participantsAndProviders ||
    ({} as ParticipantsAndProvidersFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanParticipantsAndProvidersVariables>(
    UpdatePlanParticipantsAndProviders
  );

  const handleFormSubmit = (redirect?: 'next' | 'back') => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
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

  const initialValues: ParticipantsAndProvidersFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    participants: participants ?? [],
    medicareProviderType: medicareProviderType ?? '',
    statesEngagement: statesEngagement ?? '',
    participantsOther: participantsOther ?? '',
    participantsNote: participantsNote ?? '',
    participantsCurrentlyInModels: participantsCurrentlyInModels ?? null,
    participantsCurrentlyInModelsNote: participantsCurrentlyInModelsNote ?? '',
    modelApplicationLevel: modelApplicationLevel ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

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
        {h('for')} {modelName}
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
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
        {(formikProps: FormikProps<ParticipantsAndProvidersFormType>) => {
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
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="participants"
                          error={!!flatErrors.participants}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="participants-and-providers-participants"
                            id="label-participants-and-providers-participants"
                          >
                            {t('whoAreParticipants')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.participants}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="participants-and-providers-participants"
                            ariaLabel="label-participants-and-providers-participants"
                            name="participants"
                            options={mapMultiSelectOptions(
                              translateParticipantsType,
                              ParticipantsType
                            )}
                            selectedLabel={t('selectedParticipants')}
                            onChange={(value: string[] | []) => {
                              setFieldValue('participants', value);
                            }}
                            initialValues={initialValues.participants}
                          />

                          {((values?.participants || []).includes(
                            ParticipantsType.MEDICARE_PROVIDERS
                          ) ||
                            (values?.participants || []).includes(
                              ParticipantsType.STATES
                            ) ||
                            (values?.participants || []).includes(
                              ParticipantsType.OTHER
                            )) && (
                            <p className="margin-top-4 text-bold">
                              {t('participantQuestions')}
                            </p>
                          )}

                          {(values?.participants || []).includes(
                            ParticipantsType.MEDICARE_PROVIDERS
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
                                error={flatErrors.medicareProviderType}
                                id="participants-and-providers-medicare-type"
                                data-testid="participants-and-providers-medicare-type"
                                name="medicareProviderType"
                              />
                            </FieldGroup>
                          )}

                          {(values?.participants || []).includes(
                            ParticipantsType.STATES
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
                                error={flatErrors.statesEngagement}
                                id="participants-and-providers-states-engagement"
                                data-testid="participants-and-providers-states-engagement"
                                name="statesEngagement"
                              />
                            </FieldGroup>
                          )}

                          {(values?.participants || []).includes(
                            ParticipantsType.OTHER
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

                        <FieldGroup
                          scrollElement="participantsCurrentlyInModels"
                          error={!!flatErrors.participantsCurrentlyInModels}
                          className="margin-y-4 margin-bottom-8"
                        >
                          <Label htmlFor="participants-and-providers-current-participants">
                            {t('participantsCMMI')}
                          </Label>
                          <p className="text-base margin-0 line-height-body-3">
                            {t('participantsCMMIInfo')}
                          </p>
                          <FieldErrorMsg>
                            {flatErrors.participantsCurrentlyInModels}
                          </FieldErrorMsg>
                          <Fieldset>
                            <Field
                              as={Radio}
                              id="participants-and-providers-current-participants"
                              name="participantsCurrentlyInModels"
                              label={h('yes')}
                              value="TRUE"
                              checked={
                                values.participantsCurrentlyInModels === true
                              }
                              onChange={() => {
                                setFieldValue(
                                  'participantsCurrentlyInModels',
                                  true
                                );
                              }}
                            />
                            <Field
                              as={Radio}
                              id="participants-and-providers-current-participants-no"
                              name="participantsCurrentlyInModels"
                              label={h('no')}
                              value="FALSE"
                              checked={
                                values.participantsCurrentlyInModels === false
                              }
                              onChange={() => {
                                setFieldValue(
                                  'participantsCurrentlyInModels',
                                  false
                                );
                              }}
                            />
                          </Fieldset>
                          <AddNote
                            id="participants-and-providers-current-participants-note"
                            field="participantsCurrentlyInModelsNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="modelApplicationLevel"
                          error={!!flatErrors.modelApplicationLevel}
                        >
                          <Label htmlFor="participants-and-providers-application-level">
                            {t('modelLevel')}
                          </Label>
                          <p className="text-base margin-0 line-height-body-3">
                            {t('modelLevelInfo')}
                          </p>
                          <FieldErrorMsg>
                            {flatErrors.modelApplicationLevel}
                          </FieldErrorMsg>
                          <Field
                            as={TextAreaField}
                            error={flatErrors.modelApplicationLevel}
                            id="participants-and-providers-application-level"
                            name="modelApplicationLevel"
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
                          onClick={() => handleFormSubmit('back')}
                        >
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {h('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>
                  <Grid desktop={{ col: 6 }}>
                    <SummaryBox
                      heading={t('participantsDifferenceHeading')}
                      className="margin-top-6 "
                    >
                      <ul>
                        <li>
                          <Trans i18nKey="participantsAndProviders:participantsDifferenceInfo" />
                        </li>
                        <li>
                          <Trans i18nKey="participantsAndProviders:participantsDifferenceInfo2" />
                        </li>
                      </ul>
                    </SummaryBox>
                  </Grid>
                </Grid>
              </GridContainer>
              {id && (
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
            <Route
              path="/models/:modelID/task-list/participants-and-providers/participants-options"
              exact
              render={() => <ParticipantOptions />}
            />
            <Route
              path="/models/:modelID/task-list/participants-and-providers/communication"
              exact
              render={() => <Communication />}
            />
            <Route
              path="/models/:modelID/task-list/participants-and-providers/coordination"
              exact
              render={() => <Coordination />}
            />
            <Route
              path="/models/:modelID/task-list/participants-and-providers/provider-options"
              exact
              render={() => <ProviderOptions />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ParticipantsAndProviders;

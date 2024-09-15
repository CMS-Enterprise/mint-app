import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetParticipantsAndProvidersQuery,
  ParticipantsType,
  TypedUpdatePlanParticipantsAndProvidersDocument,
  useGetParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MainContent from 'components/MainContent';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import FieldGroup from 'components/FieldGroup';
import MultiSelect from 'components/MultiSelect';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import ProtectedRoute from 'components/ProtectedRoute';
import { NotFoundPartial } from 'features/NotFound';

import ProviderAndSupplierModal from './_component/ProviderAndSupplierModal';
import Communication from './Communication';
import Coordination from './Coordination';
import ParticipantOptions from './ParticipantOptions';
import ProviderOptions from './ProviderOptions';

import './index.scss';

type ParticipantsAndProvidersFormType =
  GetParticipantsAndProvidersQuery['modelPlan']['participantsAndProviders'];

export const ParticipantsAndProvidersContent = () => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    participants: participantsConfig,
    isNewTypeOfProvidersOrSuppliers: isNewTypeOfProvidersOrSuppliersConfig,
    participantsCurrentlyInModels: participantsCurrentlyInModelsConfig
  } = usePlanTranslation('participantsAndProviders');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ParticipantsAndProvidersFormType>>(null);

  const history = useHistory();

  const { data, loading, error } = useGetParticipantsAndProvidersQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    participants,
    medicareProviderType,
    isNewTypeOfProvidersOrSuppliers,
    statesEngagement,
    participantsOther,
    participantsNote,
    participantsCurrentlyInModels,
    participantsCurrentlyInModelsNote,
    modelApplicationLevel
  } = (data?.modelPlan?.participantsAndProviders ||
    {}) as ParticipantsAndProvidersFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanParticipantsAndProvidersDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: ParticipantsAndProvidersFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    participants: participants ?? [],
    medicareProviderType: medicareProviderType ?? '',
    isNewTypeOfProvidersOrSuppliers: isNewTypeOfProvidersOrSuppliers ?? null,
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
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />
      <ProviderAndSupplierModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.PARTICIPANTS_AND_PROVIDERS
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {participantsAndProvidersMiscT('heading')}
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
            `/models/${modelID}/collaboration-area/task-list/participants-and-providers/participants-options`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ParticipantsAndProvidersFormType>) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

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
                        <FieldGroup>
                          <Label
                            htmlFor="participants-and-providers-participants"
                            id="label-participants-and-providers-participants"
                          >
                            {participantsAndProvidersT('participants.label')}
                          </Label>

                          <Field
                            as={MultiSelect}
                            id="participants-and-providers-participants"
                            ariaLabel="label-participants-and-providers-participants"
                            name="participants"
                            options={composeMultiSelectOptions(
                              participantsConfig.options
                            )}
                            selectedLabel={participantsAndProvidersT(
                              'participants.multiSelectLabel'
                            )}
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
                              {participantsAndProvidersMiscT(
                                'participantQuestions'
                              )}
                            </p>
                          )}

                          {(values?.participants || []).includes(
                            ParticipantsType.MEDICARE_PROVIDERS
                          ) && (
                            <>
                              <FieldGroup>
                                <Label
                                  htmlFor="participants-and-providers-medicare-type"
                                  className="text-normal"
                                >
                                  {participantsAndProvidersT(
                                    'medicareProviderType.label'
                                  )}
                                </Label>
                                <p className="text-base margin-0 line-height-body-3">
                                  {participantsAndProvidersT(
                                    'medicareProviderType.sublabel'
                                  )}
                                </p>
                                <Button
                                  type="button"
                                  unstyled
                                  className="margin-top-2"
                                  onClick={() => setIsModalOpen(true)}
                                >
                                  {participantsAndProvidersT(
                                    'medicareProviderType.modalLink'
                                  )}
                                </Button>
                                <Field
                                  as={TextAreaField}
                                  id="participants-and-providers-medicare-type"
                                  data-testid="participants-and-providers-medicare-type"
                                  name="medicareProviderType"
                                />
                              </FieldGroup>

                              <FieldGroup>
                                <Label htmlFor="participants-and-providers-is-new-type">
                                  {participantsAndProvidersT(
                                    'isNewTypeOfProvidersOrSuppliers.label'
                                  )}
                                </Label>

                                <BooleanRadio
                                  field="isNewTypeOfProvidersOrSuppliers"
                                  id="participants-and-providers-is-new-type"
                                  value={values.isNewTypeOfProvidersOrSuppliers}
                                  setFieldValue={setFieldValue}
                                  options={
                                    isNewTypeOfProvidersOrSuppliersConfig.options
                                  }
                                />
                              </FieldGroup>
                            </>
                          )}

                          {(values?.participants || []).includes(
                            ParticipantsType.STATES
                          ) && (
                            <FieldGroup>
                              <Label
                                htmlFor="participants-and-providers-states-engagement"
                                className="text-normal"
                              >
                                {participantsAndProvidersT(
                                  'statesEngagement.label'
                                )}
                              </Label>
                              <Field
                                as={TextAreaField}
                                id="participants-and-providers-states-engagement"
                                data-testid="participants-and-providers-states-engagement"
                                name="statesEngagement"
                              />
                            </FieldGroup>
                          )}

                          {(values?.participants || []).includes(
                            ParticipantsType.OTHER
                          ) && (
                            <FieldGroup>
                              <Label
                                htmlFor="participants-and-providers-participants-other"
                                className="text-normal"
                              >
                                {participantsAndProvidersT(
                                  'participantsOther.label'
                                )}
                              </Label>
                              <Field
                                as={TextAreaField}
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

                        <FieldGroup className="margin-y-4 margin-bottom-8">
                          <Label htmlFor="participants-and-providers-current-participants">
                            {participantsAndProvidersT(
                              'participantsCurrentlyInModels.label'
                            )}
                          </Label>

                          <p className="text-base margin-0 line-height-body-3">
                            {participantsAndProvidersT(
                              'participantsCurrentlyInModels.sublabel'
                            )}
                          </p>

                          <BooleanRadio
                            field="participantsCurrentlyInModels"
                            id="participants-and-providers-current-participants"
                            value={values.participantsCurrentlyInModels}
                            setFieldValue={setFieldValue}
                            options={
                              participantsCurrentlyInModelsConfig.options
                            }
                          />

                          <AddNote
                            id="participants-and-providers-current-participants-note"
                            field="participantsCurrentlyInModelsNote"
                          />
                        </FieldGroup>

                        <FieldGroup>
                          <Label htmlFor="participants-and-providers-application-level">
                            {participantsAndProvidersT(
                              'modelApplicationLevel.label'
                            )}
                          </Label>

                          <p className="text-base margin-0 line-height-body-3">
                            {participantsAndProvidersT(
                              'modelApplicationLevel.sublabel'
                            )}
                          </p>

                          <Field
                            as={TextAreaField}
                            id="participants-and-providers-application-level"
                            name="modelApplicationLevel"
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
                          <Icon.ArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {miscellaneousT('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>

                  <Grid desktop={{ col: 6 }}>
                    <SummaryBox className="margin-top-6 ">
                      <SummaryBoxHeading headingLevel="h3">
                        {participantsAndProvidersMiscT(
                          'participantsDifferenceHeading'
                        )}
                      </SummaryBoxHeading>
                      <SummaryBoxContent>
                        <ul>
                          <li>
                            <Trans i18nKey="participantsAndProvidersMisc:participantsDifferenceInfo" />
                          </li>

                          <li>
                            <Trans i18nKey="participantsAndProvidersMisc:participantsDifferenceInfo2" />
                          </li>
                        </ul>
                      </SummaryBoxContent>
                    </SummaryBox>
                  </Grid>
                </Grid>
              </GridContainer>
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
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/participants-and-providers"
              exact
              render={() => <ParticipantsAndProvidersContent />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/participants-and-providers/participants-options"
              exact
              render={() => <ParticipantOptions />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/participants-and-providers/communication"
              exact
              render={() => <Communication />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/participants-and-providers/coordination"
              exact
              render={() => <Coordination />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/participants-and-providers/provider-options"
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

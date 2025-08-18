import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Fieldset, Icon, Label } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetInvolvementsQuery,
  TypedUpdatePlanGeneralCharacteristicsDocument,
  useGetInvolvementsQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';

type InvolvementsFormType =
  GetInvolvementsQuery['modelPlan']['generalCharacteristics'];

const Involvements = () => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    careCoordinationInvolved: careCoordinationInvolvedConfig,
    additionalServicesInvolved: additionalServicesInvolvedConfig,
    communityPartnersInvolved: communityPartnersInvolvedConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<InvolvementsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetInvolvementsQuery({
    variables: {
      id: modelID
    }
  });

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
    careCoordinationInvolved,
    careCoordinationInvolvedDescription,
    careCoordinationInvolvedNote,
    additionalServicesInvolved,
    additionalServicesInvolvedDescription,
    additionalServicesInvolvedNote,
    communityPartnersInvolved,
    communityPartnersInvolvedDescription,
    communityPartnersInvolvedNote
  } = (data?.modelPlan?.generalCharacteristics || {}) as InvolvementsFormType;

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanGeneralCharacteristicsDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: InvolvementsFormType = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    careCoordinationInvolved: careCoordinationInvolved ?? null,
    careCoordinationInvolvedDescription:
      careCoordinationInvolvedDescription ?? '',
    careCoordinationInvolvedNote: careCoordinationInvolvedNote ?? '',
    additionalServicesInvolved: additionalServicesInvolved ?? null,
    additionalServicesInvolvedDescription:
      additionalServicesInvolvedDescription ?? '',
    additionalServicesInvolvedNote: additionalServicesInvolvedNote ?? '',
    communityPartnersInvolved: communityPartnersInvolved ?? null,
    communityPartnersInvolvedDescription:
      communityPartnersInvolvedDescription ?? '',
    communityPartnersInvolvedNote: communityPartnersInvolvedNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
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
        onSubmit={values => {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/characteristics/targets-and-options`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InvolvementsFormType>) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="plan-characteristics-involvements-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup className="margin-y-4">
                    <Label htmlFor="plan-characteristics-care-coordination-involved">
                      {generalCharacteristicsT(
                        'careCoordinationInvolved.label'
                      )}
                    </Label>

                    <p className="text-base margin-y-1">
                      {generalCharacteristicsT(
                        'careCoordinationInvolved.sublabel'
                      )}
                    </p>

                    <BooleanRadio
                      field="careCoordinationInvolved"
                      id="plan-characteristics-care-coordination-involved"
                      value={values.careCoordinationInvolved}
                      setFieldValue={setFieldValue}
                      options={careCoordinationInvolvedConfig.options}
                      childName="careCoordinationInvolvedDescription"
                    >
                      {values.careCoordinationInvolved === true ? (
                        <div className="display-flex margin-left-4 margin-bottom-1">
                          <FieldGroup className="flex-1">
                            <Label
                              htmlFor="plan-characteristics-care-coordination-description"
                              className="margin-bottom-1 text-normal"
                            >
                              {generalCharacteristicsT(
                                'careCoordinationInvolvedDescription.label'
                              )}
                            </Label>

                            <Field
                              as={TextAreaField}
                              className="margin-top-0 height-15"
                              id="plan-characteristics-care-coordination-description"
                              name="careCoordinationInvolvedDescription"
                            />
                          </FieldGroup>
                        </div>
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-care-coordination-note"
                    field="careCoordinationInvolvedNote"
                  />

                  <FieldGroup className="margin-y-4">
                    <Label htmlFor="plan-characteristics-additional-services">
                      {generalCharacteristicsT(
                        'additionalServicesInvolved.label'
                      )}
                    </Label>

                    <BooleanRadio
                      field="additionalServicesInvolved"
                      id="plan-characteristics-additional-services"
                      value={values.additionalServicesInvolved}
                      setFieldValue={setFieldValue}
                      options={additionalServicesInvolvedConfig.options}
                      childName="additionalServicesInvolvedDescription"
                    >
                      {values.additionalServicesInvolved === true ? (
                        <div className="display-flex margin-left-4 margin-bottom-1">
                          <FieldGroup className="flex-1">
                            <Label
                              htmlFor="plan-characteristics-additional-services-description"
                              className="margin-bottom-1 text-normal"
                            >
                              {generalCharacteristicsT(
                                'additionalServicesInvolvedDescription.label'
                              )}
                            </Label>

                            <Field
                              as={TextAreaField}
                              className="margin-top-0 height-15"
                              data-testid="plan-characteristics-additional-services-description"
                              id="plan-characteristics-additional-services-description"
                              name="additionalServicesInvolvedDescription"
                            />
                          </FieldGroup>
                        </div>
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-additional-services-note"
                    field="additionalServicesInvolvedNote"
                  />

                  <FieldGroup className="margin-y-4">
                    <Label htmlFor="plan-characteristics-community-partners-involved">
                      {generalCharacteristicsT(
                        'communityPartnersInvolved.label'
                      )}
                    </Label>

                    <p className="text-base margin-y-1">
                      {generalCharacteristicsT(
                        'communityPartnersInvolved.sublabel'
                      )}
                    </p>

                    <BooleanRadio
                      field="communityPartnersInvolved"
                      id="plan-characteristics-community-partners-involved"
                      value={values.communityPartnersInvolved}
                      setFieldValue={setFieldValue}
                      options={communityPartnersInvolvedConfig.options}
                      childName="communityPartnersInvolvedDescription"
                    >
                      {values.communityPartnersInvolved === true ? (
                        <div className="display-flex margin-left-4 margin-bottom-1">
                          <FieldGroup className="flex-1">
                            <Label
                              htmlFor="plan-characteristics-community-partners-description"
                              className="margin-bottom-1 text-normal"
                            >
                              {generalCharacteristicsT(
                                'communityPartnersInvolvedDescription.label'
                              )}
                            </Label>

                            <Field
                              as={TextAreaField}
                              className="margin-top-0 height-15"
                              id="plan-characteristics-community-partners-description"
                              name="communityPartnersInvolvedDescription"
                            />
                          </FieldGroup>
                        </div>
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-community-partners-note"
                    field="communityPartnersInvolvedNote"
                  />

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/characteristics/key-characteristics`
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
                      history.push(
                        `/models/${modelID}/collaboration-area/task-list`
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
              </Form>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={3} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Involvements;

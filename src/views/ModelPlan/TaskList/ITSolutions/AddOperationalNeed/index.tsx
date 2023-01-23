import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Fieldset,
  Grid,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import { GetOperationalNeeds_modelPlan_operationalNeeds as CustomOperationalNeedsType } from 'queries/ITSolutions/types/GetOperationalNeeds';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import OperationalSolutionsSidebar from '../_components/OperationalSolutionSidebar';

const AddOperationalNeed = () => {
  const { modelID } = useParams<{ modelID: string }>();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const formikRef = useRef<FormikProps<CustomOperationalNeedsType>>(null);

  const { modelName } = useContext(ModelInfoContext);

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);
  const { showMessageOnNextPage } = useMessage();

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    { text: t('addOpertationalNeed') }
  ];

  const initialValues: CustomOperationalNeedsType = {
    nameOther: ''
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {mutationError && (
        <Alert type="error" slim>
          {t('updateError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('addOpertationalNeed')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4 margin-bottom-6">
            {t('addOpertationalNeedInfo')}
          </p>

          <Grid tablet={{ col: 8 }}>
            <Alert slim type="info">
              {t('noDuplicates')}
            </Alert>

            <Formik
              initialValues={initialValues}
              onSubmit={values => {
                handleFormSubmit(values);
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {(formikProps: FormikProps<CustomOperationalNeedsType>) => {
                const { errors, handleSubmit, values } = formikProps;

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
                      className="margin-top-3"
                      data-testid="it-solutions-add-solution"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={loading}>
                        <FieldGroup
                          scrollElement="nameOther"
                          error={!!flatErrors.nameOther}
                          className="margin-top-3"
                        >
                          <Label htmlFor="it-solution-custom-name-other">
                            {t('solutionName')}
                            <RequiredAsterisk />
                          </Label>

                          <FieldErrorMsg>{flatErrors.nameOther}</FieldErrorMsg>

                          <Field
                            as={TextInput}
                            error={!!flatErrors.nameOther}
                            id="it-solution-custom-name-other"
                            data-testid="it-solution-custom-name-other"
                            maxLength={50}
                            name="nameOther"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="pocName"
                          error={!!flatErrors.pocName}
                          className="margin-top-3"
                        >
                          <Label htmlFor="it-solution-custom-poc-name">
                            {t('solutionPOC')}
                          </Label>

                          <p className="margin-bottom-1">
                            {t('solutionPOCInfo')}
                          </p>

                          <FieldErrorMsg>{flatErrors.pocName}</FieldErrorMsg>

                          <Field
                            as={TextInput}
                            error={!!flatErrors.pocName}
                            id="it-solution-custom-poc-name"
                            data-testid="it-solution-custom-poc-name"
                            maxLength={50}
                            name="pocName"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="pocEmail"
                          error={!!flatErrors.pocEmail}
                          className="margin-top-3"
                        >
                          <Label
                            htmlFor="it-solution-custom-poc-email"
                            className="text-normal"
                          >
                            {t('solutionEmailInfo')}
                          </Label>

                          <FieldErrorMsg>{flatErrors.pocEmail}</FieldErrorMsg>

                          <Field
                            as={TextInput}
                            error={!!flatErrors.pocEmail}
                            id="it-solution-custom-poc-email"
                            data-testid="it-solution-custom-poc-email"
                            maxLength={50}
                            name="pocEmail"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="submit"
                            className="margin-bottom-1"
                            id="submit-custom-solution"
                            disabled={!values.nameOther}
                          >
                            {operationalSolutionID
                              ? t('updateSolutionDetails')
                              : t('addSolutionDetails')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled display-flex flex-align-center"
                          onClick={() => {
                            history.goBack();
                          }}
                        >
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {operationalSolutionID
                            ? t('dontUpdateSolution')
                            : t('dontAddSolution')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <OperationalSolutionsSidebar modelID={modelID} />
        </Grid>
      </Grid>
    </>
  );
};

export default AddOperationalNeed;

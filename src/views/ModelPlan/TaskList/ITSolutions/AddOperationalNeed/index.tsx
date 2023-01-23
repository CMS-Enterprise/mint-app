import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
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
// import useMessage from 'hooks/useMessage';
import { GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsType } from 'queries/ITSolutions/types/GetOperationalNeeds';
import { UpdateCustomOperationalNeedVariables } from 'queries/ITSolutions/types/UpdateCustomOperationalNeed';
import UpdateCustomOperationalNeed from 'queries/ITSolutions/UpdateCustomOperationalNeed';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import OperationalSolutionsSidebar from '../_components/OperationalSolutionSidebar';

type CustomOperationalNeedFormType = Omit<
  GetOperationalNeedsType,
  | '__typename'
  | 'id'
  | 'modelPlanID'
  | 'name'
  | 'key'
  | 'needed'
  | 'modifiedDts'
  | 'solutions'
>;

const AddOperationalNeed = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const formikRef = useRef<FormikProps<CustomOperationalNeedFormType>>(null);

  const { modelName } = useContext(ModelInfoContext);

  // const { showMessageOnNextPage } = useMessage();

  const initialValues: CustomOperationalNeedFormType = {
    nameOther: ''
  };

  const [
    addCustomOperationalNeed
  ] = useMutation<UpdateCustomOperationalNeedVariables>(
    UpdateCustomOperationalNeed
  );

  const handleFormSubmit = async (
    formikValues: CustomOperationalNeedFormType
  ) => {
    const { nameOther } = formikValues;

    await addCustomOperationalNeed({
      variables: {
        modelPlanID: modelID,
        customNeedType: nameOther,
        needed: true
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelID}/task-list/it-solutions`);
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    { text: t('addOpertationalNeed') }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

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
              onSubmit={handleFormSubmit}
              enableReinitialize
              innerRef={formikRef}
            >
              {(formikProps: FormikProps<CustomOperationalNeedFormType>) => {
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
                      data-testid="it-solutions-add-custom-operational-need"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset>
                        <FieldGroup
                          scrollElement="nameOther"
                          error={!!flatErrors.nameOther}
                          className="margin-top-3"
                        >
                          <Label htmlFor="it-solution-custom-name-other">
                            {t('customOperationalNeedName')}
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

                        <div className="margin-top-6 margin-bottom-3">
                          {/* Saves, does not add solution, and returns to tracker */}
                          <Button
                            type="button"
                            id=""
                            disabled={!values.nameOther}
                            outline
                          >
                            {t('saveWithoutAdding')}
                          </Button>
                          {/* Saves and continues to add solution */}
                          <Button
                            type="submit"
                            id="submit-custom-solution"
                            disabled={!values.nameOther}
                          >
                            {t('continue')}
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
                          {t('dontAddandReturnToTracker')}
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

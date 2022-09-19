import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
// import FieldErrorMsg from 'components/shared/FieldErrorMsg';
// import FieldGroup from 'components/shared/FieldGroup';
import CreateCRTDL from 'queries/CRTDL/CreateCRTDL';
import GetCRTDL from 'queries/CRTDL/GetCRTDL';
import {
  CreateCRTDL as CreateCRTDLType,
  CreateCRTDL_createPlanCrTdl as CreateCRTDLFormType,
  CreateCRTDLVariables
} from 'queries/CRTDL/types/CreateCRTDL';
import {
  GetCRTDL_crTdl as CRTDLType,
  GetCRTDLVariables
} from 'queries/CRTDL/types/GetCRTDL';
import {
  UpdateCRTDL as UpdateCRTDLType,
  UpdateCRTDLVariables
} from 'queries/CRTDL/types/UpdateCRTDL';
import UpdateCRTDL from 'queries/CRTDL/UpdateCRTDL';
import flattenErrors from 'utils/flattenErrors';
import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

const initialFormValues: CreateCRTDLFormType = {
  __typename: 'PlanCrTdl',
  modelPlanID: '',
  title: '',
  idNumber: '',
  dateInitiated: '',
  note: null
};

const AddCRTDL = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { crtdlID } = useParams<{ crtdlID: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('crtdl');
  const formikRef = useRef<FormikProps<CreateCRTDLFormType>>(null);

  const history = useHistory();

  const { data } = useQuery<CRTDLType, GetCRTDLVariables>(GetCRTDL, {
    variables: {
      id: crtdlID
    },
    skip: !crtdlID
  });

  const crtdl = data || initialFormValues;
  console.log(crtdl);

  const [create] = useMutation<CreateCRTDLType, CreateCRTDLVariables>(
    CreateCRTDL
  );

  const [update] = useMutation<UpdateCRTDLType, UpdateCRTDLVariables>(
    UpdateCRTDL
  );

  const handleUpdateDraftModelPlan = (formikValues: CreateCRTDLFormType) => {
    const { idNumber, dateInitiated, title, note } = formikValues;

    if (crtdlID) {
      update({
        variables: {
          id: crtdlID,
          changes: {
            idNumber,
            dateInitiated,
            title,
            note
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/new-plan/${modelID}/collaborators`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    } else {
      create({
        variables: {
          input: {
            modelPlanID: modelID,
            idNumber,
            dateInitiated,
            title,
            note
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/new-plan/${modelID}/collaborators`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  };

  return (
    <MainContent>
      <div className="grid-container">
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {t('heading')}
          </PageHeading>
          <div className="margin-bottom-6 line-height-body-6">
            {!crtdlID ? t('createDescription') : t('updateDescription')}
          </div>

          <Formik
            initialValues={initialFormValues}
            enableReinitialize
            onSubmit={handleUpdateDraftModelPlan}
            validationSchema={CollaboratorsValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<CreateCRTDLFormType>) => {
              const {
                errors,
                // values,
                setErrors,
                // setFieldValue,
                handleSubmit
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
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="margin-y-4 display-block">
                      <Button
                        type="submit"
                        // disabled={!values.fullName || !values.teamRole}
                        onClick={() => setErrors({})}
                      >
                        {!crtdlID ? t('addCRTDL') : t('updateCRTDL')}
                      </Button>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>
          <UswdsReactLink to={`/models/${modelID}/cr-and-tdl`}>
            <span>&larr; </span>{' '}
            {!crtdlID ? t('addRedirect') : t('updateRedirect')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default AddCRTDL;

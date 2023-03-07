import React, { useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Button,
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
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import { GetOperationalSolutionSubtasks_operationalSolution_operationalSolutionSubtasks as SubtasksType } from 'queries/ITSolutions/types/GetOperationalSolutionSubtasks';
import { OperationalSolutionSubtaskStatus } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

const Subtasks = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  // const history = useHistory();

  const { t } = useTranslation('subtasks');
  const { t: h } = useTranslation('draftModelPlan');

  // const { showMessageOnNextPage, message } = useMessage();

  const { modelName } = useContext(ModelInfoContext);

  const { data, error } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
    variables: {
      id: operationalSolutionID
    }
  });

  const solution = useMemo(() => {
    return (
      data?.operationalSolution ||
      ({} as GetOperationalSolutionOperationalSolutionType)
    );
  }, [data?.operationalSolution]);

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
    },
    { text: t('addSubtask') }
  ];

  const formikRef = useRef<FormikProps<SubtasksType>>(null);
  const initialValues: SubtasksType = {
    __typename: 'OperationalSolutionSubtask',
    id: '',
    solutionID: operationalSolutionID,
    name: '',
    status: OperationalSolutionSubtaskStatus.TODO
  };

  if (error || !solution) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('addSubtask')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('addSubtaskInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
              solution={solution}
              renderSolutionCardLinks={false}
            />

            <Formik
              initialValues={initialValues}
              onSubmit={values => {
                // handleFormSubmit(values);
                console.log(values);
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {(formikProps: FormikProps<SubtasksType>) => {
                const { errors, setErrors, handleSubmit, values } = formikProps;

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
                      className="margin-top-6"
                      data-testid="it-tools-page-seven-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="name"
                        error={!!flatErrors.name}
                        className="margin-top-4"
                      >
                        <Label htmlFor="subtask-name">
                          {t('modelName')}
                          <RequiredAsterisk />
                        </Label>
                        <FieldErrorMsg>{flatErrors.name}</FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors.name}
                          id="subtask-name"
                          maxLength={50}
                          name="name"
                        />
                      </FieldGroup>
                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="button"
                          className="usa-button usa-button--outline margin-bottom-1"
                          onClick={() => {
                            // handleFormSubmit(values, 'back');
                            console.log(values);
                          }}
                        >
                          {h('back')}
                        </Button>

                        <Button
                          type="submit"
                          id="submit-solutions"
                          onClick={() => setErrors({})}
                        >
                          {t('saveSolutions')}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled display-flex flex-align-center margin-bottom-6"
                        onClick={() => {}}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <ITSolutionsSidebar
            modelID={modelID}
            renderTextFor="need"
            helpfulLinks={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Subtasks;

import React, { useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Fieldset,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import Breadcrumbs from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
// import useMessage from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import flattenErrors from 'utils/flattenErrors';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';
import Solution from '../SolutionImplementation/_components/Solution';

const Subtasks = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  // const history = useHistory();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  // const { showMessageOnNextPage, message } = useMessage();
  const formikRef = useRef<FormikProps<GetOperationalNeedOperationalNeedType>>(
    null
  );

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
    { text: t('subtasks.addSubtask') }
  ];

  if (error || !solution) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('subtasks.addSubtask')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('subtasks.addSubtaskInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeedID={operationalNeedID}
              modelID={modelID}
              solution={solution}
              renderSolutionCardLinks={false}
            />

            <Formik
              initialValues={formikNeed}
              onSubmit={values => {
                handleFormSubmit(values);
              }}
              enableReinitialize
              innerRef={formikRef}
            >
              {(
                formikProps: FormikProps<GetOperationalNeedOperationalNeedType>
              ) => {
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
                      <Fieldset disabled={loading}>
                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="button"
                            className="usa-button usa-button--outline margin-bottom-1"
                            onClick={() => {
                              handleFormSubmit(values, 'back');
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
                          onClick={() => handleCancelClick(values)}
                        >
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {renderCancelCopy()}
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

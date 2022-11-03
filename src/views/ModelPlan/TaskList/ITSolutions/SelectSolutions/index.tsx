import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  CardGroup,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import CheckboxCard from '../_components/CheckboxCard';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

const SelectSolutions = () => {
  const { modelID } = useParams<{
    modelID: string;
    // operationalNeedID: string;
  }>();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const formikRef = useRef<FormikProps<any>>(null);

  const { modelName } = useContext(ModelInfoContext);

  const operationalNeed = {
    id: '7395dd13-ceda-409c-a2e9-36b065b874de',
    modelPlanID: '727ab46c-8a5e-4896-bb66-7ed63c212b39',
    name: 'Manage Part C/D enrollment',
    section: 'GENERAL_CHARACTERISTICS',
    key: 'MANAGE_CD',
    nameOther: null,
    needed: true,
    solutions: {
      solutions: [
        {
          id: 3,
          key: 'FFS_COMPETENCY_CENTER',
          name: 'FFS Competency Center',
          description:
            'Short summary. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore aliqa...',
          needed: false
        },
        {
          id: 2,
          key: 'SHARED_SYSTEMS',
          name: 'Shared Systems',
          description:
            'Short summary. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore aliqa...',
          needed: true
        }
      ],
      possibleSolutions: [
        {
          id: 1,
          name: 'Medicare Advantage Prescription Drug System (MARx)',
          key: 'MARX'
        }
      ]
    }
  };

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={UswdsReactLink} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/`}
          >
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/it-solutions`}
          >
            <span>{t('breadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('selectSolution')}</Breadcrumb>
      </BreadcrumbBar>

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('selectSolution')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p>{t('selectInfo')}</p>

          <Grid tablet={{ col: 8 }}>
            <NeedQuestionAndAnswer
              operationalNeed={operationalNeed}
              modelID={modelID}
            />
          </Grid>

          <Grid row gap>
            <Grid tablet={{ col: 10 }}>
              <Formik
                initialValues={operationalNeed.solutions}
                onSubmit={values => {
                  //   console.log(values);
                  //   handleFormSubmit(values, 'next');
                }}
                enableReinitialize
                innerRef={formikRef}
              >
                {(formikProps: FormikProps<any>) => {
                  const {
                    // errors,
                    handleSubmit,
                    // setErrors,
                    values
                  } = formikProps;

                  return (
                    <Form
                      className="margin-top-6"
                      data-testid="it-tools-page-seven-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <legend className="text-bold margin-bottom-2">
                        {t('chooseSolution')}
                      </legend>

                      <CardGroup>
                        {values.solutions.map(
                          (solution: any, index: number) => (
                            <CheckboxCard
                              solution={solution}
                              index={index}
                              key={solution.id}
                            />
                          )
                        )}
                      </CardGroup>

                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-top-2"
                        onClick={() => {
                          // handleFormSubmit(values, 'back');
                        }}
                      >
                        {t('selectAnother')}
                      </Button>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="button"
                          className="margin-bottom-1"
                          onClick={() => {
                            // handleFormSubmit(values, 'back');
                          }}
                        >
                          {t('continue')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled display-flex flex-align-center"
                        // onClick={() => handleFormSubmit(values, 'task-list')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {t('dontAdd')}
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Grid>
          </Grid>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
            <AskAQuestion modelID={modelID} opNeeds />
          </div>
          <div className="margin-top-4">
            <p className="text-bold margin-bottom-0">{t('helpfulLinks')}</p>
            <Button
              type="button"
              onClick={() =>
                window.open('/help-and-knowledge/model-plan-overview', '_blank')
              }
              className="usa-button usa-button--unstyled line-height-body-5"
            >
              <p>{t('availableSolutions')}</p>
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default SelectSolutions;

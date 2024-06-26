import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Card,
  CardGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetHomepageSettingsQuery,
  useGetHomepageSettingsQuery,
  ViewCustomizationType
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { getKeys } from 'types/translation';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

export type HomepageSettingsLocationType = {
  homepageSettings: HomepageSettingsFormType;
};

export type HomepageLocationStateType = {
  homepageSettings: HomepageSettingsLocationType['homepageSettings'];
};

type HomepageSettingsFormType = {
  viewCustomization: GetHomepageSettingsQuery['userViewCustomization']['viewCustomization'];
};

const HomePageSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const history = useHistory();

  const { state } = useLocation<HomepageLocationStateType>();

  const formikRef = useRef<FormikProps<HomepageSettingsFormType>>(null);

  const { data, loading, error } = useGetHomepageSettingsQuery();

  const possibleOperationalSolutions =
    data?.userViewCustomization.possibleOperationalSolutions || [];

  // Sends formik values to next page through router state, no mutation needed
  const handleSettingsSubmit = () => {
    history.push({
      pathname: '/homepage-settings/order',
      state: {
        homepageSettings: formikRef.current?.values
      }
    });
  };

  // Get the settings options from the translation file
  const settingOptions: Record<
    ViewCustomizationType,
    Record<string, string>
  > = homepageSettingsT('settings', {
    returnObjects: true
  });

  const initialValues: HomepageSettingsFormType = {
    viewCustomization:
      state?.homepageSettings?.viewCustomization ||
      data?.userViewCustomization.viewCustomization ||
      []
  };

  if ((!loading && error) || (!loading && !data?.userViewCustomization)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{miscellaneousT('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{homepageSettingsT('heading')}</Breadcrumb>
          </BreadcrumbBar>

          <h1 className="margin-bottom-2">
            {homepageSettingsT('heading')}
            <span className="font-body-lg text-base text-normal margin-left-2">
              {homepageSettingsT('stepOne')}
            </span>
          </h1>

          <p className="font-body-lg margin-top-0 margin-bottom-6">
            {homepageSettingsT('description')}
          </p>

          <h3>{homepageSettingsT('selection')}</h3>

          <Formik
            initialValues={initialValues}
            onSubmit={() => {
              handleSettingsSubmit();
            }}
            enableReinitialize
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<HomepageSettingsFormType>) => {
              const { handleSubmit, setErrors, values } = formikProps;

              return (
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                  }}
                >
                  <CardGroup>
                    {getKeys(settingOptions).map(settionOption => {
                      return (
                        <Grid
                          desktop={{ col: 6 }}
                          tablet={{ col: 12 }}
                          mobile={{ col: 12 }}
                          key={settionOption}
                        >
                          <Card
                            className={classNames(
                              {
                                'settings__card-selected': values.viewCustomization.includes(
                                  settionOption
                                )
                              },
                              'settings__card'
                            )}
                          >
                            <Field
                              as={CheckboxField}
                              disabled={loading}
                              id={settionOption}
                              name="viewCustomization"
                              label={settingOptions[settionOption].heading}
                              value={settionOption}
                              checked={values.viewCustomization.includes(
                                settionOption
                              )}
                              className="text-bold"
                            />

                            <p className="padding-left-4 padding-right-2 margin-y-1 font-body-xs">
                              {settingOptions[settionOption].description}
                            </p>

                            {/* If MODELS_BY_OPERATIONAL_SOLUTION and no selected solutions render out a link to add solutions  */}
                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION &&
                              possibleOperationalSolutions.length === 0 && (
                                <UswdsReactLink
                                  to={{
                                    pathname: '/homepage-settings/solutions',
                                    state: {
                                      homepageSettings: formikRef.current
                                        ?.values as any
                                    }
                                  }}
                                  className="padding-left-4 text-bold display-flex flex-align-center"
                                >
                                  {homepageSettingsT('selectSolutions')}

                                  <Icon.ArrowForward className="margin-left-1" />
                                </UswdsReactLink>
                              )}

                            {/* If MODELS_BY_OPERATIONAL_SOLUTION selected solutions, render solution and link to update  */}
                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION &&
                              possibleOperationalSolutions.length > 0 && (
                                <div className="display-flex padding-left-4 padding-right-2">
                                  <p className="text-bold margin-0 margin-right-105">
                                    {possibleOperationalSolutions.join(', ')}
                                  </p>
                                  <span className="margin-right-105">|</span>
                                  <UswdsReactLink
                                    to={{
                                      pathname: '/homepage-settings/solutions',
                                      state: {
                                        homepageSettings: formikRef.current
                                          ?.values as any
                                      }
                                    }}
                                    className="text-bold display-flex flex-align-center settings__update"
                                  >
                                    {homepageSettingsT('updateSolutions')}

                                    <Icon.ArrowForward className="margin-left-1" />
                                  </UswdsReactLink>
                                </div>
                              )}
                          </Card>
                        </Grid>
                      );
                    })}
                  </CardGroup>

                  {values.viewCustomization.length === 0 && (
                    <Alert type="info" slim>
                      {homepageSettingsT('emptySettings')}
                    </Alert>
                  )}

                  {values.viewCustomization.length ===
                    Object.keys(ViewCustomizationType).length && (
                    <Alert type="info" slim>
                      {homepageSettingsT('allSettings')}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    onClick={() => setErrors({})}
                    className="margin-top-4"
                  >
                    {miscellaneousT('next')}
                  </Button>

                  <div
                    style={{ width: 'fit-content' }}
                    className="margin-top-4"
                  >
                    <UswdsReactLink
                      to="/"
                      className="display-flex flex-align-center"
                    >
                      <Icon.ArrowBack className="margin-right-2" />
                      {homepageSettingsT('back')}
                    </UswdsReactLink>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default HomePageSettings;

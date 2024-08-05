import React, { useEffect, useMemo, useRef } from 'react';
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
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { HomepageSettingsType } from 'i18n/en-US/home/settings';
import { getKeys } from 'types/translation';
import { helpSolutions } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import NotFound from 'views/NotFound';

import './index.scss';

export type HomepageSettingsLocationType = {
  homepageSettings: HomepageSettingsFormType;
};

export type HomepageLocationStateType = {
  homepageSettings: HomepageSettingsLocationType['homepageSettings'];
  fromHome?: string;
};

type HomepageSettingsFormType = {
  viewCustomization: GetHomepageSettingsQuery['userViewCustomization']['viewCustomization'];
};

const SettingsForm = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const flags = useFlags();

  const history = useHistory();

  const { state } = useLocation<HomepageLocationStateType>();

  const formikRef = useRef<FormikProps<HomepageSettingsFormType>>(null);

  const { data, loading, error } = useGetHomepageSettingsQuery();

  // Sorts, and replaces any underscores within solution acronyms.  Returns an array of selected solutions acronyms or names
  const selectedSolutions = useMemo(() => {
    const possibleOperationalSolutions =
      data?.userViewCustomization.possibleOperationalSolutions || [];

    return [...helpSolutions]
      .filter(solution => possibleOperationalSolutions.includes(solution.enum))
      .map(solution => solution.acronym || solution.name);
  }, [data?.userViewCustomization]);

  // Passes the current state to the previous page if navigating back
  useEffect(() => {
    // Blocks the route transition until unblock() is called
    const unblock = history.block(destination => {
      unblock();
      history.push({
        pathname: destination.pathname,
        state:
          // If the destination is the homepage settings page, pass the current state
          destination.pathname === '/homepage-settings/solutions' ||
          destination.pathname === '/homepage-settings/order'
            ? { homepageSettings: formikRef.current?.values }
            : undefined
      });
      return false;
    });

    return () => {};
  }, [history, formikRef.current?.values]);

  // Get the settings options from the translation file
  const settingOptions: HomepageSettingsType = homepageSettingsT('settings', {
    returnObjects: true
  });

  const initialValues: HomepageSettingsFormType = {
    viewCustomization:
      state?.homepageSettings?.viewCustomization ||
      data?.userViewCustomization.viewCustomization ||
      []
  };

  if ((!loading && error) || (!loading && !data?.userViewCustomization)) {
    return <NotFound />;
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
              history.push('/homepage-settings/order');
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
                      if (
                        !flags.modelsApproachingClearanceEnabled &&
                        settionOption ===
                          ViewCustomizationType.MODELS_APPROACHING_CLEARANCE
                      ) {
                        return null;
                      }
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

                            <p className="padding-left-4 padding-right-2 margin-y-0 font-body-xs">
                              {settingOptions[settionOption].description}
                            </p>

                            {/* If MODELS_BY_OPERATIONAL_SOLUTION and no selected solutions render out a link to add solutions  */}
                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION &&
                              selectedSolutions.length === 0 && (
                                <UswdsReactLink
                                  to={{
                                    pathname: '/homepage-settings/solutions',
                                    state: {
                                      homepageSettings: formikRef.current
                                        ?.values as any
                                    }
                                  }}
                                  data-testid="add-solutions-settings"
                                  className="padding-left-4 text-bold display-flex flex-align-center margin-top-1"
                                >
                                  {homepageSettingsT('selectSolutions')}

                                  <Icon.ArrowForward className="margin-left-1" />
                                </UswdsReactLink>
                              )}

                            {/* If MODELS_BY_OPERATIONAL_SOLUTION selected solutions, render solution and link to update  */}
                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION &&
                              selectedSolutions.length > 0 && (
                                <div className="display-flex padding-left-4 padding-right-2 margin-top-1">
                                  <p
                                    className="text-bold margin-0 margin-right-105"
                                    data-testid="selected-solutions"
                                  >
                                    {selectedSolutions.join(', ')}
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
                    data-testid="next-settings"
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

export default SettingsForm;

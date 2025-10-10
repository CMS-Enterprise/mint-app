import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import NotFound from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  ComponentGroup,
  GetHomepageSettingsQuery,
  MtoCommonSolutionKey,
  useGetHomepageSettingsQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import { HomepageSettingsType } from 'i18n/en-US/home/settings';
import { getKeys } from 'types/translation';
import { tObject } from 'utils/translation';

import '../index.scss';

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

  const navigate = useNavigate();

  const location = useLocation();

  const formikRef = useRef<FormikProps<HomepageSettingsFormType>>(null);

  const { data, loading, error } = useGetHomepageSettingsQuery();

  // Sorts, and replaces any underscores within solution acronyms.  Returns an array of selected solutions acronyms or names
  const selectedSolutions = useMemo(() => {
    const possibleSolutions = data?.userViewCustomization.solutions || [];

    return [...helpSolutionsArray]
      .filter(solution =>
        possibleSolutions.includes(solution.key as MtoCommonSolutionKey)
      )
      .map(solution => solution.acronym || solution.name);
  }, [data?.userViewCustomization]);

  const componentGroupTrans = tObject<keyof ComponentGroup, any>(
    'homepageSettings:componentGroupAcronyms'
  );

  const selectedComponentGroups = useMemo(() => {
    return (data?.userViewCustomization.componentGroups || []).map(
      (componentGroup: ComponentGroup) =>
        componentGroupTrans[componentGroup as unknown as keyof ComponentGroup]
    );
  }, [data?.userViewCustomization, componentGroupTrans]);

  // Get the settings options from the translation file
  const settingOptions = tObject<keyof HomepageSettingsType, any>(
    'homepageSettings:settings'
  );

  const initialValues: HomepageSettingsFormType = {
    viewCustomization:
      location.state?.homepageSettings?.viewCustomization ||
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
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.HOME_SETTINGS
            ]}
          />

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
              navigate('/homepage-settings/order', {
                state: { homepageSettings: formikRef.current?.values }
              });
            }}
            enableReinitialize
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<HomepageSettingsFormType>) => {
              const { handleSubmit, setErrors, values } = formikProps;

              return (
                <MINTForm
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
                                'settings__card-selected':
                                  values.viewCustomization.includes(
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

                            {/* If MODELS_BY_SOLUTION and no selected solutions render out a link to add solutions  */}
                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_SOLUTION &&
                              selectedSolutions.length === 0 && (
                                <UswdsReactLink
                                  to="/homepage-settings/solutions"
                                  state={{
                                    homepageSettings: values
                                  }}
                                  data-testid="add-solutions-settings"
                                  className="padding-left-4 text-bold display-flex flex-align-center margin-top-1"
                                >
                                  {homepageSettingsT('selectSolutions')}

                                  <Icon.ArrowForward
                                    className="margin-left-1"
                                    aria-label="forward"
                                  />
                                </UswdsReactLink>
                              )}

                            {/* If MODELS_BY_SOLUTION selected solutions, render solution and link to update  */}
                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_SOLUTION &&
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
                                    to="/homepage-settings/solutions"
                                    state={{
                                      homepageSettings: values
                                    }}
                                    className="text-bold display-flex flex-align-center settings__update"
                                  >
                                    {homepageSettingsT('updateSolutions')}

                                    <Icon.ArrowForward
                                      className="margin-left-1"
                                      aria-label="forward"
                                    />
                                  </UswdsReactLink>
                                </div>
                              )}

                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_GROUP &&
                              selectedComponentGroups.length === 0 && (
                                <UswdsReactLink
                                  to="/homepage-settings/component-groups"
                                  state={{ homepageSettings: values }}
                                  className="text-bold display-flex flex-align-center settings__update"
                                  data-testid="add-groups-settings"
                                >
                                  {homepageSettingsT('selectGroups')}
                                </UswdsReactLink>
                              )}

                            {settionOption ===
                              ViewCustomizationType.MODELS_BY_GROUP &&
                              selectedComponentGroups.length > 0 && (
                                <div className="display-flex padding-left-4 padding-right-2 margin-top-1">
                                  <p className="text-bold margin-0 margin-right-105">
                                    {selectedComponentGroups.join(', ')}
                                  </p>

                                  <UswdsReactLink
                                    to="/homepage-settings/component-groups"
                                    state={{
                                      homepageSettings: values
                                    }}
                                    className="text-bold display-flex flex-align-center settings__update"
                                  >
                                    {homepageSettingsT('updateGroups')}

                                    <Icon.ArrowForward
                                      className="margin-left-1"
                                      aria-label="forward"
                                    />
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
                      <Icon.ArrowBack
                        className="margin-right-2"
                        aria-label="back"
                      />
                      {homepageSettingsT('back')}
                    </UswdsReactLink>
                  </div>
                </MINTForm>
              );
            }}
          </Formik>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default SettingsForm;

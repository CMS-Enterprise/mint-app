import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetHomepageSettingsQuery,
  OperationalSolutionKey,
  useGetHomepageSettingsQuery,
  useGetPossibleOperationalSolutionsQuery,
  useUpdateHomepageSettingsMutation,
  ViewCustomizationType
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import Alert from 'components/Alert';
import MultiSelect from 'components/MultiSelect';
import { treatAsOtherSolutions } from 'features/ModelPlan/TaskList/ITSolutions/_components/CheckboxCard';

import {
  HomepageLocationStateType,
  HomepageSettingsLocationType
} from './settings';

import './index.scss';

type SettingsFormType = {
  possibleOperationalSolutions: GetHomepageSettingsQuery['userViewCustomization']['possibleOperationalSolutions'];
};

const SelectSolutionSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');

  const formikRef = useRef<FormikProps<SettingsFormType>>(null);

  const history = useHistory();

  const { state } = useLocation<HomepageLocationStateType>();

  const { data, loading, error } = useGetHomepageSettingsQuery();

  const { data: solutionData, loading: solutionLoading } =
    useGetPossibleOperationalSolutionsQuery();

  // Sorts, filters, and formats the possible operational solutions for multiselect component
  const solutionOptions = useMemo(() => {
    const possibleOperationalSolutions =
      solutionData?.possibleOperationalSolutions || [];

    return [...possibleOperationalSolutions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(
        solution =>
          !treatAsOtherSolutions.includes(
            solution.key as OperationalSolutionKey
          )
      )
      .map(solution => {
        return {
          label: solution.name,
          value: solution.key
        };
      });
  }, [solutionData?.possibleOperationalSolutions]);

  // State to manage order of selected settings, defaults to the current router state
  const [selectedSettings, setSelectedSettings] = useState<
    HomepageSettingsLocationType['homepageSettings'] | undefined
  >(state?.homepageSettings);

  // Waits for data to be loaded, then sets the selected settings to the current state if no router state
  useEffect(() => {
    if (!loading && !selectedSettings) {
      setSelectedSettings(state?.homepageSettings);
    }
  }, [loading, selectedSettings, state?.homepageSettings]);

  const [mutate] = useUpdateHomepageSettingsMutation();

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  // Passes the current state to the previous page if navigating back
  useEffect(() => {
    // Blocks the route transition until unblock() is called
    const unblock = history.block(destination => {
      unblock();
      history.push({
        pathname: destination.pathname,
        state:
          // If the destination is the homepage settings page, pass the current state
          destination.pathname === '/homepage-settings'
            ? { homepageSettings: selectedSettings }
            : undefined
      });
      return false;
    });

    return () => {};
  }, [history, selectedSettings]);

  const handleFormSubmit = () => {
    mutate({
      variables: {
        changes: { ...formikRef.current?.values }
      }
    })
      .then(() => {
        // Checks if MODELS_BY_OPERATIONAL_SOLUTION is in the selected settings and adds it if not and there are operational solutions selected
        if (
          formikRef.current?.values?.possibleOperationalSolutions &&
          formikRef.current?.values?.possibleOperationalSolutions.length > 0 &&
          !selectedSettings?.viewCustomization.includes(
            ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION
          )
        ) {
          setSelectedSettings({
            viewCustomization: [
              ...(selectedSettings?.viewCustomization || []),
              ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION
            ]
          });
        }

        // Allow state to hydrate before redirecting
        setTimeout(() => {
          history.push(state?.fromHome ? '/' : '/homepage-settings');
        }, 0);
      })
      .catch(() => setMutationError(true));
  };

  const initialValues: SettingsFormType = {
    possibleOperationalSolutions:
      data?.userViewCustomization.possibleOperationalSolutions || []
  };

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.HOME_SETTINGS
            ]}
            customItem={homepageSettingsT('solutionsHeading')}
          />

          {mutationError && (
            <Alert type="error" slim>
              {homepageSettingsT('solutionError')}
            </Alert>
          )}

          <h1 className="margin-bottom-2">
            {homepageSettingsT('solutionsHeading')}
          </h1>

          <p className="font-body-lg margin-top-0 margin-bottom-4">
            {homepageSettingsT('solutionDescription')}
          </p>

          {loading || solutionLoading ? (
            <div className="margin-top-8">
              <PageLoading />
            </div>
          ) : (
            <Grid
              desktop={{ col: 6 }}
              tablet={{ col: 12 }}
              mobile={{ col: 12 }}
            >
              <Formik
                initialValues={initialValues}
                onSubmit={() => {
                  handleFormSubmit();
                }}
                enableReinitialize
                innerRef={formikRef}
              >
                {(formikProps: FormikProps<SettingsFormType>) => {
                  const { handleSubmit, setFieldValue } = formikProps;

                  return (
                    <>
                      <Form
                        data-testid="it-solutions-add-solution"
                        onSubmit={e => {
                          handleSubmit(e);
                        }}
                      >
                        <Fieldset
                          disabled={!!error || loading || solutionLoading}
                        >
                          <Label htmlFor="possible-operational-solutions">
                            {homepageSettingsT('operationalSolutions')}
                          </Label>

                          <p className="text-base margin-y-1 line-height-body-4">
                            {homepageSettingsT('startTyping')}
                          </p>

                          <Field
                            as={MultiSelect}
                            id="possible-operational-solutions"
                            ariaLabel={homepageSettingsT(
                              'operationalSolutions'
                            )}
                            name="possibleOperationalSolutions"
                            options={solutionOptions}
                            selectedLabel={homepageSettingsT(
                              'multiselectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue(
                                'possibleOperationalSolutions',
                                value
                              );
                            }}
                            initialValues={
                              initialValues.possibleOperationalSolutions
                            }
                          />

                          <div className="margin-y-4">
                            <Button
                              type="submit"
                              data-testid="save-solution-settings"
                            >
                              {homepageSettingsT('save')}
                            </Button>
                          </div>
                        </Fieldset>
                      </Form>
                    </>
                  );
                }}
              </Formik>
            </Grid>
          )}

          <div style={{ width: 'fit-content' }}>
            <UswdsReactLink
              to={state?.fromHome ? '/' : '/homepage-settings'}
              className="display-flex flex-align-center"
            >
              <Icon.ArrowBack className="margin-right-2" />
              {homepageSettingsT('dontSelect')}
            </UswdsReactLink>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default SelectSolutionSettings;

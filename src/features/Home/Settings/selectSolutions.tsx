import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
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
  useGetGlobalMtoCommonSolutionsQuery,
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  ViewCustomizationType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import MultiSelect from 'components/MultiSelect';
import PageLoading from 'components/PageLoading';

import {
  HomepageLocationStateType,
  HomepageSettingsLocationType
} from './settings';

import './index.scss';

type SettingsFormType = {
  solutions: GetHomepageSettingsQuery['userViewCustomization']['solutions'];
};

const SelectSolutionSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');

  const formikRef = useRef<FormikProps<SettingsFormType>>(null);

  const navigate = useNavigate();

  const { state } = useLocation<HomepageLocationStateType>();

  const { data, loading, error } = useGetHomepageSettingsQuery();

  const { data: solutionData, loading: solutionLoading } =
    useGetGlobalMtoCommonSolutionsQuery();

  // Sorts, filters, and formats the possible operational solutions for multiselect component
  const solutionOptions = useMemo(() => {
    const solutions = solutionData?.mtoCommonSolutions || [];

    return [...solutions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(solution => {
        return {
          label: solution.name,
          value: solution.key
        };
      });
  }, [solutionData?.mtoCommonSolutions]);

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
  const shouldBlock = (tx: any) => {
    // If the destination is the homepage settings page, pass the current state
    if (tx.location.pathname === '/homepage-settings') {
      navigate(tx.location.pathname, {
        state: { homepageSettings: selectedSettings }
      });
    } else {
      navigate(tx.location.pathname);
    }
    return false; // Don't block, just intercept and modify the navigation
  };

  useBlocker(shouldBlock);

  const handleFormSubmit = () => {
    mutate({
      variables: {
        changes: { ...formikRef.current?.values }
      }
    })
      .then(() => {
        // Checks if MODELS_BY_SOLUTION is in the selected settings and adds it if not and there are operational solutions selected
        if (
          formikRef.current?.values?.solutions &&
          formikRef.current?.values?.solutions.length > 0 &&
          !selectedSettings?.viewCustomization.includes(
            ViewCustomizationType.MODELS_BY_SOLUTION
          )
        ) {
          setSelectedSettings({
            viewCustomization: [
              ...(selectedSettings?.viewCustomization || []),
              ViewCustomizationType.MODELS_BY_SOLUTION
            ]
          });
        }

        // Allow state to hydrate before redirecting
        setTimeout(() => {
          navigate(state?.fromHome ? '/' : '/homepage-settings');
        }, 100);
      })
      .catch(() => setMutationError(true));
  };

  const initialValues: SettingsFormType = {
    solutions: data?.userViewCustomization.solutions || []
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
                            name="solutions"
                            options={solutionOptions}
                            selectedLabel={homepageSettingsT(
                              'multiselectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue('solutions', value);
                            }}
                            initialValues={initialValues.solutions}
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
              <Icon.ArrowBack className="margin-right-2" aria-label="back" />
              {homepageSettingsT('dontSelect')}
            </UswdsReactLink>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default SelectSolutionSettings;

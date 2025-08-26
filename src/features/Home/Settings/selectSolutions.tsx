import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetHomepageSettingsQuery,
  useGetGlobalMtoCommonSolutionsQuery,
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  ViewCustomizationType
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MultiSelect from 'components/MultiSelect';
import PageLoading from 'components/PageLoading';
import { useErrorMessage } from 'contexts/ErrorContext';

import { HomepageSettingsLocationType } from './settings';

import './index.scss';

type SettingsFormType = {
  solutions: GetHomepageSettingsQuery['userViewCustomization']['solutions'];
};

const SelectSolutionSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');

  const formikRef = useRef<FormikProps<SettingsFormType>>(null);

  const navigate = useNavigate();

  const { state } = useLocation();

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

  const { setErrorMeta } = useErrorMessage();

  const handleFormSubmit = () => {
    setErrorMeta({
      overrideMessage: homepageSettingsT('solutionError')
    });

    mutate({
      variables: {
        changes: { ...formikRef.current?.values }
      }
    }).then(() => {
      // Create updated settings with the new state
      let updatedSettings = selectedSettings;

      // Checks if MODELS_BY_SOLUTION is in the selected settings and adds it if not and there are operational solutions selected
      if (
        formikRef.current?.values?.solutions &&
        formikRef.current?.values?.solutions.length > 0 &&
        !selectedSettings?.viewCustomization.includes(
          ViewCustomizationType.MODELS_BY_SOLUTION
        )
      ) {
        updatedSettings = {
          viewCustomization: [
            ...(selectedSettings?.viewCustomization || []),
            ViewCustomizationType.MODELS_BY_SOLUTION
          ]
        };
        setSelectedSettings(updatedSettings);
      }

      // Navigate with the updated settings
      navigate(state?.fromHome ? '/' : '/homepage-settings/form', {
        state: {
          homepageSettings: updatedSettings
        }
      });
    });
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
                      <MINTForm
                        data-testid="it-solutions-add-solution"
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
                      </MINTForm>
                    </>
                  );
                }}
              </Formik>
            </Grid>
          )}

          <div style={{ width: 'fit-content' }}>
            <UswdsReactLink
              to={state?.fromHome ? '/' : '/homepage-settings/form'}
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

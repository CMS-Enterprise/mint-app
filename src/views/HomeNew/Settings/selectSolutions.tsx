import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
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
  useUpdateHomepageSettingsMutation
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Alert from 'components/shared/Alert';
import MultiSelect from 'components/shared/MultiSelect';
import { treatAsOtherSolutions } from 'views/ModelPlan/TaskList/ITSolutions/_components/CheckboxCard';

import { HomepageSettingsLocationType } from '.';

import './index.scss';

type SettingsFormType = {
  possibleOperationalSolutions: GetHomepageSettingsQuery['userViewCustomization']['possibleOperationalSolutions'];
};

const SelectSolutionSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const formikRef = useRef<FormikProps<SettingsFormType>>(null);

  const history = useHistory();

  const location = useLocation<{
    homepageSettings: HomepageSettingsLocationType['homepageSettings'];
  }>();

  const { data, loading, error } = useGetHomepageSettingsQuery();

  const {
    data: solutionData,
    loading: solutionLoading
  } = useGetPossibleOperationalSolutionsQuery();

  const possibleOperationalSolutions =
    solutionData?.possibleOperationalSolutions || [];

  const solutionOptions = [...possibleOperationalSolutions]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(
      solution =>
        !treatAsOtherSolutions.includes(solution.key as OperationalSolutionKey)
    )
    .map(solution => {
      return {
        label: solution.name,
        value: solution.key
      };
    });

  const [mutate] = useUpdateHomepageSettingsMutation();

  const [selectedSettings, setSelectedSettings] = useState<
    HomepageSettingsLocationType['homepageSettings'] | undefined
  >(
    location.state
      ?.homepageSettings as HomepageSettingsLocationType['homepageSettings']
  );

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !selectedSettings) {
      setSelectedSettings(location.state?.homepageSettings);
    }
  }, [loading, selectedSettings, location.state?.homepageSettings]);

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
  }, [history, location, selectedSettings]);

  const handleFormSubmit = () => {
    mutate({
      variables: {
        changes: { ...formikRef.current?.values }
      }
    })
      .then(() => {
        history.push('/homepage-settings');
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
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{miscellaneousT('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/homepage-settings">
                <span>{homepageSettingsT('heading')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>
              {homepageSettingsT('solutionsHeading')}
            </Breadcrumb>
          </BreadcrumbBar>

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

          <Grid desktop={{ col: 6 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
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
                          ariaLabel={homepageSettingsT('operationalSolutions')}
                          name="possibleOperationalSolutions"
                          options={solutionOptions}
                          selectedLabel={homepageSettingsT('multiselectLabel')}
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
                          <Button type="submit">
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

          <div style={{ width: 'fit-content' }}>
            <UswdsReactLink
              to="/homepage-settings"
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

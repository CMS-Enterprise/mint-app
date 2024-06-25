import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Card,
  CardGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
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

type HomepageSettingsFormType = {
  viewCustomization: GetHomepageSettingsQuery['userViewCustomization']['viewCustomization'];
};

const HomePageSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const formikRef = useRef<FormikProps<HomepageSettingsFormType>>(null);

  const { data, loading, error } = useGetHomepageSettingsQuery();

  console.log(data);

  const history = useHistory();
  const location = useLocation();

  const settingOptions: Record<
    ViewCustomizationType,
    Record<string, string>
  > = homepageSettingsT('settings', {
    returnObjects: true
  });

  const initialValues: HomepageSettingsFormType = {
    viewCustomization: data?.userViewCustomization.viewCustomization || []
  };

  if ((!loading && error) || (!loading && !data?.userViewCustomization)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="new-plan">
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
              // handleFormSubmit('next');
            }}
            enableReinitialize
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<HomepageSettingsFormType>) => {
              const {
                errors,
                handleSubmit,
                setFieldValue,
                setErrors,
                values
              } = formikProps;

              return (
                <CardGroup>
                  {getKeys(settingOptions).map(settionOption => {
                    return (
                      <Grid
                        desktop={{ col: 6 }}
                        tablet={{ col: 12 }}
                        mobile={{ col: 12 }}
                      >
                        <Card className="settings__card" key={settionOption}>
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

                          {settionOption ===
                            'MODELS_BY_OPERATIONAL_SOLUTION' && (
                            <UswdsReactLink
                              to="/"
                              className="padding-left-4 text-bold display-flex flex-align-center"
                            >
                              {homepageSettingsT('selectSolutions')}

                              <Icon.ArrowForward className="margin-left-1" />
                            </UswdsReactLink>
                          )}
                        </Card>
                      </Grid>
                    );
                  })}
                </CardGroup>
              );
            }}
          </Formik>

          <Alert type="info" slim>
            {homepageSettingsT('emptySettings')}
          </Alert>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default HomePageSettings;

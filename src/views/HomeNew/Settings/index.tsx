import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Checkbox,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import { Field } from 'formik';
import { ViewCustomizationType } from 'gql/gen/graphql';

import MainContent from 'components/MainContent';
import { getKeys } from 'types/translation';

const HomePageSettings = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const loading = false;

  const history = useHistory();
  const location = useLocation();

  const settingOptions: Record<
    ViewCustomizationType,
    Record<string, string>
  > = homepageSettingsT('settings', {
    returnObjects: true
  });

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

          <h1>
            {homepageSettingsT('heading')}
            <span className="font-body-lg text-base text-normal margin-left-2">
              {homepageSettingsT('stepOne')}
            </span>
          </h1>

          <p className="font-body-lg margin-top-0 margin-bottom-6">
            {homepageSettingsT('description')}
          </p>

          <h3>{homepageSettingsT('selection')}</h3>

          <Grid desktop={{ col: 6 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
            {getKeys(settingOptions).map(key => {
              return (
                <Field
                  as={Checkbox}
                  disabled={loading}
                  id={key}
                  name={key}
                  label={settingOptions[key].heading}
                  value
                  checked
                  className="margin-y-0"
                />
              );
            })}
          </Grid>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default HomePageSettings;

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
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
import {
  HomepageSettingsReducerType,
  setHomepageSettings
} from 'reducers/homepageSettingsReducer';
import { getKeys } from 'types/translation';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

type HomepageSettingsFormType = {
  viewCustomization: GetHomepageSettingsQuery['userViewCustomization']['viewCustomization'];
};

const SettingsOrder = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const location = useLocation();
  const history = useHistory();
  console.log(location);

  const formikRef = useRef<FormikProps<HomepageSettingsFormType>>(null);

  const { data, loading, error } = useGetHomepageSettingsQuery();

  useEffect(() => {
    // Blocks the route transition until unblock() is called
    const unblock = history.block(destination => {
      unblock();
      history.push({
        pathname: destination.pathname,
        state: location.state
      });
      return false;
    });

    return () => {};
  }, [history, location]);

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

          <div>
            <UswdsReactLink
              to="/homepage-settings"
              className="display-flex flex-align-center"
            >
              <Icon.ArrowBack className="margin-right-2" />
              {homepageSettingsT('back')}
            </UswdsReactLink>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default SettingsOrder;

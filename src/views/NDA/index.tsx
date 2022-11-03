import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  Checkbox,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import UpdateNDA from 'queries/NDA/UpdateNDA';
import { setUser } from 'reducers/authReducer';
import { formatDate } from 'utils/date';

type NDAType = {
  agreed: boolean;
};

interface LocationProps {
  nextState: string;
}

const NDA = () => {
  const { t } = useTranslation('nda');
  const dispatch = useDispatch();
  const history = useHistory();
  const { state: locationState } = useLocation<LocationProps>();
  const [originalRoute, setOriginalRoute] = useState<string>('');
  const { acceptedNDA, ...user } = useSelector(
    (state: RootStateOrAny) => state.auth
  );

  const [signNDA] = useMutation(UpdateNDA);

  useEffect(() => {
    if (locationState?.nextState) setOriginalRoute(locationState?.nextState);
  }, [locationState?.nextState]);

  const handleFormSubmit = (formikValues: NDAType) => {
    signNDA()
      .then(response => {
        dispatch(setUser({ ...user, acceptedNDA: response?.data?.agreeToNDA }));
        history.push(originalRoute || '/');
      })
      .catch(err => {
        // TODO: No roles assigned error?
      });
  };

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 9 }}>
          <h1>{t('header')}</h1>
          <p className="line-height-body-6">{t('body')}</p>

          {acceptedNDA?.agreed && acceptedNDA?.agreedDts ? (
            <div data-testid="accepted-nda">
              <Alert type="success" slim className="margin-y-3" id="nda-alert">
                {t('accepted')}
                {formatDate(acceptedNDA?.agreedDts, 'MM/d/yyyy')}
              </Alert>
              <UswdsReactLink
                to="/"
                variant="unstyled"
                className="usa-button margin-top-1"
                data-testid="nda-continue"
              >
                {t('continue')}
              </UswdsReactLink>
            </div>
          ) : (
            <Formik
              initialValues={{ agreed: false }}
              onSubmit={values => {
                handleFormSubmit(values);
              }}
              enableReinitialize
            >
              {(formikProps: FormikProps<NDAType>) => {
                const { values, handleSubmit } = formikProps;

                return (
                  <Form
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Field
                      as={Checkbox}
                      id="nda-check"
                      name="agreed"
                      className="margin-bottom-4"
                      label={t('label')}
                    />

                    <Button
                      type="submit"
                      id="nda-submit"
                      disabled={!values.agreed}
                    >
                      {t('submit')}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NDA;

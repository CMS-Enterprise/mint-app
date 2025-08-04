import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Grid, GridContainer } from '@trussworks/react-uswds';
import { Field, Formik, FormikProps } from 'formik';
import { useUpdateNdaMutation } from 'gql/generated/graphql';
import { setUser } from 'stores/reducers/authReducer';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import { formatDateLocal } from 'utils/date';

type NDAType = {
  agreed: boolean;
};

const NDA = () => {
  const { t } = useTranslation('nda');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [originalRoute, setOriginalRoute] = useState<string>('');

  const { acceptedNDA, ...user } = useSelector((state: any) => state.auth);

  const [signNDA] = useUpdateNdaMutation();

  useEffect(() => {
    if (locationState?.nextState) setOriginalRoute(locationState?.nextState);
  }, [locationState?.nextState]);

  const handleFormSubmit = (formikValues: NDAType) => {
    signNDA()
      .then(response => {
        dispatch(setUser({ ...user, acceptedNDA: response?.data?.agreeToNDA }));
        navigate(originalRoute || '/');
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
          <span className="text-bold">{t('caveat')}</span>{' '}
          <span className="line-height-body-6">{t('body')}</span>
          {acceptedNDA?.agreed && acceptedNDA?.agreedDts ? (
            <div data-testid="accepted-nda">
              <Alert
                type="success"
                slim
                className="margin-y-3"
                id="nda-alert"
                isClosable={false}
              >
                {t('accepted')}
                {formatDateLocal(acceptedNDA?.agreedDts, 'MM/dd/yyyy')}
              </Alert>
              <UswdsReactLink
                to={originalRoute || '/'}
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
                  <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
                  </form>
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

export const Landing = () => {
  const { t } = useTranslation('landing');

  return (
    <GridContainer>
      <Grid>{t('heading')}</Grid>
    </GridContainer>
  );
};

export default Landing;

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  Table
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import { ArticleCategories } from '..';

export const CreatingMTOMatrix = () => {
  const { t } = useTranslation('creatingMtoMatrix');

  const rowTwo = tArray<string>('getAccess:jobcodes.table.rowTwo.roles');

  const rowThree = tArray<string>('getAccess:jobcodes.table.rowThree.roles');

  return (
    <MainContent>
      <GridContainer>
        <Grid tablet={{ col: 12 }}>
          <HelpBreadcrumb text={t('breadcrumb')} home />
          <div className="usa-in-page-nav-container">
            <main>
              <PageHeading className="margin-bottom-2 margin-top-4">
                {t('title')}
              </PageHeading>

              <HelpCategoryTag type={ArticleCategories.IT_IMPLEMENTATION} />

              <p className="mint-body-large margin-top-1 margin-bottom-4">
                {t('description')}
              </p>

              <h2 className="margin-top-4 margin-bottom-1">{t('whatIsMTO')}</h2>

              <p className="mint-body-medium margin-bottom-3 margin-top-1">
                {t('whatIsMTODescription')}
              </p>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('whyCreateMTO')}
              </h3>

              <p className="mint-body-medium margin-bottom-5 margin-top-1">
                {t('whyCreateMTODescription')}
              </p>
            </main>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CreatingMTOMatrix;

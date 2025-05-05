import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Card,
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

  const editAccessList = tArray<string>('creatingMtoMatrix:editAccessList');
  const readViewList = tArray<string>('creatingMtoMatrix:readViewList');
  const itLeadList = tArray<string>('creatingMtoMatrix:itLeadList');
  const modelTeamList = tArray<string>('creatingMtoMatrix:modelTeamList');

  return (
    <MainContent>
      <GridContainer>
        <Grid tablet={{ col: 12 }}>
          <HelpBreadcrumb text={t('breadcrumb')} home />
          <div className="usa-in-page-nav-container">
            <main className="mint-body-medium">
              <PageHeading className="line-height-large margin-bottom-2 margin-top-4">
                {t('title')}
              </PageHeading>

              <HelpCategoryTag type={ArticleCategories.IT_IMPLEMENTATION} />

              <p className="mint-body-large margin-top-1 margin-bottom-4">
                {t('description')}
              </p>

              <h2 className="margin-top-4 margin-bottom-1">{t('whatIsMTO')}</h2>

              <p className="margin-bottom-3 margin-top-1">
                {t('whatIsMTODescription')}
              </p>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('whyCreateMTO')}
              </h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('whyCreateMTODescription')}
              </p>

              <Grid row gap={2}>
                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('editAccess')}</h4>

                    <p className="margin-y-1">{t('editAccessDescription')}</p>

                    <ul className="margin-0">
                      {editAccessList.map(item => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>

                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('readView')}</h4>

                    <p className="margin-y-1">{t('readViewDescription')}</p>

                    <ul className="margin-0">
                      {readViewList.map(item => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>
              </Grid>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('whyCreateMTO')}
              </h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('whyCreateMTODescription')}
              </p>

              <Grid row gap={2}>
                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('itLead')}</h4>

                    <p className="margin-y-1">{t('itLeadDescription')}</p>

                    <ul className="margin-0">
                      {itLeadList.map(item => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>

                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('modelTeam')}</h4>

                    <p className="margin-y-1">{t('modelTeamDescription')}</p>

                    <ul className="margin-0">
                      {modelTeamList.map(item => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>
              </Grid>
            </main>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CreatingMTOMatrix;

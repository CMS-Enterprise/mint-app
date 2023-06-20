import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  IconLaunch,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox
} from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

type GetAccessContentProps = {
  help?: boolean;
};

export const GetAccessContent = ({ help }: GetAccessContentProps) => {
  const { t } = useTranslation('getAccess');

  return (
    <>
      <SummaryBox heading={t('summaryBox.copy')} className="padding-3">
        <ul className="padding-left-3 margin-bottom-0 margin-top-2 margin-left-1">
          <li>{t('summaryBox.listItem.employees')}</li>
          <li>{t('summaryBox.listItem.contractors')}</li>
        </ul>
      </SummaryBox>

      <PageHeading className="margin-top-7 margin-bottom-1" headingLevel="h2">
        {t('steps.heading')}
      </PageHeading>

      <p className="font-body-lg margin-y-0">{t('steps.description')}</p>

      <Grid desktop={{ col: 12 }} className="margin-top-105">
        <ProcessList>
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.first.heading')}
            </ProcessListHeading>
            <p>
              {t('steps.first.description.one')}
              <Link href="eua.cms.gov">
                eua.cms.gov
                <IconLaunch className="margin-left-05 text-tbottom" />
              </Link>
              {t('steps.first.description.two')}
            </p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.second.heading')}
            </ProcessListHeading>
            <ul className="margin-top-1">
              <li>
                <Trans i18nKey="getAccess:steps:second.description.one">
                  <span className="text-bold text-italic">indexZero</span>
                  &nbsp;indexOne
                </Trans>
              </li>
              <li>
                <Trans i18nKey="getAccess:steps:second.description.two">
                  <span className="text-bold text-italic">indexZero</span>
                  &nbsp;indexOne
                </Trans>
              </li>
              <li>
                <Trans i18nKey="getAccess:steps:second.description.three">
                  <span className="text-bold text-italic">indexZero</span>
                  &nbsp;indexOne
                </Trans>
              </li>
              <li>
                <Trans i18nKey="getAccess:steps:second.description.four">
                  <span className="text-bold text-italic">indexZero</span>
                  &nbsp;indexOne
                </Trans>
              </li>
              <li>
                <Trans i18nKey="getAccess:steps:second.description.five">
                  <span className="text-bold text-italic">indexZero</span>
                  &nbsp;indexOne
                </Trans>
              </li>
              <li>
                <Trans i18nKey="getAccess:steps:second.description.six">
                  <span className="text-bold text-italic">indexZero</span>
                  &nbsp;indexOne
                </Trans>
              </li>
            </ul>
          </ProcessListItem>

          <ProcessListItem className="maxw-none padding-bottom-3">
            <ProcessListHeading type="h3">
              {t('steps.third.heading')}
            </ProcessListHeading>
            <p>{t('steps.third.description')}</p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {t('steps.fourth.heading')}
            </ProcessListHeading>
            <Trans i18nKey="getAccess:steps:fourth.description">
              <UswdsReactLink to="/">indexZero</UswdsReactLink>
              &nbsp;indexOne
            </Trans>
          </ProcessListItem>
        </ProcessList>
      </Grid>
    </>
  );
};

export const GetAccess = () => {
  const { t } = useTranslation('getAccess');

  return (
    <>
      <MainContent>
        <div className="grid-container">
          <div className="tablet:grid-col-12">
            <HelpBreadcrumb text={t('overviewHeading')} home />

            <PageHeading className="margin-bottom-2">
              {t('overviewHeading')}
            </PageHeading>

            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-5">
              {t('description')}
            </p>

            <GetAccessContent help />
          </div>
        </div>
      </MainContent>
    </>
  );
};

export default GetAccess;

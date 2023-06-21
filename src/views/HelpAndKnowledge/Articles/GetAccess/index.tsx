import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
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
import Alert from 'components/shared/Alert';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

type GetAccessContentProps = {
  help?: boolean;
};

export const GetAccessContent = ({ help }: GetAccessContentProps) => {
  const { t } = useTranslation('getAccess');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  return (
    <div className="usa-in-page-nav-container">
      {!isTablet && (
        <aside
          className="usa-in-page-nav"
          data-title-text="On this page"
          data-title-heading-level="h3"
          data-scroll-offset="0"
          data-root-margin="0px 0px 0px 0px"
          data-threshold="1"
        >
          <nav aria-label="On this page" className="usa-in-page-nav__nav">
            <h4 className="usa-in-page-nav__heading">On this page</h4>
            <ul className="usa-in-page-nav__list">
              <li className="usa-in-page-nav__item">
                <a
                  href="#how-to-get-access"
                  className="usa-in-page-nav__link usa-current"
                >
                  {t('overviewHeading')}
                </a>
              </li>
              <li className="usa-in-page-nav__item">
                <a
                  href="#should-i-request-access"
                  className="usa-in-page-nav__link"
                >
                  {t('summaryBox.copy')}
                </a>
              </li>
              <li className="usa-in-page-nav__item usa-in-page-nav__item--sub-item">
                <a
                  href="#nullam-sit-amet-enim"
                  className="usa-in-page-nav__link"
                >
                  Nullam sit amet enim
                </a>
              </li>
              <li className="usa-in-page-nav__item usa-in-page-nav__item--sub-item">
                <a
                  href="#vivamus-pharetra-posuere-sapien"
                  className="usa-in-page-nav__link"
                >
                  Vivamus pharetra posuere sapien
                </a>
              </li>
              <li className="usa-in-page-nav__item usa-in-page-nav__item--sub-item">
                <a
                  href="#suspendisse-id-velit"
                  className="usa-in-page-nav__link"
                >
                  Suspendisse id velit
                </a>
              </li>
              <li className="usa-in-page-nav__item usa-in-page-nav__item--sub-item">
                <a
                  href="#orci-magna-rhoncus-neque"
                  className="usa-in-page-nav__link"
                >
                  Orci magna rhoncus neque
                </a>
              </li>
              <li className="usa-in-page-nav__item">
                <a
                  href="#aliquam-erat-volutpat-velit-vitae-ligula-volutpat"
                  className="usa-in-page-nav__link"
                >
                  Aliquam erat volutpat: velit vitae ligula volutpat
                </a>
              </li>
              <li className="usa-in-page-nav__item usa-in-page-nav__item--sub-item">
                <a href="#vitae-ligula" className="usa-in-page-nav__link">
                  Vitae ligula
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      )}
      <main>
        <PageHeading
          className="margin-bottom-2 margin-top-4 usa-anchor"
          id="how-to-get-access"
        >
          {t('overviewHeading')}
        </PageHeading>

        <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-5">
          {t('description')}
        </p>

        <SummaryBox
          heading={t('summaryBox.copy')}
          className="padding-3 usa-anchor"
          id="should-i-request-access"
        >
          <ul className="padding-left-3 margin-bottom-0 margin-top-2 margin-left-1">
            <li>{t('summaryBox.listItem.employees')}</li>

            <li>{t('summaryBox.listItem.contractors')}</li>
          </ul>
        </SummaryBox>

        <PageHeading className="margin-top-4 margin-bottom-1" headingLevel="h2">
          {t('steps.heading')}
        </PageHeading>

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
              <UswdsReactLink to="/signin">indexZero</UswdsReactLink>
              &nbsp;indexOne
            </Trans>
          </ProcessListItem>
        </ProcessList>

        <h2>{t('accessThroughIDM')}</h2>

        <Alert type="info" noIcon className="margin-bottom-2">
          {t('accessInfo1')}

          <p>
            {t('accessInfo2')}

            <Link href="eua.cms.gov">
              home.idm.cms.gov
              <IconLaunch className="margin-left-05 text-tbottom" />
            </Link>

            <Trans i18nKey="getAccess:accessInfo3">
              <span className="text-bold text-italic">indexZero</span>
              &nbsp;indexOne
            </Trans>
          </p>
        </Alert>

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
              <UswdsReactLink to="/signin">indexZero</UswdsReactLink>
              &nbsp;indexOne
            </Trans>
          </ProcessListItem>

          <ProcessListItem className="maxw-none padding-bottom-3">
            <ProcessListHeading type="h3">
              {t('steps.third.heading')}
            </ProcessListHeading>

            <p>{t('steps.third.description')}</p>
          </ProcessListItem>

          <ProcessListItem className="maxw-none padding-bottom-3">
            <ProcessListHeading type="h3">
              {t('steps.third.heading')}
            </ProcessListHeading>

            <p>{t('steps.third.description')}</p>
          </ProcessListItem>
        </ProcessList>
      </main>
    </div>
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

            <GetAccessContent help />
          </div>
        </div>
      </MainContent>
    </>
  );
};

export default GetAccess;

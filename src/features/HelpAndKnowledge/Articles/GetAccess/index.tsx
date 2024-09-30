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
import i18next from 'i18next';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useHashScroll from 'hooks/useHashScroll';
import { tArray } from 'utils/translation';

type GetAccessContentProps = {
  help?: boolean;
};

type AnchorLink = {
  anchor: string;
  text: string;
};

const anchorLinks: AnchorLink[] = [
  {
    anchor: '#which-job-code-should-i-request',
    text: i18next.t('getAccess:jobcodes.heading')
  },
  {
    anchor: '#access-through-eua',
    text: i18next.t('getAccess:stepsEUA.heading')
  },
  {
    anchor: '#access-through-idm',
    text: i18next.t('getAccess:accessThroughIDM')
  },
  {
    anchor: '#questions-or-issues',
    text: i18next.t('getAccess:questionsHeading')
  }
];

export const GetAccessContent = ({ help }: GetAccessContentProps) => {
  const { t } = useTranslation('getAccess');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const { currentHash, setCurrenHash, isScrolling } =
    useHashScroll('div.nav-anchor');

  const rowTwo = tArray<string>('getAccess:jobcodes.table.rowTwo.roles');

  const rowThree = tArray<string>('getAccess:jobcodes.table.rowThree.roles');

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
              {anchorLinks.map(anchor => (
                <li
                  className="usa-in-page-nav__item usa-in-page-nav__item--sub-item"
                  key={anchor.anchor}
                >
                  <a
                    href={anchor.anchor}
                    onClick={() => {
                      setCurrenHash(anchor.anchor);
                      isScrolling.current = true;
                    }}
                    className={classNames('usa-in-page-nav__link', {
                      'usa-current': currentHash === anchor.anchor
                    })}
                  >
                    {anchor.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      <main>
        <PageHeading className="margin-bottom-2 margin-top-4">
          {t('overviewHeading')}
        </PageHeading>

        <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-5">
          {t('description')}
        </p>

        <div className="nav-anchor" id="which-job-code-should-i-request">
          <PageHeading
            className="margin-top-4 margin-bottom-1"
            headingLevel="h2"
          >
            {t('jobcodes.heading')}
          </PageHeading>
          <p className="font-body-md line-height-sans-4">
            {t('jobcodes.description')}
          </p>

          <Table bordered={false} fullWidth fixed>
            <thead>
              <tr>
                <th scope="col" className="padding-y-1">
                  {t('jobcodes.table.rowHeader.role')}
                </th>
                <th scope="col" className="padding-y-1">
                  {t('jobcodes.table.rowHeader.jobCodeToRequest')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="padding-y-1">
                  <ul className="margin-y-0">
                    <li>{t('jobcodes.table.rowOne.role')}</li>
                  </ul>
                </th>
                <td className="text-baseline">
                  <Trans i18nKey="getAccess:jobcodes.table.rowOne.jobCodeToRequest">
                    <Link
                      aria-label="Open EUA in a new tab"
                      href="https://eua.cms.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="external"
                    >
                      indexZero
                    </Link>
                  </Trans>
                </td>
              </tr>
              <tr>
                <th scope="row" className="padding-y-1">
                  <p className="margin-y-0">
                    <Trans i18nKey="getAccess:jobcodes.table.rowTwo.paragraph">
                      <span className="text-bold text-italic">indexZero</span>
                    </Trans>
                  </p>
                  <ul className="margin-y-0">
                    {rowTwo.map(k => (
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                </th>
                <td className="text-baseline">
                  <Trans i18nKey="getAccess:jobcodes.table.rowTwo.jobCodeToRequest">
                    <Link
                      aria-label="Open EUA in a new tab"
                      href="https://eua.cms.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="external"
                    >
                      indexZero
                    </Link>
                  </Trans>
                </td>
              </tr>
              <tr>
                <th scope="row" className="padding-y-1">
                  <p className="margin-y-0">
                    <Trans i18nKey="getAccess:jobcodes.table.rowThree.paragraph">
                      <span className="text-bold text-italic">indexZero</span>
                    </Trans>
                  </p>
                  <ul className="margin-y-0">
                    {rowThree.map(k => (
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                </th>
                <td className="text-baseline">
                  <Trans i18nKey="getAccess:jobcodes.table.rowThree.jobCodeToRequest">
                    <Link
                      aria-label="Open IDM in a new tab"
                      href="https://home.idm.cms.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="external"
                    >
                      indexZero
                    </Link>
                  </Trans>
                </td>
              </tr>
              <tr>
                <th scope="row" className="padding-y-1">
                  <ul className="margin-y-0">
                    <li>{t('jobcodes.table.rowFour.role')}</li>
                  </ul>
                </th>
                <td className="text-baseline">
                  <Trans i18nKey="getAccess:jobcodes.table.rowFour.jobCodeToRequest">
                    <Link
                      aria-label="Open EUA in a new tab"
                      href="https://eua.cms.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="external"
                    >
                      indexZero
                    </Link>
                  </Trans>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="nav-anchor" id="access-through-eua">
          <PageHeading
            className="margin-top-4 margin-bottom-1"
            headingLevel="h2"
          >
            {t('stepsEUA.heading')}
          </PageHeading>

          <ProcessList>
            <ProcessListItem className="maxw-none">
              <ProcessListHeading type="h3">
                {t('stepsEUA.first.heading')}
              </ProcessListHeading>

              <p className="margin-bottom-0">
                <Trans i18nKey="getAccess:stepsEUA.first.description">
                  <Link
                    aria-label="Open EUA in a new tab"
                    href="https://eua.cms.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    indexZero
                  </Link>
                </Trans>
              </p>
            </ProcessListItem>

            <ProcessListItem className="maxw-none">
              <ProcessListHeading type="h3">
                {t('stepsEUA.second.heading')}
              </ProcessListHeading>

              <ul className="margin-top-1 padding-left-4">
                <li>
                  <Trans i18nKey="getAccess:stepsEUA.second.description.one">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsEUA.second.description.two">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsEUA.second.description.three">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsEUA.second.description.four">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsEUA.second.description.five">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsEUA.second.description.six">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
              </ul>
            </ProcessListItem>

            <ProcessListItem className="maxw-none padding-bottom-3">
              <ProcessListHeading type="h3">
                {t('stepsEUA.third.heading')}
              </ProcessListHeading>

              <p>{t('stepsEUA.third.description')}</p>
            </ProcessListItem>

            <ProcessListItem className="maxw-none">
              <ProcessListHeading type="h3">
                {t('stepsEUA.fourth.heading')}
              </ProcessListHeading>

              <Trans i18nKey="getAccess:stepsEUA.fourth.description">
                <UswdsReactLink to="/signin">indexZero</UswdsReactLink>
              </Trans>
            </ProcessListItem>
          </ProcessList>
        </div>

        <div className="nav-anchor margin-bottom-4" id="access-through-idm">
          <h2>{t('accessThroughIDM')}</h2>

          <ProcessList>
            <ProcessListItem className="maxw-none">
              <ProcessListHeading type="h3">
                {t('stepsIDM.first.heading')}
              </ProcessListHeading>

              <p>{t('stepsIDM.first.description.one')}</p>

              <p className="margin-bottom-0">
                <Trans i18nKey="getAccess:stepsIDM.first.description.two">
                  <Link
                    aria-label="Open IDM in a new tab"
                    href="https://home.idm.cms.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    indexZero
                  </Link>
                </Trans>
              </p>
            </ProcessListItem>

            <ProcessListItem className="maxw-none">
              <ProcessListHeading type="h3">
                {t('stepsIDM.second.heading')}
              </ProcessListHeading>

              <ul className="margin-top-1 padding-left-4">
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.second.description.one">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsIDM.second.description.two">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>

                <li>
                  <Trans i18nKey="getAccess:stepsIDM.second.description.three">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
              </ul>
            </ProcessListItem>

            <ProcessListItem className="maxw-none padding-bottom-3">
              <ProcessListHeading type="h3">
                {t('stepsIDM.third.heading')}
              </ProcessListHeading>

              <p>{t('stepsIDM.third.description.one')}</p>

              <ul className="margin-top-1 padding-left-4">
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.third.description.two">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.third.description.three">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.third.description.four">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.third.description.five">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
              </ul>
            </ProcessListItem>

            <ProcessListItem className="maxw-none padding-bottom-3">
              <ProcessListHeading type="h3">
                {t('stepsIDM.fourth.heading')}
              </ProcessListHeading>

              <ul className="margin-top-1 padding-left-4">
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.fourth.description.one">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.fourth.description.two">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.fourth.description.three">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
              </ul>
            </ProcessListItem>

            <ProcessListItem className="maxw-none padding-bottom-3">
              <ProcessListHeading type="h3">
                {t('stepsIDM.fifth.heading')}
              </ProcessListHeading>

              <ul className="margin-top-1 padding-left-4">
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.fifth.description.one">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="getAccess:stepsIDM.fifth.description.two">
                    <span className="text-bold text-italic">indexZero</span>
                  </Trans>
                </li>
              </ul>
            </ProcessListItem>

            <ProcessListItem className="maxw-none">
              <ProcessListHeading type="h3">
                {t('stepsIDM.sixth.heading')}
              </ProcessListHeading>

              <Trans i18nKey="getAccess:stepsIDM.sixth.description">
                <UswdsReactLink to="/signin">indexZero</UswdsReactLink>
              </Trans>
            </ProcessListItem>
          </ProcessList>
        </div>

        <div className="nav-anchor" id="questions-or-issues">
          <Alert
            type="info"
            className="margin-bottom-2"
            heading={t('questionsHeading')}
          >
            <dt className="margin-bottom-0 margin-top-2">
              <Trans i18nKey="getAccess:questions">
                <Link href="mailto:MINTTeam@cms.hhs.gov">indexZero</Link>
              </Trans>
            </dt>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export const GetAccess = () => {
  const { t } = useTranslation('getAccess');

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid tablet={{ col: 12 }}>
            <HelpBreadcrumb text={t('overviewHeading')} home />

            <GetAccessContent help />
          </Grid>
        </GridContainer>
      </MainContent>
    </>
  );
};

export default GetAccess;

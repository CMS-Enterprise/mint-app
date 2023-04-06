import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, GridContainer, Link, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import NDABanner from 'components/NDABanner';

import './index.scss';

export type FooterItemType = {
  heading: string;
  description: string;
};

export type TableItemType = {
  need: string;
  solution: string;
  status: string;
};

export const Landing = () => {
  return (
    <div className="display-flex flex-column">
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </div>
  );
};

export const LandingHeader = () => {
  const { t } = useTranslation('landing');

  return (
    <div className="landing bg-primary-darker text-white">
      <GridContainer className="padding-top-2">
        <h1 className="landing__heading">{t('heading')}</h1>

        <p className="landing__description">{t('description')}</p>

        <UswdsReactLink
          className="usa-button bg-mint-cool-vivid text-white"
          variant="unstyled"
          to="/signin"
        >
          {t('signIn')}
        </UswdsReactLink>

        <NDABanner
          className="bg-primary-darker text-white padding-x-0 border-top border-primary-dark margin-top-6"
          landing
        />
      </GridContainer>
    </div>
  );
};

export const LandingBody = () => {
  const { t } = useTranslation('landing');

  return (
    <GridContainer className="padding-top-2 padding-bottom-8">
      <Grid row gap={6}>
        <Grid tablet={{ col: 12 }} className="display-flex flex-justify-center">
          <p className="text-bold landing__description">{t('bodyHeading')}</p>
        </Grid>

        <Grid tablet={{ col: 6 }} className="padding-bottom-2">
          <SolutionTable />
        </Grid>

        <Grid
          tablet={{ col: 6 }}
          className="landing__content flex-align-self-center"
        >
          <h2 className="margin-bottom-0">{t('bodyItem1.heading')}</h2>
          <p>{t('bodyItem1.description')}</p>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export const LandingFooter = () => {
  const { t } = useTranslation('landing');

  const footerItems: FooterItemType[] = t('footerItems', {
    returnObjects: true
  });

  return (
    <div className="landing bg-mint-cool-5 margin-bottom-neg-7">
      <GridContainer className="padding-top-6 padding-bottom-4">
        <h2 className="margin-bottom-2 margin-top-0">{t('heading')}</h2>

        <Grid row gap>
          {footerItems.map(item => (
            <Grid tablet={{ col: 4 }} key={item.heading}>
              <h3 className="margin-bottom-0">{item.heading}</h3>
              <p className="margin-top-1 line-height-mono-4">
                {item.description}
              </p>
            </Grid>
          ))}
        </Grid>

        <div className="display-flex landing__footer padding-top-2">
          <p className="text-bold margin-right-1">{t('access')}</p>
          <p>
            <Trans i18nKey="landing:email">
              indexOne
              <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
              indexTwo
            </Trans>
          </p>
        </div>
      </GridContainer>
    </div>
  );
};

const SolutionTable = () => {
  const { t } = useTranslation('landing');

  const tableHeaders: string[] = t('tableHeaders', {
    returnObjects: true
  });

  const tableItems: TableItemType[] = t('table', {
    returnObjects: true
  });

  const renderStatus = (status: string): string => {
    let statusClass = '';

    switch (status) {
      case tableItems[0].status:
        statusClass = 'bg-base-lighter';
        break;
      case tableItems[1].status:
        statusClass = 'bg-warning';
        break;
      case tableItems[2].status:
        statusClass = 'bg-accent-cool';
        break;
      case tableItems[3].status:
        statusClass = 'transparent border text-base';
        break;
      default:
        break;
    }
    return statusClass;
  };

  return (
    <table className="landing__table radius-md padding-2">
      <tr>
        {tableHeaders.map(header => (
          <th className="padding-1 padding-left-0 border-bottom-2px">
            {header}
          </th>
        ))}
      </tr>

      {tableItems.map((item, index) => (
        <tr>
          <td className="padding-1 padding-left-0">{item.need}</td>
          <td className="padding-1 padding-left-0">{item.solution}</td>
          <td
            className={classNames('padding-1 padding-left-0', {
              'padding-right-0': index === 3
            })}
          >
            <Tag
              className={classNames(
                'padding-1 line-height-body-1 text-bold',
                renderStatus(item.status)
              )}
            >
              {item.status}
            </Tag>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default Landing;

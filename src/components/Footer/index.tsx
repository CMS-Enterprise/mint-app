import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import {
  Footer as UswdsFooter,
  FooterNav,
  GridContainer,
  IconLightbulbOutline
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import ExternalLink from 'components/shared/ExternalLink';
import cmsGovLogo from 'images/cmsGovLogo.png';
import hhsLogo from 'images/hhsLogo.png';

import './index.scss';

const Footer = () => {
  const { t } = useTranslation(['footer', 'feedback']);

  const location = useLocation();

  const { authState } = useOktaAuth();

  const footerNavLinks = [
    {
      label: t('labels.privacy'),
      link: '/privacy-policy'
    },
    {
      label: t('labels.cookies'),
      link: '/cookies'
    },
    {
      label: t('labels.terms'),
      link: '/terms-and-conditions'
    },
    {
      label: t('labels.accessibility'),
      link: '/accessibility-statement'
    }
  ];

  return (
    <>
      {authState?.isAuthenticated &&
        location.pathname !== '/pre-decisional-notice' && (
          <MainContent
            className={classNames('bg-mint-cool-5 padding-y-2', {
              'margin-top-7': authState?.isAuthenticated
            })}
          >
            <GridContainer className="display-flex flex-justify">
              <div className="display-flex">
                <p className="text-bold margin-y-0 margin-right-4">
                  {t('feedback:footer.improveMint')}
                </p>

                <UswdsReactLink
                  target="_blank"
                  to="/report-a-problem"
                  variant="external"
                  className="font-sans-3xs flex-align-center padding-top-05 margin-right-4"
                >
                  {t('feedback:footer.reportProblem')}
                </UswdsReactLink>

                <UswdsReactLink
                  target="_blank"
                  to="/send-feedback"
                  variant="external"
                  className="font-sans-3xs flex-align-center padding-top-05 margin-right-4"
                >
                  {t('feedback:footer.sendFeedback')}
                </UswdsReactLink>

                <ExternalLink
                  href="https://cmsgov.slack.com/archives/C04B10ZN6A2"
                  className="font-sans-3xs flex-align-center padding-top-05"
                >
                  {t('feedback:footer.chatSlack')}
                </ExternalLink>
              </div>

              <IconLightbulbOutline className="margin-top-05 lightbulb" />
            </GridContainer>
          </MainContent>
        )}

      <UswdsFooter
        className={classNames({
          'margin-top-7': !authState?.isAuthenticated
        })}
        size="slim"
        primary={
          <div className="usa-footer__primary-container grid-row">
            <div className="mobile-lg:grid-col-8">
              <FooterNav
                size="slim"
                links={footerNavLinks.map(item => (
                  <UswdsReactLink
                    className="usa-footer__primary-link"
                    to={item.link}
                    key={item.link}
                  >
                    {item.label}
                  </UswdsReactLink>
                ))}
              />
            </div>
          </div>
        }
        secondary={
          <div>
            <div className="mint-footer__secondary-logo-wrap">
              <img alt={t('altText.cmsLogo')} src={cmsGovLogo} />
              <img
                className="margin-left-1"
                alt={t('altText.hhsLogo')}
                src={hhsLogo}
              />
            </div>
            <span>{t('cmsTagline')}</span>
          </div>
        }
      />
    </>
  );
};

export default Footer;

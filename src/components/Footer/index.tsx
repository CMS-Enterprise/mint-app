import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import {
  Footer as UswdsFooter,
  FooterNav,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import cmsGovLogo from 'assets/images/cmsGovLogo.png';
import hhsLogo from 'assets/images/hhsLogo.png';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import './index.scss';

const Footer = () => {
  const { t } = useTranslation(['footer', 'feedback']);

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const { feedbackEnabled } = useFlags();

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
        feedbackEnabled &&
        location.pathname !== '/pre-decisional-notice' && (
          <div
            className={classNames('bg-mint-cool-5 padding-y-2', {
              'margin-top-7': authState?.isAuthenticated
            })}
          >
            <GridContainer className="display-flex flex-justify flex-wrap">
              <Grid
                desktop={{ col: 3 }}
                tablet={{ col: 12 }}
                mobile={{ col: 12 }}
                className={classNames('display-flex', {
                  'margin-bottom-2': isTablet
                })}
              >
                <Grid
                  desktop={{ col: 12 }}
                  tablet={{ col: 10 }}
                  mobile={{ col: 10 }}
                  className="flex-none"
                >
                  <p className="text-bold margin-y-0">
                    {t('feedback:footer.improveMint')}
                  </p>
                </Grid>
                {isTablet && (
                  <Grid
                    tablet={{ col: 2 }}
                    mobile={{ col: 2 }}
                    className="mint-footer__lightbulb"
                  >
                    <Icon.LightbulbOutline className="lightbulb right-0" />
                  </Grid>
                )}
              </Grid>
              <Grid
                desktop={{ col: 2 }}
                tablet={{ col: 4 }}
                mobile={{ col: 4 }}
                className={classNames({
                  'margin-bottom-1': isTablet
                })}
              >
                <UswdsReactLink
                  target="_blank"
                  to="/report-a-problem"
                  variant="external"
                  className="font-sans-3xs flex-align-center padding-top-05"
                >
                  {t('feedback:footer.reportProblem')}
                </UswdsReactLink>
              </Grid>
              <Grid
                desktop={{ col: 2 }}
                tablet={{ col: 4 }}
                mobile={{ col: 4 }}
                className={classNames({
                  'margin-bottom-1': isTablet
                })}
              >
                <UswdsReactLink
                  target="_blank"
                  to="/send-feedback"
                  variant="external"
                  className="font-sans-3xs flex-align-center padding-top-05"
                >
                  {t('feedback:footer.sendFeedback')}
                </UswdsReactLink>
              </Grid>
              <Grid
                desktop={{ col: 3 }}
                tablet={{ col: 4 }}
                mobile={{ col: 4 }}
              >
                <ExternalLink
                  href="https://cmsgov.slack.com/archives/C04B10ZN6A2"
                  className="font-sans-3xs flex-align-center padding-top-05"
                >
                  {t('feedback:footer.chatSlack')}
                </ExternalLink>
              </Grid>
              <Grid
                desktop={{ col: 2 }}
                tablet={{ col: 4 }}
                mobile={{ col: 4 }}
                className="mint-footer__lightbulb"
              >
                {!isTablet && (
                  <Icon.LightbulbOutline className="margin-top-05 lightbulb" />
                )}
              </Grid>
            </GridContainer>
          </div>
        )}

      <UswdsFooter
        className={classNames({
          'margin-top-7': !authState?.isAuthenticated || !feedbackEnabled
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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { subComponentsProps } from 'features/ModelPlan/ReadOnly';
import MobileNav from 'features/ModelPlan/ReadOnly/_components/MobileNav';
import SideNav from 'features/ModelPlan/ReadOnly/_components/Sidenav';
import { NotFoundPartial } from 'features/NotFound';

import Alert from 'components/Alert';
import Sidepanel from 'components/Sidepanel';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { HelpSolutionType } from '../../solutionsMap';
import Contact from '../_components/Contact';
import Header from '../_components/Header';
import About from '../About';
import ModelUsage from '../ModelUsage';
import PointsOfContact from '../PointsOfContact';
import Timeline from '../Timeline';

import './index.scss';

// Formats the query params on modal route change
export const formatQueryParam = (
  paramValues: string[],
  section: 'about' | 'timeline' | 'points-of-contact' | 'model-usage',
  closeRoute: string
) =>
  `${closeRoute}?${paramValues
    .filter(param => !param.includes('section'))
    .join('&')}&section=${section}`;

const subComponents = (
  solution: HelpSolutionType,
  location: any,
  closeRoute: string
): subComponentsProps => {
  const paramValues = location.search.substring(1).split('&');

  return {
    about: {
      route: formatQueryParam(paramValues, 'about', closeRoute),
      helpRoute: formatQueryParam(paramValues, 'about', closeRoute),
      component: <About solution={solution} />
    },
    timeline: {
      route: formatQueryParam(paramValues, 'timeline', closeRoute),
      helpRoute: formatQueryParam(paramValues, 'timeline', closeRoute),
      component: <Timeline solution={solution} />
    },
    'points-of-contact': {
      route: formatQueryParam(paramValues, 'points-of-contact', closeRoute),
      helpRoute: formatQueryParam(paramValues, 'points-of-contact', closeRoute),
      component: <PointsOfContact solution={solution} />
    },
    'model-usage': {
      route: formatQueryParam(paramValues, 'model-usage', closeRoute),
      helpRoute: formatQueryParam(paramValues, 'model-usage', closeRoute),
      component: <ModelUsage solution={solution} />
    }
  };
};

type SolutionDetailsModalProps = {
  solution: HelpSolutionType;
  openedFrom: string | undefined;
  closeRoute: string | (() => string);
};

const SolutionDetailsModal = ({
  solution,
  openedFrom,
  closeRoute
}: SolutionDetailsModalProps) => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const milestoneParam = params.get('milestone');
  const solutionParam = params.get('solution');
  const readViewParam = params.get('view-solution');
  const selectSolutions = params.get('select-solutions');
  const solutionEnumParam = params.get('solution-key');
  const section = params.get('section') || 'about';

  const { t } = useTranslation('helpAndKnowledge');

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(!!solution);

  // Used to maintain previous route when opening and navigating through modal
  const [prevRoute] = useState<string | undefined>(
    openedFrom === 'undefined' ||
      openedFrom?.includes('solution=') ||
      openedFrom?.includes('solution-key=') // If openedFrom pasted in URL with already set params, set to undefined
      ? undefined
      : openedFrom
  );

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  const primaryContact = solution?.pointsOfContact?.find(
    contact => contact.isPrimary
  );

  useEffect(() => {
    setIsOpen(!!solution);
  }, [solution]);

  if (!solution) {
    return <NotFoundPartial />;
  }

  const setCloseRoute =
    typeof closeRoute === 'function' ? closeRoute() : closeRoute;

  // On modal close, returns to previous route state if present
  const closeModal = () => {
    let closeModalRoute = prevRoute || setCloseRoute;

    // Return to read view if opened from there
    if (readViewParam) {
      closeModalRoute = `${closeModalRoute}?view-solution=${readViewParam}`;
    }

    navigate(closeModalRoute, {
      state: { fromModal: true }
    });
  };

  const subComponentsLinks = subComponents(solution, location, setCloseRoute);

  const renderModal = () => {
    return (
      <Sidepanel
        ariaLabel={t('ariaLabel')}
        isOpen={isOpen}
        closeModal={closeModal}
        modalHeading={t('operationalSolutions')}
        testid="operational-solution-modal"
        wideContent
        overlayClassName={
          (milestoneParam && solutionParam) ||
          (milestoneParam && solutionEnumParam) ||
          selectSolutions ||
          readViewParam
            ? 'bg-transparent'
            : ''
        }
      >
        <Header solution={solution} />

        {isMobile && (
          <MobileNav
            subComponents={subComponentsLinks}
            subinfo={section}
            isHelpArticle
            solutionDetailRoute={prevRoute}
            solutionNavigation
            paramActive
          />
        )}

        <GridContainer className="padding-y-6 operational-solution-modal__body">
          <Grid row>
            {!isMobile && (
              <Grid desktop={{ col: 4 }}>
                <div className="margin-bottom-6">
                  <SideNav
                    subComponents={subComponentsLinks}
                    isHelpArticle
                    solutionNavigation
                    paramActive
                  />
                </div>

                <Contact contact={primaryContact} closeRoute={setCloseRoute} />

                <Alert type="info" noIcon lessPadding className="margin-top-5">
                  {t('itLeadInfo')}
                </Alert>
              </Grid>
            )}

            <Grid
              desktop={{ col: 7 }}
              className="padding-bottom-4 border-bottom-1px border-base-light desktop:border-bottom-0"
            >
              {
                subComponents(solution, location, setCloseRoute)[section]
                  ?.component
              }
            </Grid>

            {isMobile && (
              <>
                <Grid col={12}>
                  <Contact contact={primaryContact} />
                </Grid>
                <Grid col={12}>
                  <Alert type="info" noIcon lessPadding>
                    {t('itLeadInfo')}
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        </GridContainer>
      </Sidepanel>
    );
  };

  return <>{renderModal()}</>;
};

export default SolutionDetailsModal;

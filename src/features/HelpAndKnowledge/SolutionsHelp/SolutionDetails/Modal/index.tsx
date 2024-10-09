import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
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
import PointsOfContact from '../PointsOfContact';
import Timeline from '../Timeline';

import './index.scss';

// Formats the query params on modal route change
export const formatQueryParam = (
  paramValues: string[],
  section: 'about' | 'timeline' | 'points-of-contact',
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
    }
  };
};

type SolutionDetailsModalProps = {
  solution: HelpSolutionType;
  openedFrom: string | undefined;
  closeRoute: string;
};

const SolutionDetailsModal = ({
  solution,
  openedFrom,
  closeRoute
}: SolutionDetailsModalProps) => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const section = params.get('section') || 'about';

  const { t } = useTranslation('helpAndKnowledge');

  const history = useHistory();

  const [isOpen, setIsOpen] = useState<boolean>(!!solution);

  // Used to maintain previous route when opening and navigating through modal
  const [prevRoute] = useState<string | undefined>(
    openedFrom === 'undefined' || openedFrom?.includes('solution=') // If openedFrom pasted in URL with already set params, set to undefined
      ? undefined
      : openedFrom
  );

  const isMobile = useCheckResponsiveScreen('tablet');

  const primaryContact = solution?.pointsOfContact?.find(
    contact => contact.isPrimary
  );

  useEffect(() => {
    setIsOpen(!!solution);
  }, [solution]);

  // On modal close, returns to previous route state if present
  const closeModal = () => {
    history.push(prevRoute || closeRoute, {
      fromModal: true
    });
  };

  if (!solution) {
    return <NotFoundPartial />;
  }

  const renderModal = () => {
    return (
      <Sidepanel
        ariaLabel={t('ariaLabel')}
        isOpen={isOpen}
        closeModal={closeModal}
        modalHeading={t('operationalSolutions')}
        testid="operational-solution-modal"
      >
        <Header solution={solution} />

        {isMobile && (
          <MobileNav
            subComponents={subComponents(solution, location, closeRoute)}
            subinfo={section}
            isHelpArticle
            solutionDetailRoute={prevRoute}
          />
        )}

        <GridContainer className="padding-y-6 margin-left-0">
          <Grid row gap>
            {!isMobile && (
              <Grid desktop={{ col: 3 }}>
                <SideNav
                  subComponents={subComponents(solution, location, closeRoute)}
                  isHelpArticle
                  solutionNavigation
                  paramActive
                />

                <Contact contact={primaryContact} closeRoute={closeRoute} />

                <Alert type="info" noIcon lessPadding className="margin-top-5">
                  {t('itLeadInfo')}
                </Alert>
              </Grid>
            )}

            <Grid desktop={{ col: 8 }}>
              {
                subComponents(solution, location, closeRoute)[section]
                  ?.component
              }
            </Grid>

            <Grid desktop={{ col: 1 }} />

            {isMobile && (
              <Grid desktop={{ col: 3 }}>
                <Contact contact={primaryContact} />
              </Grid>
            )}
          </Grid>
        </GridContainer>
      </Sidepanel>
    );
  };

  return <>{renderModal()}</>;
};

export default SolutionDetailsModal;

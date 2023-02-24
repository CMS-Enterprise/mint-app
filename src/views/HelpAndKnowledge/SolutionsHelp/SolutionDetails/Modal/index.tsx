import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Grid, GridContainer, IconClose } from '@trussworks/react-uswds';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { subComponentsProps } from 'views/ModelPlan/ReadOnly';
import MobileNav from 'views/ModelPlan/ReadOnly/_components/MobileNav';
import SideNav from 'views/ModelPlan/ReadOnly/_components/Sidenav';
import { RouterContext } from 'views/RouterContext';

import { HelpSolutionType } from '../../solutionsMap';
import Contact from '../_components/Contact';
import Header from '../_components/Header';
import About from '../About';
import PointsOfContact from '../PointsOfContact';
import Timeline from '../Timeline';

import './index.scss';

const subComponents = (solution: HelpSolutionType): subComponentsProps => ({
  about: {
    route: `/help-and-knowledge/operational-solutions/solutions/${solution.route}/about`,
    helpRoute: `/help-and-knowledge/operational-solutions/solutions/${solution.route}/about`,
    component: <About />
  },
  timeline: {
    route: `/help-and-knowledge/operational-solutions/solutions/${solution.route}/timeline`,
    helpRoute: `/help-and-knowledge/operational-solutions/solutions/${solution.route}/timeline`,
    component: <Timeline />
  },
  'points-of-contact': {
    route: `/help-and-knowledge/operational-solutions/solutions/${solution.route}/points-of-contact`,
    helpRoute: `/help-and-knowledge/operational-solutions/solutions/${solution.route}/points-of-contact`,
    component: <PointsOfContact />
  }
});

type SolutionDetailsModalProps = {
  solution: HelpSolutionType;
};

const SolutionDetailsModal = ({ solution }: SolutionDetailsModalProps) => {
  const { page } = useParams<{
    page: string;
  }>();

  const { t } = useTranslation('helpAndKnowledge');

  const history = useHistory();
  const { pathname } = useLocation();

  const { to } = useContext(RouterContext);

  // Used to maintain state of view underneath modal when route changes
  const [prev, setPrev] = useState<string | undefined>(to);

  const [isOpen, setIsOpen] = useState<boolean>(!!solution);

  const isMobile = useCheckResponsiveScreen('tablet');

  // This sets and maintains the existing route before opening the modal
  useEffect(() => {
    if (!prev) {
      setPrev(to);
    }
  }, [to, prev]);

  useEffect(() => {
    setIsOpen(!!solution);
  }, [solution]);

  // On modal close, returns to previous route state if present
  const closeModal = () =>
    history.push(prev || '/help-and-knowledge/operational-solutions', {
      prev: pathname
    });

  const renderModal = () => {
    return (
      <ReactModal
        isOpen={isOpen}
        overlayClassName="mint-discussions__overlay overflow-y-scroll"
        className="mint-discussions__content solution-details-modal"
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick
        contentLabel={t('ariaLabel')}
        appElement={document.getElementById('root')! as HTMLElement}
      >
        <div data-testid="discussion-modal">
          <div className="mint-discussions__x-button-container display-flex text-base flex-align-center">
            <button
              type="button"
              data-testid="close-discussions"
              className="mint-discussions__x-button margin-right-2"
              aria-label="Close Modal"
              onClick={closeModal}
            >
              <IconClose size={4} className="text-base" />
            </button>
            <h4 className="margin-0">{t('operationalSolutions')}</h4>
          </div>

          <Header solution={solution} />

          {isMobile && (
            <MobileNav
              subComponents={subComponents(solution)}
              subinfo={page}
              isHelpArticle
              solutionDetail
            />
          )}

          <GridContainer className="padding-y-6 margin-left-0">
            <Grid row gap>
              {!isMobile && (
                <Grid desktop={{ col: 3 }}>
                  <>
                    <SideNav
                      subComponents={subComponents(solution)}
                      isHelpArticle
                      solutionNavigation
                    />

                    <Contact contact={solution.pointsOfContact[0]} />
                  </>
                </Grid>
              )}

              <Grid desktop={{ col: 9 }}>
                {subComponents(solution)[page].component}
              </Grid>

              {isMobile && (
                <Grid desktop={{ col: 3 }}>
                  <Contact contact={solution.pointsOfContact[0]} />
                </Grid>
              )}
            </Grid>
          </GridContainer>
        </div>
      </ReactModal>
    );
  };

  return <>{renderModal()}</>;
};

export default SolutionDetailsModal;

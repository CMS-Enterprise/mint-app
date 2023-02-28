import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, GridContainer, IconClose } from '@trussworks/react-uswds';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { subComponentsProps } from 'views/ModelPlan/ReadOnly';
import MobileNav from 'views/ModelPlan/ReadOnly/_components/MobileNav';
import SideNav from 'views/ModelPlan/ReadOnly/_components/Sidenav';
import { NotFoundPartial } from 'views/NotFound';

import { HelpSolutionType } from '../../solutionsMap';
import Contact from '../_components/Contact';
import Header from '../_components/Header';
import About from '../About';
import PointsOfContact from '../PointsOfContact';
import Timeline from '../Timeline';

import './index.scss';

const subComponents = (solution: HelpSolutionType): subComponentsProps => ({
  about: {
    route: `/help-and-knowledge/operational-solutions/solution/${solution.route}/about`,
    helpRoute: `/help-and-knowledge/operational-solutions/solution/${solution.route}/about`,
    component: <About solution={solution} />
  },
  timeline: {
    route: `/help-and-knowledge/operational-solutions/solution/${solution.route}/timeline`,
    helpRoute: `/help-and-knowledge/operational-solutions/solution/${solution.route}/timeline`,
    component: <Timeline solution={solution} />
  },
  'points-of-contact': {
    route: `/help-and-knowledge/operational-solutions/solution/${solution.route}/points-of-contact`,
    helpRoute: `/help-and-knowledge/operational-solutions/solution/${solution.route}/points-of-contact`,
    component: <PointsOfContact solution={solution} />
  }
});

type SolutionDetailsModalProps = {
  solution: HelpSolutionType;
  openedFrom: string | undefined;
};

const SolutionDetailsModal = ({
  solution,
  openedFrom
}: SolutionDetailsModalProps) => {
  const { page } = useParams<{
    page: string;
  }>();

  const { t } = useTranslation('helpAndKnowledge');

  const history = useHistory();

  const [isOpen, setIsOpen] = useState<boolean>(!!solution);

  // Used to maintain previous route when opening and navigating through modal
  const [prevRoute] = useState<string | undefined>(
    openedFrom === 'undefined' ? undefined : openedFrom
  );

  const isMobile = useCheckResponsiveScreen('tablet');

  useEffect(() => {
    setIsOpen(!!solution);
  }, [solution]);

  // Disabled background component scrolling when modal open and stubs scroll width
  const handleModal = (state: 'unset' | 'hidden') => {
    document.body.style.overflow = state;
    (document.getElementById('root')! as HTMLElement).style.marginRight =
      state === 'unset' ? '0px' : '23px';
  };

  // On modal close, returns to previous route state if present
  const closeModal = () => {
    history.push(prevRoute || '/help-and-knowledge/operational-solutions', {
      fromModal: true
    });
  };

  if (!solution) {
    return <NotFoundPartial />;
  }

  const renderModal = () => {
    return (
      <ReactModal
        isOpen={isOpen}
        overlayClassName="mint-discussions__overlay overflow-y-scroll"
        className="mint-discussions__content solution-details-modal"
        onAfterOpen={() => handleModal('hidden')}
        onAfterClose={() => handleModal('unset')}
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

                    <Contact
                      contact={solution.pointsOfContact[0]}
                      solutionRoute={solution.route}
                    />
                  </>
                </Grid>
              )}

              <Grid desktop={{ col: 8 }}>
                {subComponents(solution)[page]?.component}
              </Grid>

              <Grid desktop={{ col: 1 }} />

              {isMobile && (
                <Grid desktop={{ col: 3 }}>
                  <Contact
                    contact={solution.pointsOfContact[0]}
                    solutionRoute={solution.route}
                  />
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

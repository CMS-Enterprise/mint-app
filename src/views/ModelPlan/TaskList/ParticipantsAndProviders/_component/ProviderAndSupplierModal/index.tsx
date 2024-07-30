import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

type ProviderAndSupplierModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const ProviderAndSupplierModal = ({
  isOpen,
  closeModal
}: ProviderAndSupplierModalProps) => {
  const { t: modalT } = useTranslation('participantsAndProvidersMisc');
  const isMobile = useCheckResponsiveScreen('tablet');

  const renderModal = () => {
    return (
      <ReactModal
        isOpen={isOpen}
        overlayClassName="mint-discussions__overlay overflow-y-scroll"
        className="mint-discussions__content solution-details-modal"
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick
        appElement={document.getElementById('root')! as HTMLElement}
      >
        <div data-testid="provider-physician-type-modal">
          <div className="mint-discussions__x-button-container display-flex text-base flex-align-center">
            <button
              type="button"
              data-testid="close-discussions"
              className="mint-discussions__x-button margin-right-2"
              aria-label="Close Modal"
              onClick={closeModal}
            >
              <Icon.Close size={4} className="text-base" />
            </button>
            <h4 className="margin-0">{modalT('modal.title')}</h4>
          </div>

          <div className="bg-primary-darker text-white padding-x-4 padding-top-5 padding-bottom-6">
            <div>
              <h1 className="margin-0 margin-top-05 line-height-body-2">
                {modalT('modal.title')}
              </h1>
              <h4 className="margin-0 text-primary-lighter">
                {modalT('modal.asOfDate')}
              </h4>
            </div>
          </div>

          {/* {isMobile && (
            <MobileNav
              subComponents={subComponents(solution, location, closeRoute)}
              subinfo={section}
              isHelpArticle
              solutionDetailRoute={prevRoute}
            />
          )} */}

          <GridContainer className="padding-y-6 margin-left-0">
            <Grid row gap>
              {!isMobile && (
                <Grid desktop={{ col: 3 }}>
                  {/* <SideNav
                    subComponents={subComponents(
                      solution,
                      location,
                      closeRoute
                    )}
                    isHelpArticle
                    solutionNavigation
                    paramActive
                  /> */}
                  <p>hello world</p>
                </Grid>
              )}

              {/* <Grid desktop={{ col: 8 }}>
                {
                  subComponents(solution, location, closeRoute)[section]
                    ?.component
                }
              </Grid> */}

              <Grid desktop={{ col: 1 }} />
            </Grid>
          </GridContainer>
        </div>
      </ReactModal>
    );
  };

  return <>{renderModal()}</>;
};

export default ProviderAndSupplierModal;

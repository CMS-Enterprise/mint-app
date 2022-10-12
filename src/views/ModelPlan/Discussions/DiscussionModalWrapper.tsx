import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Grid, GridContainer, IconClose } from '@trussworks/react-uswds';
import noScroll from 'no-scroll';

import PageLoading from 'components/PageLoading';
import discussions from 'i18n/en-US/draftModelPlan/discussions';

import { DiscussionsProps } from '.';

const DiscussionModalWrapper = ({
  modelID,
  isOpen,
  askAQuestion,
  openModal,
  closeModal
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');
  // const { t: h } = useTranslation('draftModelPlan');

  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-discussions__overlay overflow-y-scroll"
      className="mint-discussions__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
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
          <h4 className="margin-0">{t('modalHeading')}</h4>
        </div>
        <GridContainer className="padding-y-8">
          {loading && !discussions ? (
            <PageLoading />
          ) : (
            <Grid desktop={{ col: 12 }}>{chooseRenderMethod()}</Grid>
          )}
        </GridContainer>
      </div>
    </ReactModal>
  );
};

export default DiscussionModalWrapper;

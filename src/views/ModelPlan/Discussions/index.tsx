import React, { ReactNode, ReactNodeArray } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import {
  Button,
  Grid,
  GridContainer,
  IconAnnouncement,
  IconClose
} from '@trussworks/react-uswds';
import noScroll from 'no-scroll';

import PageHeading from 'components/PageHeading';
import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';

import './index.scss';

type DiscussionsProps = {
  //   children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  discussions: DiscussionType[];
  openModal?: () => void;
  closeModal: () => void;
};

const Discussions = ({
  //   children,
  isOpen,
  discussions,
  openModal,
  closeModal
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  const renderQuestion = () => {
    return <></>;
  };

  const renderDiscussions = () => {
    return (
      <>
        {' '}
        <PageHeading headingLevel="h1" className="margin-top-0">
          {t('heading')}
        </PageHeading>
        <div className="display-flex">
          <IconAnnouncement className="text-primary margin-right-1" />
          <Button type="button" unstyled onClick={() => console.log('hey')}>
            {t('askAQuestionLink')}
          </Button>
        </div>
      </>
    );
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-discussions__overlay"
      className="mint-discussions__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick
      appElement={document.getElementById('root')!}
    >
      <div className="mint-discussions__x-button-container display-flex text-base flex-align-center">
        <button
          type="button"
          className="mint-discussions__x-button margin-right-2"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <IconClose size={4} className="text-base" />
        </button>
        <h4 className="margin-0">{t('modalHeading')}</h4>
      </div>
      <GridContainer className="padding-y-8">
        <Grid desktop={{ col: 12 }}>
          {discussions?.length > 0 ? renderDiscussions() : renderQuestion()}
        </Grid>
      </GridContainer>
    </ReactModal>
  );
};

export default Discussions;

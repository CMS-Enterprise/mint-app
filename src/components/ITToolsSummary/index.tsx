import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, SummaryBox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { LockStatus } from 'views/SubscriptionHandler';

interface ITToolsSummaryPropType {
  className?: string;
  answered: boolean;
  needsTool: boolean;
  question: string;
  answers: string[];
  options?: string[];
  redirect: string;
  subtext?: string;
  locked: LockStatus;
  scrollElememnt?: string;
}

const ITToolsSummary = ({
  className,
  answered,
  needsTool,
  question,
  answers,
  options,
  redirect,
  subtext,
  locked,
  scrollElememnt = ''
}: ITToolsSummaryPropType) => {
  const { t } = useTranslation('itTools');
  const { modelID } = useParams<{ modelID: string }>();
  const [isModalOpen, setModalOpen] = useState(false);

  const renderModal = () => {
    return (
      <Modal
        className="radius-lg"
        isOpen={isModalOpen}
        scroll
        closeModal={() => setModalOpen(false)}
      >
        <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-0">
          {t('modal.heading')}
        </PageHeading>
        <p className="margin-bottom-3">{t('modal.subHeading')}</p>
        <UswdsReactLink
          data-testid="return-to-task-list"
          className="margin-right-2 usa-button text-white text-no-underline"
          to={`/models/${modelID}/task-list`}
        >
          {t('modal.return')}
        </UswdsReactLink>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('modal.goBack')}
        </Button>
      </Modal>
    );
  };

  return (
    <SummaryBox
      heading={t('summaryBox.heading')}
      className={classNames(className)}
    >
      {renderModal()}
      <p
        className="text-bold"
        data-testid={`has-answered-tools-question-${scrollElememnt}`}
      >
        {answered
          ? t('summaryBox.previouslyAnswered')
          : t('summaryBox.havenNotAnswered')}
      </p>
      <p
        className="margin-bottom-0"
        data-testid={`tools-question-${scrollElememnt}`}
      >
        {question}
      </p>
      {answered && answers.length && (
        <ul className="margin-y-0" data-testid="tools-answers">
          {answers.map(answer => (
            <li key={answer}>{answer}</li>
          ))}
        </ul>
      )}
      {!needsTool && (
        <div className="text-base">
          <p data-testid={`tools-change-answer-${scrollElememnt}`}>
            {subtext || t('changeAnswer')}
          </p>
          {!subtext && options && (
            <ul className="margin-y-0">
              {options.map(option => (
                <li key={option}>{option}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p>
        {t('summaryBox.changeAnswer')}{' '}
        {locked === LockStatus.UNLOCKED ? (
          <UswdsReactLink
            data-testid={`it-tools-redirect-${scrollElememnt}`}
            to={{
              pathname: redirect,
              state: { scrollElement: scrollElememnt }
            }}
          >
            {t('summaryBox.goToQuestion')}
          </UswdsReactLink>
        ) : (
          <Button
            type="button"
            data-testid={`it-tools-locked-${scrollElememnt}`}
            className="usa-button usa-button--unstyled"
            onClick={() => setModalOpen(true)}
          >
            {t('summaryBox.goToQuestion')}
          </Button>
        )}
        .
      </p>
    </SummaryBox>
  );
};

export default ITToolsSummary;

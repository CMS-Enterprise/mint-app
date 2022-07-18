import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

interface ITToolsSummaryPropType {
  className?: string;
  answered: boolean;
  needsTool: boolean;
  question: string;
  answers: string[];
  options?: string[];
  redirect: string;
  subtext?: string;
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
  scrollElememnt = ''
}: ITToolsSummaryPropType) => {
  const { t } = useTranslation('itTools');

  return (
    <SummaryBox
      heading={t('summaryBox.heading')}
      className={classNames(className)}
    >
      <p className="text-bold" data-testid="has-answered-tools-question">
        {answered
          ? t('summaryBox.previouslyAnswered')
          : t('summaryBox.havenNotAnswered')}
      </p>
      <p className="margin-bottom-0" data-testid="tools-question">
        {question}
      </p>
      {answered && answers.length && (
        <ul className="margin-y-0">
          {answers.map(answer => (
            <li key={answer}>{answer}</li>
          ))}
        </ul>
      )}
      {!needsTool && (
        <div className="text-base">
          <p data-testid="tools-change-answer">
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
        <UswdsReactLink
          to={{
            pathname: redirect,
            state: { scrollElement: scrollElememnt }
          }}
        >
          {t('summaryBox.goToQuestion')}
        </UswdsReactLink>
        .
      </p>
    </SummaryBox>
  );
};

export default ITToolsSummary;

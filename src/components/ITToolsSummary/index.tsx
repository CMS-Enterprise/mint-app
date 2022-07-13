import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type ITToolsSummaryPropType = {
  className?: string;
  answered: boolean;
  needsTool: boolean;
  question: string;
  answers: string[];
  options?: string[];
  redirect: string;
  subtext?: string;
};

const ITToolsSummary = ({
  className,
  answered,
  needsTool,
  question,
  answers,
  options,
  redirect,
  subtext
}: ITToolsSummaryPropType) => {
  const { t } = useTranslation('itTools');

  return (
    <SummaryBox
      heading={t('summaryBox.heading')}
      className={classNames(className)}
    >
      <p className="text-bold">
        {answered
          ? t('summaryBox.previouslyAnswered')
          : t('summaryBox.havenNotAnswered')}
      </p>
      <p>{question}</p>
      {answered && answers.length && (
        <ul>
          {answers.map(answer => (
            <li key={answer}>{answer}</li>
          ))}
        </ul>
      )}
      {!needsTool && (
        <div className="text-base">
          <p>{subtext || t('changeAnswer')}</p>
          {!subtext && options && (
            <ul>
              {options.map(option => (
                <li key={option}>{option}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p>
        {t('summaryBox.changeAnswer')}{' '}
        <UswdsReactLink to={redirect}>
          {t('summaryBox.goToQuestion')}
        </UswdsReactLink>
        .
      </p>
    </SummaryBox>
  );
};

export default ITToolsSummary;

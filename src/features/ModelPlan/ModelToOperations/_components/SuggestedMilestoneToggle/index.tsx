import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MilestoneCardType } from 'features/MilestoneLibrary/MilestoneCard';

import UswdsReactLink from 'components/LinkWrapper';

import {
  formatMilestoneAnswers,
  ReasonType
} from '../../_utils/suggestedMilestone';

type SuggestedMilestoneToggleType = {
  milestone: MilestoneCardType;
  className?: string;
};

const SuggestedMilestoneToggle = ({
  milestone,
  className
}: SuggestedMilestoneToggleType) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  // Toggle the collapsed state of milestone question/answer
  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  const {
    answers: milestoneAnswers,
    scrollElement,
    questionUrl,
    groupLabel,
    isMultiQuestions
  } = useMemo(
    () => formatMilestoneAnswers(milestone.suggested?.reasons || []),
    [milestone.suggested?.reasons]
  );

  const formattedAnswers = useMemo(() => {
    if (milestoneAnswers.length === 0) {
      return <></>;
    }

    if (!isMultiQuestions) {
      return milestoneAnswers.map(milestoneAnswer => (
        <span key={milestoneAnswer.question}>
          {milestoneAnswer.answers.join(', ')}
        </span>
      ));
    }

    return milestoneAnswers.map((milestoneAnswer: ReasonType) => {
      return (
        <li className="margin-y-1" key={milestoneAnswer.question}>
          {milestoneAnswer.question} - {milestoneAnswer.answers.join(', ')}
        </li>
      );
    });
  }, [milestoneAnswers, isMultiQuestions]);

  return (
    <div className={classNames(className)}>
      <button
        type="button"
        data-testid="toggle-milestone-answer"
        onClick={() => setInfoToggle(!infoToggle)}
        className={classNames(
          'usa-button usa-button--unstyled display-flex flex-align-center text-ls-1 deep-underline margin-bottom-1 margin-top-1',
          {
            'text-bold': infoToggle
          }
        )}
      >
        {infoToggle ? (
          <Icon.ExpandMore className="margin-right-05" aria-label="expand" />
        ) : (
          <Icon.ExpandLess
            className="margin-right-05 needs-question__rotate"
            aria-label="collapse"
          />
        )}

        {t('milestoneLibrary.whySuggested')}
      </button>

      {infoToggle && (
        <>
          <div className="margin-left-neg-2px padding-1">
            <div className="border-left-05 border-base-dark padding-left-2 padding-y-1">
              <p className="text-bold margin-top-0">
                {t('milestoneLibrary.youAnswered')}
              </p>

              <p data-testid="milestone-question" className="margin-0">
                Q:{' '}
                {isMultiQuestions
                  ? groupLabel
                  : milestone.suggested.reasons[0]?.question}
              </p>

              {!isMultiQuestions && (
                <ul className="padding-left-0">
                  <span>A: {formattedAnswers}</span>
                </ul>
              )}

              {isMultiQuestions && (
                <ul className="padding-left-4">{formattedAnswers}</ul>
              )}

              <p className="margin-bottom-0">
                {t('milestoneLibrary.changeAnswer')}
                <UswdsReactLink
                  className="display-block"
                  to={`/models/${modelID}/collaboration-area/model-plan/${questionUrl}`}
                  state={{
                    scrollElement
                  }}
                >
                  {t('milestoneLibrary.goToQuestion')}
                </UswdsReactLink>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestedMilestoneToggle;

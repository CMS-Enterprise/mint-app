import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconExpandLess, IconExpandMore } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { NeedMap } from 'data/operationalNeedMap';
import {
  translateAgreementTypes,
  translateAppealsQuestionType,
  translateBenchmarkForPerformanceType,
  translateBoolean,
  translateCommunicationType,
  translateDataForMonitoringType,
  translateDataToSendParticipantsType,
  translateEvaluationApproachType,
  translateModelLearningSystemType,
  translateNonClaimsBasedPayType,
  translateOverlapType,
  translateParticipantIDType,
  translateParticipantSelectiontType,
  translatePayType,
  translateRecruitmentType
} from 'utils/modelPlan';

// Type definition for operational needs dependent on multiple questions/translations
type MultiPartType = {
  question: string;
  answer: boolean | string;
};

type NeedMapType = {
  [key: string]: (type: any) => string;
};

type InfoToggleTypes = {
  data: any;
  answers: any;
  needConfig: NeedMap;
  modelID: string;
};

// Collection of translations needed for operational needs questions/answers
const needsTranslations: NeedMapType = {
  translateBoolean,
  translateAgreementTypes,
  translateParticipantIDType,
  translateRecruitmentType,
  translateParticipantSelectiontType,
  translateCommunicationType,
  translateBenchmarkForPerformanceType,
  translateEvaluationApproachType,
  translateDataForMonitoringType,
  translateDataToSendParticipantsType,
  translateModelLearningSystemType,
  translatePayType,
  translateNonClaimsBasedPayType,
  translateAppealsQuestionType,
  translateOverlapType
};

const InfoToggle = ({
  data,
  answers,
  needConfig,
  modelID
}: InfoToggleTypes) => {
  const { t } = useTranslation('itSolutions');

  // Toggle the collapsed state of operational need question/answer
  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        data-testid="toggle-need-answer"
        onClick={() => setInfoToggle(!infoToggle)}
        className={classNames(
          'usa-button usa-button--unstyled display-flex flex-align-center text-ls-1 deep-underline margin-bottom-1 margin-top-1',
          {
            'text-bold': infoToggle
          }
        )}
      >
        {infoToggle ? (
          <IconExpandMore className="margin-right-05" />
        ) : (
          <IconExpandLess className="margin-right-05 needs-question__rotate" />
        )}

        {t('whyNeed')}
      </button>

      {infoToggle && (
        <div className="margin-left-neg-2px padding-1">
          <div className="border-left-05 border-base-dark padding-left-2 padding-y-1">
            <p className="text-bold margin-top-0">{t('youAnswered')}</p>

            <p data-testid="need-question">{t(needConfig?.question)}</p>

            {data && needConfig && (
              <ul className="padding-left-4">
                {!needConfig.multiPart &&
                  answers.map((answer: string | boolean) => (
                    <li
                      className="margin-y-1"
                      key={answer.toString()}
                      data-testid={answer.toString()}
                    >
                      {needsTranslations[needConfig.answer](answer)}
                    </li>
                  ))}

                {needConfig.multiPart &&
                  needConfig.multiPartQuestion &&
                  answers.map((answer: MultiPartType) => (
                    <li className="margin-y-1" key={answer.question}>
                      {needsTranslations[needConfig.multiPartQuestion!](
                        answer.question
                      )}{' '}
                      - {needsTranslations[needConfig.answer](answer.answer)}
                    </li>
                  ))}
              </ul>
            )}

            <p className="margin-bottom-0">
              {t('changeAnswer')}
              <UswdsReactLink
                to={{
                  pathname: `/models/${modelID}/task-list/${needConfig?.route}`,
                  state: { scrollElement: needConfig.fieldName.toString() }
                }}
              >
                {t('goToQuestion')}
              </UswdsReactLink>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoToggle;

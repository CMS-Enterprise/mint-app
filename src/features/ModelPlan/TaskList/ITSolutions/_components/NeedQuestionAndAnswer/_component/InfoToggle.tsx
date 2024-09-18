import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NeedMap } from 'features/ModelPlan/TaskList/ITSolutions/operationalNeedMap';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';

// Type definition for operational needs dependent on multiple questions/translations
type MultiPartType = {
  question: string;
  answer: boolean | string;
};

type InfoToggleTypes = {
  data: any;
  answers: any;
  needConfig: NeedMap;
  modelID: string;
};

const InfoToggle = ({
  data,
  answers,
  needConfig,
  modelID
}: InfoToggleTypes) => {
  const { t } = useTranslation('opSolutionsMisc');

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
          <Icon.ExpandMore className="margin-right-05" />
        ) : (
          <Icon.ExpandLess className="margin-right-05 needs-question__rotate" />
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
                      {i18next.t(
                        `${needConfig.parentField}:${needConfig.fieldName}.options.${answer}`
                      )}
                    </li>
                  ))}

                {needConfig.multiPart &&
                  answers.map((answer: MultiPartType) => (
                    <li className="margin-y-1" key={answer.question}>
                      {i18next.t(
                        `${needConfig.parentField}:${answer.question}.label`
                      )}{' '}
                      -{' '}
                      {i18next.t(
                        `${needConfig.parentField}:${answer.question}.options.${answer.answer}`
                      )}
                    </li>
                  ))}
              </ul>
            )}

            <p className="margin-bottom-0">
              {t('changeAnswer')}
              <UswdsReactLink
                to={{
                  pathname: `/models/${modelID}/collaboration-area/task-list/${needConfig?.route}`,
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { PlanOpsEvalAndLearning } from 'gql/generated/graphql';

import Tooltip from 'components/Tooltip';
import { TranslationOpsEvalAndLearning } from 'types/translation';

import ReadOnlySection, { NoAddtionalInfo } from '../ReadOnlySection';

const READ_ONLY_FIELDS = [
  'benchmarkForPerformance',
  'benchmarkForPerformanceNote',
  'computePerformanceScores',
  'computePerformanceScoresNote'
] as const;

const RISK_FIELDS = [
  'riskAdjustPerformance',
  'riskAdjustFeedback',
  'riskAdjustPayments',
  'riskAdjustOther'
] as const;

const APPEAL_FIELDS = [
  'appealPerformance',
  'appealFeedback',
  'appealPayments',
  'appealOther'
] as const;

type PerformanceConfigWithOptionsType =
  | (typeof RISK_FIELDS)[number]
  | (typeof APPEAL_FIELDS)[number];

type TranslationPerformanceConfigType = Pick<
  TranslationOpsEvalAndLearning,
  | PerformanceConfigWithOptionsType
  | (typeof READ_ONLY_FIELDS)[number]
  | 'riskAdjustNote'
  | 'appealNote'
>;

const PerformanceReadOnlySection = ({
  config,
  data,
  filteredView = false
}: {
  config: TranslationPerformanceConfigType;
  data: Partial<PlanOpsEvalAndLearning>;
  filteredView?: boolean;
}): React.ReactElement | null => {
  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );

  const riskHeaders = [
    {
      label: opsEvalAndLearningMiscT('riskGroupLabel')
    },
    { label: opsEvalAndLearningMiscT('yesNo') }
  ];

  const appealHeaders = [
    {
      label: opsEvalAndLearningMiscT('appealGroupLabel'),
      toolTip: opsEvalAndLearningMiscT('appealGroupLabelTooltip')
    },
    { label: opsEvalAndLearningMiscT('yesNo') }
  ];

  return (
    <div>
      <div className="margin-top-4 padding-top-4 border-top-1px border-base-light">
        {READ_ONLY_FIELDS.map(field => (
          <ReadOnlySection
            key={field}
            field={field}
            translations={config}
            values={data}
          />
        ))}
      </div>

      <TableSection
        headers={riskHeaders}
        fields={RISK_FIELDS}
        config={config}
        data={data}
        filteredView={filteredView}
      />

      {!filteredView && (
        <div>
          <ReadOnlySection
            field="riskAdjustNote"
            translations={config}
            values={data}
          />

          <TableSection
            headers={appealHeaders}
            fields={APPEAL_FIELDS}
            config={config}
            data={data}
          />

          <ReadOnlySection
            field="appealNote"
            translations={config}
            values={data}
          />
        </div>
      )}
    </div>
  );
};

export default PerformanceReadOnlySection;

const generateAnswerCell = (
  config: TranslationPerformanceConfigType,
  field: PerformanceConfigWithOptionsType,
  data: Partial<PlanOpsEvalAndLearning>
) => {
  if (data[field] === true) {
    return (
      <div className="display-flex flex-align-center">
        <Icon.CheckCircle
          className="text-success margin-right-1"
          aria-label="yes"
          size={3}
        />
        {config[field].options.true}
      </div>
    );
  }

  if (data[field] === false) {
    return (
      <div className="display-flex flex-align-center">
        <Icon.Cancel
          className="text-error margin-right-1"
          aria-label="no"
          size={3}
        />
        {config[field].options.false}
      </div>
    );
  }
  return <NoAddtionalInfo />;
};

const TableSection = ({
  headers,
  fields,
  config,
  data,
  filteredView
}: {
  headers: { label: string; toolTip?: string }[];
  fields: readonly PerformanceConfigWithOptionsType[];
  config: TranslationPerformanceConfigType;
  data: Partial<PlanOpsEvalAndLearning>;
  filteredView?: boolean;
}) => {
  return (
    <table
      className={classNames('margin-bottom-4 margin-top-neg-1', {
        'desktop:grid-col-12': !filteredView,
        'desktop:grid-col-6': filteredView
      })}
      style={{ borderCollapse: 'collapse' }}
    >
      <thead>
        <tr className="border-bottom-2px">
          {headers.map((header, index) => (
            <th
              key={header.label}
              scope="col"
              className={classNames(
                'padding-1 padding-left-0 text-left text-bold font-body-sm line-height-sans-4 margin-bottom-2',
                { 'grid-col-8': index === 0, 'grid-col-4': index === 1 }
              )}
            >
              {header.label}
              {header.toolTip && (
                <span className="top-2px position-relative text-normal">
                  <Tooltip
                    label={header.toolTip}
                    position="right"
                    className="margin-left-05"
                  >
                    <Icon.Info className="text-base-light" aria-label="info" />
                  </Tooltip>
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.map(field => (
          <tr key={field} className="border-bottom-1px">
            <td className="padding-y-2 padding-left-0 ">
              <p className="margin-0">{config[field]?.readonlyLabel}</p>
            </td>
            <td className="padding-y-2 padding-left-0">
              {generateAnswerCell(config, field, data)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

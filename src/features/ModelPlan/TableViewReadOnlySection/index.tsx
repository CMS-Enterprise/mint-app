import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';

import { TranslationOpsEvalAndLearning } from 'types/translation';

import ReadOnlySection, {
  NoAddtionalInfo
} from '../ReadOnly/_components/ReadOnlySection';
import { isEmpty } from '../ReadOnly/_components/ReadOnlySection/util';

const PerformanceReadOnlySection = ({
  config,
  data
}: {
  config: Partial<TranslationOpsEvalAndLearning>;
  data: any;
}): React.ReactElement | null => {
  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );

  const readOnlyFields = [
    'benchmarkForPerformance',
    'benchmarkForPerformanceNote',
    'computePerformanceScores',
    'computePerformanceScoresNote'
  ];

  const riskHeaders = [
    config.riskAdjustPerformance?.groupLabel || '',
    opsEvalAndLearningMiscT('yesNo')
  ];

  const riskFields: Array<keyof TranslationOpsEvalAndLearning> = [
    'riskAdjustPerformance',
    'riskAdjustFeedback',
    'riskAdjustPayments',
    'riskAdjustOther'
  ];

  const appealHeaders = [
    config.appealPerformance?.groupLabel || '',
    opsEvalAndLearningMiscT('yesNo')
  ];

  const appealFields: Array<keyof TranslationOpsEvalAndLearning> = [
    'appealPerformance',
    'appealFeedback',
    'appealPayments',
    'appealOther'
  ];

  // console.log('config is', config);
  // console.log('data is', data);

  return (
    <div>
      <div className="margin-top-4 padding-top-4 border-top-1px border-base-light">
        {readOnlyFields.map(field => (
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
        fields={riskFields}
        config={config}
        data={data}
      />

      <ReadOnlySection
        field="riskAdjustNote"
        translations={config}
        values={data}
      />

      <TableSection
        headers={appealHeaders}
        fields={appealFields}
        config={config}
        data={data}
      />

      <ReadOnlySection field="appealNote" translations={config} values={data} />
    </div>
  );
};

export default PerformanceReadOnlySection;

const TableSection = ({
  headers,
  fields,
  config,
  data
}: {
  headers: string[];
  fields: string[];
  config: Partial<TranslationOpsEvalAndLearning>;
  data: any;
}) => {
  return (
    <table className="desktop:grid-col-12 margin-bottom-2">
      <thead>
        <tr>
          {headers.map(header => (
            <th
              key={header}
              scope="col"
              className="grid-col-7 padding-1 padding-left-0 border-bottom-2px text-left text-bold font-body-sm line-height-sans-4 margin-bottom-2"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.map(field => (
          <tr key={field}>
            <td className="text-baseline padding-y-2 padding-left-0 border-bottom-1px">
              <p className="margin-0">{config[field]?.readonlyLabel}</p>
            </td>
            <td className="text-baseline padding-y-2 padding-left-0 border-bottom-1px">
              {isEmpty(data[field]) && <NoAddtionalInfo />}
              {!isEmpty(data[field]) && data[field] ? (
                <div className="display-flex flex-align-center">
                  <Icon.CheckCircle
                    className="text-success margin-right-1"
                    aria-label="yes"
                    size={3}
                  />
                  {config[field]?.options[data[field]]}
                </div>
              ) : (
                <div className="display-flex flex-align-center">
                  <Icon.Cancel
                    className="text-error  margin-right-1"
                    aria-label="no"
                    size={3}
                  />
                  {config[field]?.options[data[field]]}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

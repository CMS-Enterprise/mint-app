import React from 'react';
import { Trans } from 'react-i18next';
import { Table as TrussTable } from '@trussworks/react-uswds';

import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { tArray, tObject } from 'utils/translation';

type ContentTypes = {
  criteria: string;
  description: string;
  score: string;
};

const ModelSectionCriteriaTable = () => {
  const headers = tArray('twoPageMeeting:reviewMeeting.criteria.table.header');

  const content = tObject(
    'twoPageMeeting:reviewMeeting.criteria.table.content'
  ) as ContentTypes[];

  return (
    <TrussTable bordered={false} fullWidth fixed>
      <thead>
        <tr className="border-bottom-1px">
          {headers.map(k => (
            <th
              key={k}
              scope="col"
              className="padding-y-1 padding-left-0"
              style={{ minWidth: '170px' }}
            >
              <strong>{k}</strong>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((item: ContentTypes) => {
          return (
            <tr key={convertToLowercaseAndDashes(item.criteria)}>
              <th
                scope="row"
                className="text-baseline text-bold padding-left-0"
              >
                {item.criteria}
              </th>
              <td className="text-baseline padding-left-0">
                <Trans
                  i18nKey={item.description}
                  components={{
                    paragraph: <p className="margin-y-0" />,
                    ul: <ul className="margin-y-0 padding-left-3" />,
                    li: <li className="line-height-normal margin-bottom-05" />
                  }}
                />
              </td>
              <td className="text-baseline padding-left-0">
                <Trans
                  i18nKey={item.score}
                  components={{
                    bold: <p className="margin-y-0 text-bold" />
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </TrussTable>
  );
};

export default ModelSectionCriteriaTable;

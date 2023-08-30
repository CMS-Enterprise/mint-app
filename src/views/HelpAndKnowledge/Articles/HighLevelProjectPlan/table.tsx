import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table as TrussTable } from '@trussworks/react-uswds';

type TableItemType = {
  activity: string;
  party: string;
};

const Table = () => {
  const { t: tableT } = useTranslation('highLevelProjectPlans');

  const headers: string[] = tableT('accordionItems.table.header', {
    returnObjects: true
  });

  const modelOperationalPlanning: TableItemType[] = tableT(
    'accordionItems.table.cmmi-model-operational-planning',
    {
      returnObjects: true
    }
  );

  return (
    <TrussTable bordered={false} fullWidth fixed>
      <thead>
        <tr>
          {headers.map(k => (
            <th key={k} scope="col" className="padding-y-1">
              <strong>{k}</strong>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {modelOperationalPlanning.map(item => (
          <tr>
            <th scope="row" className="padding-y-1">
              {item.activity}
            </th>
            <td className="text-baseline">{item.party}</td>
          </tr>
        ))}
      </tbody>
    </TrussTable>
  );
};

export default Table;

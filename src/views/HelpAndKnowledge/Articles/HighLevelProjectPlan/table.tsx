import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Table as TrussTable } from '@trussworks/react-uswds';

type TableItemType = {
  activity: string;
  party: string;
};

type TableType = {
  content: string;
};

const Table = ({ content }: TableType) => {
  const { t: tableT } = useTranslation('highLevelProjectPlans');

  const headers: string[] = tableT('accordionItems.table.header', {
    returnObjects: true
  });

  const contentMap = (contentText: string): TableItemType[] => {
    switch (contentText) {
      case 'cmmi-model-operational-planning':
        return tableT('accordionItems.table.cmmi-model-operational-planning', {
          returnObjects: true
        });
      default:
        return [];
    }
  };

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
        {contentMap(content).map(item => {
          return (
            <tr>
              <th scope="row" className="padding-y-1">
                {item.activity.includes('<paragraph>') ||
                item.activity.includes('<italics>') ? (
                  <Trans
                    i18nKey={item.activity}
                    components={{
                      paragraph: <p className="margin-y-0" />,
                      italics: <i />
                    }}
                  />
                ) : (
                  item.activity
                )}
              </th>
              <td className="text-baseline">
                {item.party.includes('<paragraph>') ||
                item.party.includes('<italics>') ? (
                  <Trans
                    i18nKey={item.party}
                    components={{
                      paragraph: <p className="margin-y-0" />,
                      italics: <i />
                    }}
                  />
                ) : (
                  item.party
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TrussTable>
  );
};

export default Table;

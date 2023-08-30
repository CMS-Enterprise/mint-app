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

const TransOrPrint = ({ copy }: { copy: string }) => {
  return (
    <>
      {copy.includes('</') ? (
        <Trans
          i18nKey={copy}
          components={{
            paragraph: <p className="margin-y-0" />,
            italics: <i />,
            'pd-left': <div className="padding-left-2" />
          }}
        />
      ) : (
        copy
      )}
    </>
  );
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
      case 'cmmi-internal-clearance-process':
        return tableT('accordionItems.table.cmmi-internal-clearance-process', {
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
                <TransOrPrint copy={item.activity} />
              </th>
              <td className="text-baseline">
                <TransOrPrint copy={item.party} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </TrussTable>
  );
};

export default Table;

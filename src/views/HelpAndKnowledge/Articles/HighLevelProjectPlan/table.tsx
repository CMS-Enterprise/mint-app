import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Table as TrussTable } from '@trussworks/react-uswds';

import ExternalLink from 'components/shared/ExternalLink';

type TableItemType = {
  activity: string;
  link?: string;
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
      case 'clearance-of-documents':
        return tableT('accordionItems.table.clearance-of-documents', {
          returnObjects: true
        });
      case 'legal':
        return tableT('accordionItems.table.legal', {
          returnObjects: true
        });
      case 'participants':
        return tableT('accordionItems.table.participants', {
          returnObjects: true
        });
      case 'model-operations':
        return tableT('accordionItems.table.model-operations', {
          returnObjects: true
        });
      case 'payment':
        return tableT('accordionItems.table.payment', {
          returnObjects: true
        });
      case 'learning-&-diffusion':
        return tableT('accordionItems.table.learning-&-diffusion', {
          returnObjects: true
        });
      case 'evaluation':
        return tableT('accordionItems.table.evaluation', {
          returnObjects: true
        });
      default:
        return [];
    }
  };

  return (
    <TrussTable bordered={false} fullWidth fixed>
      <thead>
        <tr className="border-bottom-2px">
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
                {item.link && (
                  <div className="display-flex flex-align-center">
                    <ExternalLink href="https://share.cms.gov/center/cmmi/PP/DSEP/Lists/AnnouncementsAndRollouts/Tiles.aspx">
                      {tableT(item.link)}
                    </ExternalLink>
                  </div>
                )}
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

import React, { Fragment } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Table as TrussTable } from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';

type TableItemType = {
  activity: string;
  href?: string;
  link?: string;
  modalCategory?: string;
  modalLinks?: { copy: string; route: string }[];
  party?: string;
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

  const ModalLink = ({
    solutionRoute,
    children
  }: {
    solutionRoute: string;
    children: React.ReactNode;
  }) => {
    return (
      <UswdsReactLink
        className="usa-button usa-button--unstyled"
        to={`high-level-project-plan?solution=${solutionRoute}&section=about`}
      >
        {children}
      </UswdsReactLink>
    );
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
        {contentMap(content).map((item, contentMapIndex) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={contentMapIndex}>
              <th scope="row" className="padding-y-1">
                <TransOrPrint copy={item.activity} />
                {item.link && item.href && (
                  <div className="display-flex flex-align-center">
                    <ExternalLink href={item.href}>
                      {tableT(item.link)}
                    </ExternalLink>
                  </div>
                )}
              </th>
              <td className="text-baseline">
                {item.party && <TransOrPrint copy={item.party} />}
                {item.modalLinks &&
                  item.modalLinks.map((i, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Fragment key={index}>
                        <Trans
                          i18nKey={i.copy}
                          components={{
                            ml: (
                              <ModalLink solutionRoute={i.route}>
                                {i.copy}
                              </ModalLink>
                            )
                          }}
                        />
                        {item.modalLinks && index !== item.modalLinks.length - 1
                          ? ', '
                          : ''}
                      </Fragment>
                    );
                  })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TrussTable>
  );
};

export default Table;

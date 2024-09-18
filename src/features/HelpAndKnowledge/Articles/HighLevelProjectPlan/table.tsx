import React, { Fragment } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Table as TrussTable } from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import { tArray } from 'utils/translation';

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

  const headers = tArray('highLevelProjectPlans:accordionItems.table.header');

  const contentMap = (contentText: string): TableItemType[] => {
    switch (contentText) {
      case 'cmmi-model-operational-planning':
        return tArray(
          'highLevelProjectPlans:accordionItems.table.cmmi-model-operational-planning'
        );
      case 'cmmi-internal-clearance-process':
        return tArray(
          'highLevelProjectPlans:accordionItems.table.cmmi-internal-clearance-process'
        );
      case 'clearance-of-documents':
        return tArray(
          'highLevelProjectPlans:accordionItems.table.clearance-of-documents'
        );
      case 'legal':
        return tArray('highLevelProjectPlans:accordionItems.table.legal');
      case 'participants':
        return tArray(
          'highLevelProjectPlans:accordionItems.table.participants'
        );
      case 'model-operations':
        return tArray(
          'highLevelProjectPlans:accordionItems.table.model-operations'
        );
      case 'payment':
        return tArray('highLevelProjectPlans:accordionItems.table.payment');
      case 'learning-&-diffusion':
        return tArray(
          'highLevelProjectPlans:accordionItems.table.learning-&-diffusion'
        );
      case 'evaluation':
        return tArray('highLevelProjectPlans:accordionItems.table.evaluation');
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

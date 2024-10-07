import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';

import './index.scss';

export type EChimpCardProps = {
  id: string;
  title?: string | null;
  crStatus?: string | null;
  emergencyCrFlag?: boolean | null;
  implementationDate?: string | null;
  isInReadView?: boolean;
  issuedDate?: string | null;
  sensitiveFlag?: boolean | null;
};

const EChimpCard = ({
  id,
  title,
  crStatus,
  emergencyCrFlag,
  implementationDate,
  isInReadView,
  issuedDate,
  sensitiveFlag
}: EChimpCardProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  return (
    <Card
      gridLayout={{ desktop: { col: isInReadView ? 6 : 4 } }}
      className="echimp-card"
      containerProps={{ className: 'shadow-2' }}
    >
      <CardHeader className="echimp-card__header">
        <h4 className="text-base">{id}</h4>
        <h3 className="echimp-card__header">{title?.replace(/&amp;/g, '&')}</h3>
      </CardHeader>

      <CardBody>
        {(emergencyCrFlag || sensitiveFlag) && (
          <div className="echimp-card__cr-tags">
            {emergencyCrFlag && (
              <div
                className="echimp-card__cr-tag echimp-card__cr-tag--emergency"
                data-testid="emergency__cr-tag"
              >
                <Icon.LocalFireDepartment />
                {crtdlsT('echimpCard.crTag.emergency')}
              </div>
            )}
            {sensitiveFlag && (
              <div
                className="echimp-card__cr-tag echimp-card__cr-tag--sensitive"
                data-testid="sensitive__cr-tag"
              >
                <Icon.Flag />
                {crtdlsT('echimpCard.crTag.sensitive')}
              </div>
            )}
          </div>
        )}

        {crStatus && (
          <div className="echimp-card__cr-status">
            <p className="text-bold">{crtdlsT('echimpCard.crStatus')}</p>
            <p>{crStatus}</p>
          </div>
        )}
        <div className="echimp-card__date">
          {implementationDate && (
            <>
              <p className="text-bold">
                {crtdlsT('echimpCard.implementationDate')}
              </p>
              <p>{implementationDate}</p>
            </>
          )}
          {issuedDate && (
            <>
              <p className="text-bold">{crtdlsT('echimpCard.initiatedDate')}</p>
              {/* Currently issuedDate returns '2024-07-24 00:00:00' */}
              <p>{issuedDate?.split(' ')[0]}</p>
            </>
          )}
        </div>
      </CardBody>

      <CardFooter>
        <Button type="button" className="usa-button">
          {crtdlsT('echimpCard.viewMore')}
        </Button>
        <ExternalLink
          href={import.meta.env.VITE_ECHIMP_URL}
          className="margin-right-0"
          toEchimp
        >
          {crtdlsT('echimpCard.viewThisInECHIMP')}
        </ExternalLink>
      </CardFooter>
    </Card>
  );
};

export default EChimpCard;

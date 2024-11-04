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
import { useFlags } from 'launchdarkly-react-client-sdk';

import ExternalLink from 'components/ExternalLink';

import './index.scss';

export type EChimpCardProps = {
  id: string;
  title?: string | null;
  crStatus?: string | null;
  status?: string | null;
  emergencyCrFlag?: boolean | null;
  implementationDate?: string | null;
  isInReadView?: boolean;
  issuedDate?: string | null;
  sensitiveFlag?: boolean | null;
  setShowCRorTDLWithId: (id: string) => void;
  setIsSidepanelOpen: (isOpen: boolean) => void;
};

const EChimpCard = ({
  id,
  title,
  crStatus,
  status,
  emergencyCrFlag,
  implementationDate,
  isInReadView,
  issuedDate,
  sensitiveFlag,
  setShowCRorTDLWithId,
  setIsSidepanelOpen
}: EChimpCardProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const flags = useFlags();

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
        {status && (
          <div className="echimp-card__cr-status">
            <p className="text-bold">{crtdlsT('echimpCard.tdlStatus')}</p>
            <p>{status}</p>
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
              <p className="text-bold">{crtdlsT('echimpCard.issuedDate')}</p>
              {/* Currently issuedDate returns '2024-07-24 00:00:00' */}
              <p>{issuedDate?.split(' ')[0]}</p>
            </>
          )}
        </div>
      </CardBody>

      <CardFooter>
        <Button
          type="button"
          className="usa-button"
          onClick={() => {
            setShowCRorTDLWithId(id);
            setIsSidepanelOpen(true);
          }}
        >
          {crtdlsT('echimpCard.viewMore')}
        </Button>
        {flags.echimpEnabled && (
          <ExternalLink
            href={`${import.meta.env.VITE_ECHIMP_URL}?sysSelect=${id.slice(0, 3)}&crNum=${id}`}
            className="margin-right-0"
            toEchimp
          >
            {crtdlsT('echimpCard.viewThisInECHIMP')}
          </ExternalLink>
        )}
      </CardFooter>
    </Card>
  );
};

export default EChimpCard;

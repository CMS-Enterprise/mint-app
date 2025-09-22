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
import { ECHIMP_URL_SSO } from 'constants/echimp';

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
  isCR: boolean;
};

// Configures the URL for the ECHIMP page based on the type and id
export const echimpUrl = (type?: 'ffs' | 'tdl', id?: string) => {
  if (type === 'ffs') {
    return id
      ? `${import.meta.env.VITE_ECHIMP_URL}/ffs-ui/${id}/cr-summary`
      : ECHIMP_URL_SSO;
  }
  if (type === 'tdl') {
    return id ? `${ECHIMP_URL_SSO}?sysSelect=TDL&crNum=${id}` : ECHIMP_URL_SSO;
  }
  return ECHIMP_URL_SSO;
};

export const DataOrNoData = ({ data }: { data: string | null | undefined }) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');
  if (!data) {
    return (
      <p className="text-base text-italic">{crtdlsT('echimpCard.noData')}</p>
    );
  }
  return <p>{data}</p>;
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
  setIsSidepanelOpen,
  isCR
}: EChimpCardProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const flags = useFlags();

  // If the flag is enabled, use the echimp url from the flags
  const echimpURL = flags?.echimpFFSURLEnabled
    ? echimpUrl(isCR ? 'ffs' : 'tdl', id)
    : `${ECHIMP_URL_SSO}?sysSelect=${isCR ? 'FFS' : 'TDL'}&crNum=${id}`;

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
                <Icon.LocalFireDepartment aria-label="fire department" />
                {crtdlsT('echimpCard.crTag.emergency')}
              </div>
            )}
            {sensitiveFlag && (
              <div
                className="echimp-card__cr-tag echimp-card__cr-tag--sensitive"
                data-testid="sensitive__cr-tag"
              >
                <Icon.Flag aria-label="flag" />
                {crtdlsT('echimpCard.crTag.sensitive')}
              </div>
            )}
          </div>
        )}

        <div className="echimp-card__status">
          <p className="text-bold">
            {isCR
              ? crtdlsT('echimpCard.crStatus')
              : crtdlsT('echimpCard.tdlStatus')}
          </p>
          <DataOrNoData data={crStatus ?? status} />
        </div>
        <div className="echimp-card__date">
          <p className="text-bold">
            {isCR
              ? crtdlsT('echimpCard.implementationDate')
              : crtdlsT('echimpCard.issuedDate')}
          </p>
          {/* At the time of writing, issuedDate returns '2024-07-24 00:00:00' */}
          <DataOrNoData
            data={implementationDate ?? issuedDate?.split(' ')[0]}
          />
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
        <ExternalLink href={echimpURL} className="margin-right-0" toEchimp>
          {crtdlsT('echimpCard.viewThisInECHIMP')}
        </ExternalLink>
      </CardFooter>
    </Card>
  );
};

export default EChimpCard;

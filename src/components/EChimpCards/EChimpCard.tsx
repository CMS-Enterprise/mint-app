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

const EChimpCard = () => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  return (
    <Card gridLayout={{ desktop: { col: 4 } }} className="echimp-card">
      <CardHeader className="echimp-card__header">
        <h4 className="text-base">FFS3550</h4>
        <h3 className="echimp-card__header">
          CR for minor updates (sensitive and controversial)
        </h3>
      </CardHeader>

      <CardBody>
        <div className="echimp-card__cr-tags">
          <div className="echimp-card__cr-tag echimp-card__cr-tag--emergency">
            <Icon.LocalFireDepartment />
            {crtdlsT('echimpCard.crTag.emergency')}
          </div>
          <div className="echimp-card__cr-tag echimp-card__cr-tag--sensitive">
            <Icon.Flag />
            {crtdlsT('echimpCard.crTag.sensitive')}
          </div>
        </div>

        <div className="echimp-card__cr-status">
          <p className="text-bold">{crtdlsT('echimpCard.crStatus')}</p>
          <p>Final issued</p>
        </div>
        <div className="echimp-card__implementation-date">
          <p className="text-bold">
            {crtdlsT('echimpCard.implementationDate')}
          </p>
          <p>04/01/2024</p>
        </div>
      </CardBody>

      <CardFooter>
        <Button type="button" className="usa-button">
          {crtdlsT('echimpCard.viewMore')}
        </Button>
        <ExternalLink href="https://echimp.cmsnet/" className="margin-right-0">
          {crtdlsT('echimpCard.viewThisInECHIMP')}
        </ExternalLink>
      </CardFooter>
    </Card>
  );
};

export default EChimpCard;

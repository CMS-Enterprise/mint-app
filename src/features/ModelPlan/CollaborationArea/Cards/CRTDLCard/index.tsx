import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { GetModelPlanQuery } from 'gql/generated/graphql';

import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';

import '../../index.scss';

export type CRTDLType = GetModelPlanQuery['modelPlan']['echimpCRsAndTDLs'][0];

type CRTDLCardType = {
  crtdls: CRTDLType[];
  modelID: string;
};

const CRTDLCard = ({ crtdls = [], modelID }: CRTDLCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const firstFiveCRTDLs = crtdls.slice(0, 5);

  const remainingCRTDLs: number = crtdls.length - firstFiveCRTDLs.length;

  return (
    <Card
      gridLayout={{ mobile: { col: 12 }, desktop: { col: 4 } }}
      className="collaboration-area__card"
    >
      <CardHeader>
        <h3 className="usa-card__heading">
          {collaborationAreaT('crtdlsCard.heading')}
        </h3>
      </CardHeader>

      <CardBody>
        {crtdls?.length === 0 ? (
          <p className="text-base">
            {collaborationAreaT('crtdlsCard.noCrtdls')}
          </p>
        ) : (
          <p className="text-base-dark">
            {firstFiveCRTDLs.map(crtdl => crtdl.id).join(', ')}
            {remainingCRTDLs > 0 && (
              <>
                {' '}
                {collaborationAreaT('crtdlsCard.andMore', {
                  count: remainingCRTDLs
                })}
              </>
            )}
          </p>
        )}
      </CardBody>

      <CardFooter>
        <ExternalLink
          href={import.meta.env.VITE_ECHIMP_URL}
          className="usa-button"
          variant="unstyled"
          asButton
          toEchimp
        >
          {collaborationAreaT('crtdlsCard.addInEChimp')}
        </ExternalLink>

        {crtdls?.length !== 0 && (
          <UswdsReactLink
            className="usa-button usa-button--outline"
            variant="unstyled"
            to={`/models/${modelID}/collaboration-area/cr-and-tdl`}
          >
            {collaborationAreaT('crtdlsCard.viewAll')}
          </UswdsReactLink>
        )}
      </CardFooter>
    </Card>
  );
};

export default CRTDLCard;

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { GetModelPlanQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

type DocumentType = GetModelPlanQuery['modelPlan']['documents'][0];

type DocumentsCardType = {
  documents: DocumentType[];
  modelID: string;
};

const DocumentsCard = ({ documents, modelID }: DocumentsCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  // console.log(documents);

  return (
    <Card gridLayout={{ desktop: { col: 4 } }} className="card--documents">
      <CardHeader>
        <h3 className="usa-card__heading">
          {collaborationAreaT('documentsCard.heading')}
        </h3>
      </CardHeader>
      <CardBody>
        {documents?.length === 0 ? (
          <p>{collaborationAreaT('documentsCard.noDocuments')}</p>
        ) : (
          <p>{collaborationAreaT('documentsCard.viewAll')}</p>
        )}
      </CardBody>
      <CardFooter>
        <UswdsReactLink
          to={`/models/${modelID}/collaboration-area/documents/add-document`}
          className="usa-button"
          variant="unstyled"
          data-testid="to-task-list"
        >
          {collaborationAreaT('documentsCard.addDocument')}
        </UswdsReactLink>
        {documents?.length !== 0 && (
          <UswdsReactLink
            className="usa-button usa-button--outline"
            variant="unstyled"
            to={`/models/${modelID}/collaboration-area/documents`}
          >
            {collaborationAreaT('documentsCard.viewAll')}
          </UswdsReactLink>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentsCard;

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import { GetModelPlanQuery } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';

// importing global card styles from collaborationArea/index.scss
import '../../index.scss';
import './index.scss';

type DocumentType = GetModelPlanQuery['modelPlan']['documents'][0];

type DocumentsCardType = {
  documents: DocumentType[];
  modelID: string;
};

const DocumentsCard = ({ documents, modelID }: DocumentsCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  // Links have a fileType of 'externalLink'
  const linksArray = documents?.filter(doc => doc.fileType === 'externalLink');

  // Everything else is an uploaded document
  const uploadedDocArray = documents?.filter(
    doc => doc.fileType !== 'externalLink'
  );

  return (
    <Card
      gridLayout={{ mobile: { col: 12 }, desktop: { col: 4 } }}
      className="collaboration-area__card card--documents"
    >
      <CardHeader>
        <h3 className="usa-card__heading">
          {collaborationAreaT('documentsCard.heading')}
        </h3>
      </CardHeader>
      <CardBody>
        {documents?.length === 0 ? (
          <p>{collaborationAreaT('documentsCard.noDocuments')}</p>
        ) : (
          <>
            {uploadedDocArray?.length !== 0 && (
              <div className="display-flex flex-align-center">
                <Icon.UploadFile
                  size={3}
                  className="margin-right-1"
                  aria-label="forwuploadard"
                />
                {collaborationAreaT('documentsCard.uploaded', {
                  count: uploadedDocArray?.length
                })}
              </div>
            )}
            {linksArray?.length !== 0 && (
              <div className="display-flex flex-align-center">
                <Icon.Link
                  size={3}
                  className="margin-right-1"
                  aria-label="link"
                />
                {collaborationAreaT('documentsCard.linkAdded', {
                  count: linksArray?.length
                })}
              </div>
            )}
          </>
        )}
      </CardBody>
      <CardFooter>
        <UswdsReactLink
          to={{
            pathname: `/models/${modelID}/collaboration-area/documents/add-document`,
            state: { fromCollaborationArea: true }
          }}
          className="usa-button"
          variant="unstyled"
          data-testid="to-add-document"
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

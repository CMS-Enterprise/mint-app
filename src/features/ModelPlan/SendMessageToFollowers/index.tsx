import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';
import {
  useGetModelPlanBaseQuery,
  useSendModelFollowerUpdateMutation
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import HelpText from 'components/HelpText';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RichTextEditor from 'components/RichTextEditor';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';

const SendMessageToFollowers = () => {
  const { t } = useTranslation('collaborationArea');
  const { modelID = '' } = useParams<{ modelID: string }>();
  const navigate = useNavigate();
  const { setErrorMeta } = useErrorMessage();

  const { data } = useGetModelPlanBaseQuery({ variables: { id: modelID } });
  const modelName = data?.modelPlan.modelName ?? '';

  const [sendUpdate] = useSendModelFollowerUpdateMutation();

  const [content, setContent] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  const collaborationAreaPath = `/models/${modelID}/collaboration-area`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmpty) return;

    // the global error link shows this copy in an error toast if the mutation fails
    setErrorMeta({ overrideMessage: t('sendMessageToFollowers.error') });

    sendUpdate({ variables: { modelPlanID: modelID, content } })
      .then(response => {
        if (!response?.errors) {
          toastSuccess(t('sendMessageToFollowers.success', { modelName }));
          navigate(collaborationAreaPath);
        }
      })
      .catch(() => {
        // the error toast is shown by the global error link
      });
  };

  const returnLink = (
    <Button
      type="button"
      className="usa-button usa-button--unstyled display-inline-flex flex-align-center"
      onClick={() => navigate(collaborationAreaPath)}
    >
      <Icon.ArrowBack aria-hidden />
      {t('sendMessageToFollowers.returnCta')}
    </Button>
  );

  return (
    <MainContent data-testid="send-message-to-followers">
      <GridContainer>
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA
          ]}
          customItem={t('sendMessageToFollowers.breadcrumb')}
        />

        <Grid desktop={{ col: 12 }}>
          <PageHeading className="margin-top-4 margin-bottom-0">
            {t('sendMessageToFollowers.heading')}
          </PageHeading>

          <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-2">
            {t('sendMessageToFollowers.description')}
          </p>

          {returnLink}

          <p className="text-base margin-top-5 margin-bottom-3">
            <Trans
              t={t}
              i18nKey="sendMessageToFollowers.requiredFields"
              components={{ s: <span className="text-error" /> }}
            />
          </p>
        </Grid>
        <Grid desktop={{ col: 8 }}>
          <Form
            className="maxw-none"
            onSubmit={handleSubmit}
            data-testid="send-message-to-followers-form"
          >
            <FormGroup className="margin-top-0">
              <Label
                id="follower-message-label"
                htmlFor="follower-message"
                className="text-bold"
                requiredMarker
              >
                {t('sendMessageToFollowers.messageLabel')}
              </Label>

              <HelpText id="follower-message-help-text">
                {t('sendMessageToFollowers.messageHelpText')}
              </HelpText>

              <RichTextEditor
                id="follower-message"
                ariaLabelledBy="follower-message-label"
                ariaDescribedBy="follower-message-help-text"
                className="margin-top-1"
                onChange={(html, empty) => {
                  setContent(html);
                  setIsEmpty(empty);
                }}
              />
            </FormGroup>

            <Button
              type="submit"
              className="margin-top-6 margin-bottom-2"
              disabled={isEmpty}
            >
              {t('sendMessageToFollowers.sendMessage')}
            </Button>
          </Form>

          <div className="margin-bottom-6">{returnLink}</div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default SendMessageToFollowers;

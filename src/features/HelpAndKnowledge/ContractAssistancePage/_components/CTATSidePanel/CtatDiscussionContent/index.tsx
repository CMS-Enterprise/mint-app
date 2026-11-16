import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Form, FormGroup, Label } from '@trussworks/react-uswds';
import {
  CtatDiscussionPoster,
  GetCtatDiscussionsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { AvatarCircle } from 'components/Avatar';
import HelpText from 'components/HelpText';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';
import TextAreaField from 'components/TextAreaField';

import { formatDiscussionRelativeDate } from '../../../utils';

import './index.scss';

type CtatDiscussionContentProps = {
  ticketNumber: string;
  discussions: GetCtatDiscussionsQuery['discussions'];
  discussionsLoading: boolean;
  discussionsError?: Error;
  isClosed: boolean;
  onSaveMessage: (content: string) => Promise<void>;
  onCancelMessage: () => void;
};

type MessageFormValues = {
  content: string;
};

const CtatDiscussionContent = ({
  ticketNumber,
  discussions,
  discussionsLoading,
  discussionsError,
  isClosed,
  onSaveMessage,
  onCancelMessage
}: CtatDiscussionContentProps) => {
  const { t } = useTranslation('contractAssistanceMisc');
  const [showEarlierMessages, setShowEarlierMessages] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting }
  } = useForm<MessageFormValues>({
    defaultValues: { content: '' },
    mode: 'onChange'
  });
  const discussionLabel = t('ctatViewPanel.discussionHeading');
  const messageCount = discussions.length;
  // The discussion query returns newest first, including a stable ID tie break.
  const chronologicalDiscussions = [...discussions].reverse();
  const visibleDiscussions = showEarlierMessages
    ? chronologicalDiscussions
    : chronologicalDiscussions.slice(-2);

  const submitMessage = handleSubmit(async ({ content }) => {
    setSaveError(false);
    try {
      await onSaveMessage(content.trim());
      reset();
    } catch {
      setSaveError(true);
    }
  });

  return (
    <div className="margin-top-8 padding-8 maxw-tablet">
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-2">
        {discussionLabel}
      </PageHeading>
      <p className="font-body-md text-base-dark margin-top-0 margin-bottom-4">
        {t('ctatDiscussionPanel.ticketNumber', { ticketNumber })}
      </p>
      {discussionsLoading && (
        <Spinner aria-label={t('ctatViewPanel.discussionLoading')} />
      )}
      {!discussionsLoading && discussionsError && (
        <p className="margin-top-0" role="alert">
          {t('ctatViewPanel.discussionError')}
        </p>
      )}
      {!discussionsLoading &&
        !discussionsError &&
        (messageCount > 0 ? (
          <>
            <p className="text-bold margin-top-0 margin-bottom-1">
              {t('ctatViewPanel.discussionMessageCount', {
                count: messageCount
              })}
            </p>
            {messageCount > 2 && (
              <div className="margin-bottom-4">
                <p className="text-base margin-y-0">
                  {t(
                    showEarlierMessages
                      ? 'ctatDiscussionPanel.showingAllMessages'
                      : 'ctatDiscussionPanel.showingRecentMessages'
                  )}
                </p>
                <Button
                  type="button"
                  unstyled
                  aria-expanded={showEarlierMessages}
                  aria-controls="ctat-discussion-messages"
                  onClick={() => setShowEarlierMessages(!showEarlierMessages)}
                >
                  {t(
                    showEarlierMessages
                      ? 'ctatDiscussionPanel.hideEarlierMessages'
                      : 'ctatDiscussionPanel.showEarlierMessages'
                  )}
                </Button>
              </div>
            )}
            <div id="ctat-discussion-messages">
              {visibleDiscussions.map(discussion => {
                const { givenName, familyName } =
                  discussion.createdByUserAccount;
                const fullName = `${givenName} ${familyName}`.trim();
                const avatarName = `${givenName.split(' ')[0]} ${familyName.split(' ')[0]}`;

                return (
                  <article
                    key={discussion.id}
                    className="mint-ctat-discussion-message"
                  >
                    <div className="mint-ctat-discussion-message__timeline">
                      <AvatarCircle user={avatarName} />
                      <span
                        className="mint-ctat-discussion-message__connector"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mint-ctat-discussion-message__body">
                      <div className="display-flex flex-justify flex-align-start">
                        <div>
                          <p className="margin-y-0">{fullName}</p>
                          <p className="text-base margin-y-0">
                            {t(
                              discussion.posterRole ===
                                CtatDiscussionPoster.ADMIN
                                ? 'ctatDiscussionPanel.adminRole'
                                : 'ctatDiscussionPanel.requesterRole'
                            )}
                          </p>
                        </div>
                        <span className="text-base margin-left-2 text-no-wrap">
                          {formatDiscussionRelativeDate(
                            discussion.createdDts
                          ).replace(/^Today at /, 'Today, ')}
                        </span>
                      </div>
                      <p className="margin-top-2 margin-bottom-0">
                        {discussion.content}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <Alert type="info" slim className="margin-top-0 margin-bottom-4">
            {t('ctatDiscussionPanel.empty')}
          </Alert>
        ))}
      {!isClosed && (
        <Form
          onSubmit={submitMessage}
          className="maxw-none margin-top-5"
          aria-labelledby="ctat-add-message-heading"
        >
          <h3
            id="ctat-add-message-heading"
            className="font-heading-xl margin-top-0 margin-bottom-1"
          >
            {t('ctatDiscussionPanel.addMessage')}
          </h3>
          <p className="margin-top-0 margin-bottom-4 text-base-darkest">
            <Trans
              i18nKey="contractAssistanceMisc:ctatDiscussionPanel.requiredFields"
              components={{ s: <span className="text-red" /> }}
            />
          </p>
          <FormGroup className="margin-top-0 margin-bottom-1">
            <Label
              id="label-ctat-discussion-message"
              htmlFor="ctat-discussion-message"
              className="maxw-none text-normal"
              requiredMarker
            >
              {t('ctatDiscussionPanel.messageLabel')}
            </Label>
            <HelpText
              id="hint-ctat-discussion-message"
              className="margin-top-05"
            >
              {t('ctatDiscussionPanel.messageHint')}
            </HelpText>
            <Controller
              name="content"
              control={control}
              rules={{ validate: value => value.trim().length > 0 }}
              render={({ field: { ref, ...field } }) => (
                <TextAreaField
                  {...field}
                  inputRef={ref}
                  id="ctat-discussion-message"
                  value={field.value || ''}
                  className="height-card maxw-none"
                  disabled={isSubmitting}
                  required
                />
              )}
            />
          </FormGroup>
          {saveError && (
            <p role="alert" className="text-red">
              {t('ctatDiscussionPanel.saveMessageError')}
            </p>
          )}
          <Button
            type="button"
            outline
            className="margin-right-3"
            disabled={isSubmitting}
            onClick={() => {
              reset();
              setSaveError(false);
              onCancelMessage();
            }}
          >
            {t('ctatDiscussionPanel.cancelMessage')}
          </Button>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {t('ctatDiscussionPanel.saveMessage')}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default CtatDiscussionContent;

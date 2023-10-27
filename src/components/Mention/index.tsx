import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import Mention from '@tiptap/extension-mention';
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import Alert from 'components/shared/Alert';
import SearchOktaUsers from 'queries/SearchOktaUsers';
import { SearchOktaUsers as SearchOktaUsersType } from 'queries/types/SearchOktaUsers';

import suggestion from './suggestion';
import { formatedSolutionMentions, getMentions } from './util';

import './style.scss';

const MentionComponent = ({ node }: { node: any }) => {
  const { label } = node.attrs;

  return (
    <NodeViewWrapper className="react-component display-inline">
      <span className="tiptap mention">{`@${label}`}</span>
    </NodeViewWrapper>
  );
};

const CustomMention = (history: RouteComponentProps['history']) => {
  return Mention.extend({
    atom: true,
    selectable: true,
    addAttributes() {
      return {
        ...this.parent?.(),
        'data-id-db': {
          default: ''
        },
        email: {
          default: ''
        }
      };
    },
    addNodeView() {
      return ReactNodeViewRenderer(MentionComponent);
    }
  });
};

export default ({
  setFieldValue,
  editable,
  disabled,
  initialContent,
  className
}: {
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  editable?: boolean;
  disabled?: boolean;
  initialContent?: any;
  className?: string;
}) => {
  const { t } = useTranslation('discussions');

  const history = useHistory();

  const [tagAlert, setTagAlert] = useState<boolean>(false);

  const [getUsersLazyQuery] = useLazyQuery<SearchOktaUsersType>(
    SearchOktaUsers
  );

  const fetchUsers = ({ query }: { query: string }) => {
    if (!query) return formatedSolutionMentions();
    return getUsersLazyQuery({
      variables: { searchTerm: query }
    }).then(res =>
      sortBy(
        (
          res?.data?.searchOktaUsers?.map(user => {
            return {
              username: user.username,
              displayName: `${user.displayName} (${user.username})`,
              email: user.email
            };
          }) || []
        ).concat(formatedSolutionMentions(query)),
        'displayName'
      )
    );
  };

  const asyncSuggestions = {
    ...suggestion,
    items: fetchUsers
  };

  const editor = useEditor(
    {
      editable: editable && !disabled,
      extensions: [
        StarterKit,
        CustomMention(history).configure({
          HTMLAttributes: {
            class: 'mention'
          },
          suggestion: asyncSuggestions
        })
      ],
      onUpdate: ({ editor: input }: any) => {
        if (setFieldValue) {
          setFieldValue('content', input?.getHTML());
        }
      },
      onSelectionUpdate: ({ editor: input }: any) => {
        setTagAlert(!!getMentions(input?.getJSON()).length);
      },
      content: initialContent
    },
    [initialContent, disabled]
  );

  return (
    <>
      <EditorContent
        editor={editor}
        id="tip-editor"
        className={classNames(className, {
          readonly: !editable,
          editable
        })}
      />
      {tagAlert && editable && (
        <Alert type="info" slim>
          {t('tagAlert')}
        </Alert>
      )}
    </>
  );
};

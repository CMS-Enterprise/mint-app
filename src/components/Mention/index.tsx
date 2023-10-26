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

import Alert from 'components/shared/Alert';
import SearchOktaUsers from 'queries/SearchOktaUsers';
import { SearchOktaUsers as SearchOktaUsersType } from 'queries/types/SearchOktaUsers';

import suggestion from './suggestion';

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

// Possible Util to extract only mentions from content

const getMentions = (data: any) => {
  const mentions: any = [];

  data?.content?.forEach((para: any) => {
    para?.content?.forEach((content: any) => {
      if (content?.type === 'mention') {
        mentions.push(content?.attrs);
      }
    });
  });

  return mentions;
};

export default ({
  setFieldValue,
  editable,
  initialContent,
  className
}: {
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  editable?: boolean;
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
    return getUsersLazyQuery({
      variables: { searchTerm: query }
    }).then(
      res =>
        res?.data?.searchOktaUsers?.map(user => {
          return {
            username: user.username,
            displayName: `${user.displayName} (${user.username})`,
            email: user.email
          };
        }) || []
    );
  };

  const asyncSuggestions = {
    ...suggestion,
    items: fetchUsers
  };

  const editor = useEditor(
    {
      editable,
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
    [initialContent]
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

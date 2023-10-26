import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';

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
  const history = useHistory();

  const limit = 1000;

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
        CharacterCount.configure({
          limit
        }),
        CustomMention(history).configure({
          HTMLAttributes: {
            class: 'mention',
            'aria-label': 'User mentioned'
          },
          suggestion: asyncSuggestions
        })
      ],
      onUpdate: ({ editor: input }) => {
        if (setFieldValue) {
          setFieldValue('content', input?.getHTML());
        }
      },
      content: initialContent
    },
    [initialContent]
  );

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div>
      <EditorContent
        editor={editor}
        id="tip-editor"
        className={classNames(className, {
          readonly: !editable,
          editable
        })}
      />
      {editor && editable && (
        <div
          className={`character-count ${
            editor.storage.characterCount.characters() === limit
              ? 'character-count--warning'
              : ''
          }`}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            className="character-count__graph"
          >
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>

          <div className="character-count__text">
            {editor.storage.characterCount.characters()}/{limit} characters
          </div>
        </div>
      )}
    </div>
  );
};

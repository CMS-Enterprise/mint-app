import React from 'react';
import { useLazyQuery } from '@apollo/client';
import CharacterCount from '@tiptap/extension-character-count';
import Document from '@tiptap/extension-document';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';

import SearchOktaUsers from 'queries/SearchOktaUsers';
import { SearchOktaUsers as SearchOktaUsersType } from 'queries/types/SearchOktaUsers';

import suggestion from './suggestion';

import './style.scss';

export default () => {
  const limit = 280;

  const [getUsersLazyQuery] = useLazyQuery<SearchOktaUsersType>(
    SearchOktaUsers
  );

  const fetchUsers = ({ query }: { query: string }) => {
    return getUsersLazyQuery({
      variables: { searchTerm: query }
    }).then(
      res => res?.data?.searchOktaUsers?.map(user => user.displayName) || []
    );
  };

  const asyncSuggestions = {
    ...suggestion,
    items: fetchUsers
  };

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      CharacterCount.configure({
        limit
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        },
        suggestion: asyncSuggestions
      })
    ]
  });

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div className="margin-top-1">
      <EditorContent editor={editor} />
      {editor && (
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

import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import { EditorContent, mergeAttributes, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import SearchOktaUsers from 'queries/SearchOktaUsers';
import { SearchOktaUsers as SearchOktaUsersType } from 'queries/types/SearchOktaUsers';

import suggestion from './suggestion';

import './style.scss';

const CustomMention = (history: RouteComponentProps['history']) => {
  return Mention.extend({
    atom: true,
    selectable: true,
    addAttributes() {
      return {
        ...this.parent?.(),
        'data-id-db': {
          default: ''
        }
      };
    },
    renderHTML({ HTMLAttributes }) {
      const elem = document.createElement('button');

      Object.entries(
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
      ).forEach(([attr, val]) => elem.setAttribute(attr, val));

      elem.addEventListener('click', e => {
        // TODO: Add event handler here
        // If event target not an HTMLButtonElement, exit
        if (!(e.target instanceof HTMLButtonElement)) {
          return;
        }

        // Data from mention stored here
        const mentionData = e.target?.dataset;
        console.log(mentionData);
        // ex: history.push(mentionData.userAccountRoute);
      });

      elem.textContent = `@${HTMLAttributes['data-label']}`;

      return elem;
    }
  });
};

// // Possible Util to extract only mentions from content
//
// const getMentions = (data: any) => {
//   const mentions: any = [];
//   data?.content?.forEach((para: any) => {
//     para?.content?.forEach((content: any) => {
//       if (content?.type === 'mention') {
//         mentions.push(content?.attrs);
//       }
//     });
//   });
//   return mentions;
// };

const getContent = (editorData: any) => {
  const data = { ...editorData };
  const text: any = [];
  data?.content?.forEach((para: any) => {
    para?.content?.forEach((content: any) => {
      if (content?.type === 'text') {
        text.push(content?.text);
      } else if (content?.type === 'mention') {
        text.push(`@${content?.attrs?.label}`);
      }
    });
  });
  return text.join(' ');
};

export default ({ setFieldValue }: any) => {
  const history = useHistory();

  const limit = 280;

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
            displayName: `${user.displayName} (${user.username})`
          };
        }) || []
    );
  };

  const asyncSuggestions = {
    ...suggestion,
    items: fetchUsers
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit
      }),
      CustomMention(history).configure({
        HTMLAttributes: {
          class: 'mention',
          type: 'button',
          'aria-label': 'User mentioned'
        },
        suggestion: asyncSuggestions
      })
    ],
    onUpdate: ({ editor: input }) => {
      const fieldValue = getContent(input?.getJSON());
      setFieldValue('content', fieldValue);
    }
  });

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div className="margin-top-1">
      <EditorContent editor={editor} id="tip-editor" />
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

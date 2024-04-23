import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Mention from '@tiptap/extension-mention';
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import { TagType, useSearchOktaUsersLazyQuery } from 'gql/gen/graphql';
import { sortBy } from 'lodash';

import Alert from 'components/shared/Alert';

import suggestion from './suggestion';
import { formatedSolutionMentions, getMentions } from './util';

import './index.scss';

/* The rendered Mention after selected from MentionList
This component can be any react jsx component, but must be wrapped in <NodeViewWrapper />
Attrs of selected mention are accessed through node prop */
const MentionComponent = ({ node }: { node: any }) => {
  const { label } = node.attrs;

  // Label may return null if the text was truncated by <TruncatedText />
  // In this case don't render the mention, and shift the line up by the height of the non-rendered label
  if (!label) {
    return <div className="margin-top-neg-4" />;
  }

  return (
    <NodeViewWrapper className="react-component display-inline">
      <span className="tiptap mention">{`@${label}`}</span>
    </NodeViewWrapper>
  );
};

/* Extended TipTap Mention class with additional attributes
Additionally sets a addNodeView to render custo JSX as mention */
const CustomMention = Mention.extend({
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-id-db': {
        default: ''
      },
      'tag-type': {
        default: ''
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(MentionComponent);
  }
});

const MentionTextArea = ({
  id,
  setFieldValue,
  editable,
  disabled,
  initialContent,
  className
}: {
  id: string;
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
  const { t } = useTranslation('discussionsMisc');

  const [tagAlert, setTagAlert] = useState<boolean>(false);

  const [getUsersLazyQuery] = useSearchOktaUsersLazyQuery();

  const fetchUsers = ({ query }: { query: string }) => {
    // If "@" trigger is typed without a following query, return on the solution contacts
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
              tagType: TagType.USER_ACCOUNT
            };
          }) || []
        ).concat(formatedSolutionMentions(query)),
        'displayName'
      )
    );
  };

  const editor = useEditor(
    {
      editable: editable && !disabled,
      editorProps: {
        attributes: {
          id
        }
      },
      extensions: [
        StarterKit,
        CustomMention.configure({
          HTMLAttributes: {
            class: 'mention'
          },
          suggestion: {
            ...suggestion,
            items: fetchUsers
          }
        })
      ],
      onUpdate: ({ editor: input }: any) => {
        // Uses the form setter prop (Formik) for mutation input
        if (setFieldValue) {
          setFieldValue('content', input?.getHTML());
        }
      },
      // Sets a alert of a mention is selected, and users/teams will be emailed
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
        id={id}
        className={classNames(className, {
          tiptap__readonly: !editable,
          tiptap__editable: editable
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

export default MentionTextArea;

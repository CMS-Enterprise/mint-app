import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type RichTextEditorProps = {
  id: string;
  onChange: (html: string, isEmpty: boolean) => void;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
};

type ToolbarButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const ToolbarButton = ({
  label,
  isActive,
  onClick,
  children
}: ToolbarButtonProps) => (
  <button
    type="button"
    className={classNames('mint-rich-text-editor__button', {
      'mint-rich-text-editor__button--active': isActive
    })}
    aria-label={label}
    aria-pressed={isActive}
    title={label}
    onClick={onClick}
  >
    {children}
  </button>
);

const Toolbar = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation('richTextEditor');

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      underline: current.isActive('underline'),
      bulletList: current.isActive('bulletList'),
      orderedList: current.isActive('orderedList'),
      link: current.isActive('link')
    })
  });

  const toggleLink = () => {
    if (state.link) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // eslint-disable-next-line no-alert -- the native prompt is an accessible URL input without a custom dialog
    const href = window.prompt(t('linkPrompt'));
    if (!href) return;

    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  };

  return (
    <div
      className="mint-rich-text-editor__toolbar"
      role="toolbar"
      aria-label={t('toolbar')}
    >
      <ToolbarButton
        label={t('bold')}
        isActive={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong aria-hidden>B</strong>
      </ToolbarButton>
      <ToolbarButton
        label={t('italic')}
        isActive={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em aria-hidden>I</em>
      </ToolbarButton>
      <ToolbarButton
        label={t('underline')}
        isActive={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u aria-hidden>U</u>
      </ToolbarButton>

      <span className="mint-rich-text-editor__divider" aria-hidden />

      <ToolbarButton
        label={t('bulletList')}
        isActive={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Icon.List aria-hidden />
      </ToolbarButton>
      <ToolbarButton
        label={t('orderedList')}
        isActive={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <span aria-hidden className="text-bold">
          1.
        </span>
      </ToolbarButton>

      <span className="mint-rich-text-editor__divider" aria-hidden />

      <ToolbarButton
        label={t('link')}
        isActive={state.link}
        onClick={toggleLink}
      >
        <Icon.Link aria-hidden />
      </ToolbarButton>
    </div>
  );
};

const RichTextEditor = ({
  id,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  className
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        strike: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https'
        }
      })
    ],
    editorProps: {
      attributes: {
        id,
        role: 'textbox',
        'aria-multiline': 'true',
        ...(ariaLabelledBy && { 'aria-labelledby': ariaLabelledBy }),
        ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy })
      }
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML(), current.getText().trim() === '');
    }
  });

  if (!editor) return null;

  return (
    <div className={classNames('mint-rich-text-editor', className)}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="mint-rich-text-editor__content"
      />
    </div>
  );
};

export default RichTextEditor;

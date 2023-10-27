import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

import MentionList, { SuggestionLoading } from './MentionList';

const getClientRect = (props: any) => {
  const elem = document.getElementById('tip-editor');
  const rect = elem?.getBoundingClientRect();

  const mentionRect = props.clientRect();

  return () =>
    new DOMRect(
      rect?.left,
      mentionRect.y,
      mentionRect.width,
      mentionRect.height
    );
};

export default {
  render: () => {
    let reactRenderer: any;
    let spinner: any;
    let popup: any;

    return {
      // If we had async initial data - load a spinning symbol until onStart gets called
      // We have hardcoded in memory data for current implementation, doesn't currently get called
      onBeforeStart: (props: any) => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(SuggestionLoading, {
          props,
          editor: props.editor
        });

        spinner = tippy('body', {
          getReferenceClientRect: getClientRect(props),
          appendTo: () =>
            document.getElementById('tip-editor') || document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: false,
          trigger: 'manual',
          placement: 'bottom-start'
        });
      },

      // Render any available suggestions when mention trigger is first called - @
      onStart: (props: any) => {
        if (!props.clientRect) {
          return;
        }

        spinner[0].hide();

        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor
        });

        popup = tippy('body', {
          getReferenceClientRect: getClientRect(props),
          appendTo: () =>
            document.getElementById('tip-editor') || document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        });
      },

      // When async data/suggestions return, hide the spinner and show the updated list
      onUpdate(props: any) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        spinner[0].hide();

        popup[0].show();
      },

      // If a valid character key, render the spinner until onUpdate gets called to rerender updated list
      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          spinner[0].hide();

          return true;
        }

        if (props.event.key.length === 1 || props.event.key === 'Backspace') {
          popup[0].hide();

          spinner[0].show();
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        spinner[0].destroy();
        reactRenderer.destroy();
      }
    };
  }
};

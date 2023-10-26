import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

import MentionList, { SuggestionLoading } from './MentionList';

export default {
  render: () => {
    let reactRenderer: any;
    let spinner: any;
    let popup: any;

    return {
      onBeforeStart: (props: any) => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(SuggestionLoading, {
          props,
          editor: props.editor
        });

        spinner = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: false,
          trigger: 'manual',
          placement: 'bottom-start'
        });
      },

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
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        });
      },

      onUpdate(props: any) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      }
    };
  }
};

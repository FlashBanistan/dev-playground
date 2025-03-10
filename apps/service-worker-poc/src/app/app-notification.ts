import { PlayNotificationPayload } from '@playground/play-ui';

export enum AppNotification {
  INCOMING_CALL = 'INCOMING_CALL',
}

export const AppNotificationMap: {
  [key in AppNotification]: PlayNotificationPayload;
} = {
  INCOMING_CALL: {
    title: 'Incoming Call',
    options: {
      body: 'John Doe is calling you',
      actions: [
        {
          title: 'Answer Call',
          action: 'ANSWER_CALL',
          icon: 'https://as2.ftcdn.net/v2/jpg/02/15/33/71/1000_F_215337189_IGWHEmPGwFy6bSlSpjS5ngnSDSuuOm3X.jpg',
        },
        {
          title: 'Reject Call',
          action: 'REJECT_CALL',
          icon: 'data:image/png;base64,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',
        },
      ],
      data: {
        onActionClick: {
          ANSWER_CALL: {
            operation: 'focusLastFocusedOrOpen',
          },
        },
      },
    },
  },
};

import { Frame } from '@nativescript/core';

export const Navigation = {
  toLogin: () => {
    Frame.topmost().navigate({
      moduleName: 'views/login/login-page',
      clearHistory: true
    });
  },

  toSignup: () => {
    Frame.topmost().navigate('views/signup/signup-page');
  },

  toChat: () => {
    Frame.topmost().navigate({
      moduleName: 'views/chat/chat-page',
      clearHistory: true
    });
  },

  toConversation: (username: string) => {
    Frame.topmost().navigate({
      moduleName: 'views/chat/conversation-page',
      context: { username }
    });
  },

  toNewChat: () => {
    Frame.topmost().navigate('views/chat/new-chat-page');
  },

  goBack: () => {
    Frame.topmost().goBack();
  }
};
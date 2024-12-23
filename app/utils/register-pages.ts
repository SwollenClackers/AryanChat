// Register all pages in one place for better organization
export const registerPages = {
  'views/login/login-page': () => require('../views/login/login-page'),
  'views/signup/signup-page': () => require('../views/signup/signup-page'),
  'views/chat/chat-page': () => require('../views/chat/chat-page'),
  'views/chat/conversation-page': () => require('../views/chat/conversation-page'),
  'views/chat/new-chat-page': () => require('../views/chat/new-chat-page'),
};
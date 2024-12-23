import { Application } from '@nativescript/core';

// Import all page modules directly
import * as loginPage from './views/login/login-page';
import * as signupPage from './views/signup/signup-page';
import * as chatPage from './views/chat/chat-page';
import * as conversationPage from './views/chat/conversation-page';
import * as newChatPage from './views/chat/new-chat-page';

// Register pages
Application.moduleRegister('views/login/login-page', loginPage);
Application.moduleRegister('views/signup/signup-page', signupPage);
Application.moduleRegister('views/chat/chat-page', chatPage);
Application.moduleRegister('views/chat/conversation-page', conversationPage);
Application.moduleRegister('views/chat/new-chat-page', newChatPage);

Application.run({ moduleName: 'app-root' });
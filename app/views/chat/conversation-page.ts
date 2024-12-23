import { NavigatedData, Page } from '@nativescript/core';
import { ConversationViewModel } from './conversation-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const username = page.navigationContext?.username;
    page.bindingContext = new ConversationViewModel(username);
}

export function createViewModel(username: string) {
    return new ConversationViewModel(username);
}
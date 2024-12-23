import { NavigatedData, Page } from '@nativescript/core';
import { NewChatViewModel } from './new-chat-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new NewChatViewModel();
}

export function createViewModel() {
    return new NewChatViewModel();
}
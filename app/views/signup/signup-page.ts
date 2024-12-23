import { NavigatedData, Page } from '@nativescript/core';
import { SignupViewModel } from './signup-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new SignupViewModel();
}

export function createViewModel() {
    return new SignupViewModel();
}
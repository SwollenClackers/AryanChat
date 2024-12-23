import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { supabase } from '../../config/supabase';

export class NewChatViewModel extends Observable {
  public searchUsername: string = '';
  public errorMessage: string = '';

  async onStartChat() {
    if (!this.searchUsername.trim()) {
      this.set('errorMessage', 'Please enter a username');
      return;
    }

    try {
      const { data: user } = await supabase
        .from('users')
        .select('username')
        .eq('username', this.searchUsername)
        .single();

      if (!user) {
        this.set('errorMessage', 'User not found');
        return;
      }

      Frame.topmost().navigate({
        moduleName: 'views/chat/conversation-page',
        context: { username: this.searchUsername }
      });
    } catch (error) {
      this.set('errorMessage', error.message);
    }
  }
}
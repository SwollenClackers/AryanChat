import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Navigation } from '../../utils/navigation';

export class LoginViewModel extends Observable {
  private authService: AuthService;
  public username: string = '';
  public password: string = '';
  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor() {
    super();
    this.authService = AuthService.getInstance();
  }

  async onLogin() {
    if (!this.username || !this.password) {
      this.set('errorMessage', 'Please fill in all fields');
      return;
    }

    this.set('isLoading', true);
    this.set('errorMessage', '');

    try {
      await this.authService.signIn(this.username, this.password);
      Navigation.toChat();
    } catch (error) {
      this.set('errorMessage', error.message);
    } finally {
      this.set('isLoading', false);
    }
  }

  onSignUpTap() {
    Navigation.toSignup();
  }
}
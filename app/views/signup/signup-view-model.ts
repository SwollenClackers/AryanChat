import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Navigation } from '../../utils/navigation';

export class SignupViewModel extends Observable {
  private authService: AuthService;
  public username: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor() {
    super();
    this.authService = AuthService.getInstance();
  }

  async onSignUp() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.set('errorMessage', 'Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.set('errorMessage', 'Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.set('errorMessage', 'Password must be at least 6 characters');
      return;
    }

    this.set('isLoading', true);
    this.set('errorMessage', '');

    try {
      await this.authService.signUp(this.username, this.password);
      await this.authService.signIn(this.username, this.password);
      Navigation.toChat();
    } catch (error) {
      this.set('errorMessage', error.message);
    } finally {
      this.set('isLoading', false);
    }
  }

  onBackToLogin() {
    Navigation.goBack();
  }
}
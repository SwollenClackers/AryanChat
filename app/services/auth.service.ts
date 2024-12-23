import { Observable } from '@nativescript/core';
import { supabase } from '../config/supabase';
import { CryptoService } from './crypto';

export class AuthService extends Observable {
  private static instance: AuthService;
  public currentUser = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(username: string, password: string) {
    const { publicKey, privateKey } = CryptoService.generateKeyPair();
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new Error('Username already taken');
    }

    const { data, error } = await supabase.auth.signUp({
      email: `${username}@aryanchat.app`,
      password: password
    });

    if (error) throw error;

    // Create user profile with keys
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        username: username,
        public_key: publicKey,
        private_key: privateKey
      });

    if (profileError) throw profileError;
    return data;
  }

  async signIn(username: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@aryanchat.app`,
      password: password
    });

    if (error) throw error;
    this.currentUser = data.user;
    this.notifyPropertyChange('currentUser', data.user);
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.currentUser = null;
    this.notifyPropertyChange('currentUser', null);
  }
}
import { Observable } from '@nativescript/core';
import { supabase } from '../config/supabase';
import { CryptoService } from './crypto';

export class MessageService extends Observable {
  private static instance: MessageService;

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  async sendMessage(recipientUsername: string, content: string) {
    // Get recipient's public key
    const { data: recipient } = await supabase
      .from('users')
      .select('public_key')
      .eq('username', recipientUsername)
      .single();

    if (!recipient) throw new Error('Recipient not found');

    const senderPrivateKey = await this.getCurrentUserPrivateKey();
    
    // Encrypt message
    const encrypted = await CryptoService.encryptMessage(
      content,
      recipient.public_key,
      senderPrivateKey
    );

    // Store encrypted message
    const { error } = await supabase.from('messages').insert({
      sender_id: (await supabase.auth.getUser()).data.user.id,
      recipient_username: recipientUsername,
      content: encrypted.encrypted,
      nonce: encrypted.nonce
    });

    if (error) throw error;
  }

  async getMessages() {
    const user = (await supabase.auth.getUser()).data.user;
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(username)
      `)
      .or(`recipient_username.eq.${user.username},sender_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Decrypt messages
    const privateKey = await this.getCurrentUserPrivateKey();
    const decryptedMessages = await Promise.all(
      messages.map(async (msg) => {
        try {
          const decrypted = await CryptoService.decryptMessage(
            msg.content,
            msg.nonce,
            msg.sender.public_key,
            privateKey
          );
          return {
            ...msg,
            content: decrypted
          };
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          return {
            ...msg,
            content: '[Encrypted Message]'
          };
        }
      })
    );

    return decryptedMessages;
  }

  private async getCurrentUserPrivateKey() {
    const { data: user } = await supabase
      .from('users')
      .select('private_key')
      .eq('id', (await supabase.auth.getUser()).data.user.id)
      .single();
    
    return user.private_key;
  }
}
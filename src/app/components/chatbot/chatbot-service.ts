import {
  Injectable,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';

declare global {
  interface Window {
    watsonAssistantChatOptions: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  loadChat(): void {

    console.log("chatbot appended");
    // Prevent execution during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.watsonAssistantChatOptions = {
      integrationID: 'b008d49f-839e-4cef-bebe-7c174b293d6d',
      region: 'au-syd',
      serviceInstanceID: 'a378277a-ea8f-4773-ab15-bbeaec44c3a4',
      onLoad: async (instance: any) => {
        await instance.render();
      }
    };

    if (this.document.getElementById('watson-chat-script')) {
      return;
    }

    const script = this.document.createElement('script');

    script.id = 'watson-chat-script';
    script.src =
      'https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js';

    script.async = true;

    this.document.head.appendChild(script);
    console.log("chatbot appended");
  }
}
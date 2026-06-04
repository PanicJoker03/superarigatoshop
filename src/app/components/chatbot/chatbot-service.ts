import {
  Injectable,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';
import { EnvironmentService } from '../../services/environment-service';

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
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(EnvironmentService) private environment: EnvironmentService
  ) {}

  loadChat(): void {

    console.log("chatbot appended");
    // Prevent execution during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.watsonAssistantChatOptions = {
      integrationID: this.environment.chatbotIntegrationID,
      region: 'au-syd',
      serviceInstanceID: this.environment.chatbotServiceInstanceID,
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
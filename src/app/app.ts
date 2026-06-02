import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShopifyService } from './commerce/shopify-service';
import { Header } from "./layout/header/header";
import { ChatbotService } from './components/chatbot/chatbot-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('superarigatoshop');
  constructor(
    private shopifyService: ShopifyService,
    private chatbot:ChatbotService) {
  }

  ngOnInit() {
    console.log('App component initialized');
    // Example usage of the ShopifyService to fetch products
    this.shopifyService.getProducts().subscribe((response) => {
      console.log('Products from Shopify API:', response);
    });
    
    console.log("loading chat");
    this.chatbot.loadChat();
  }

  ngAfterViewInit() {
  }
}

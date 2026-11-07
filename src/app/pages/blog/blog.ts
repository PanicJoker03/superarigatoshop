import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BlogEntry, BlogService } from '../../commerce/blog-service';

@Component({
  selector: 'app-blog',
  imports: [DatePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  private blogService = inject(BlogService);
  entries = signal<BlogEntry[]>([]);
  loading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.blogService.getBlogEntries().subscribe({
      next: (entries) => {
        this.entries.set(entries);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Unable to load Shopify blog entries:', error);
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }
}
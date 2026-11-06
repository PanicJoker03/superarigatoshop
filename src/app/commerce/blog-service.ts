import { Injectable } from '@angular/core';
import { gql } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

const GET_BLOG_ENTRIES = gql`
  query GetBlogEntries {
    blogs(first: 10, reverse: true) {
      nodes {
        title
        articles(first: 20, reverse: true) {
          nodes {
            id
            title
            handle
            contentHtml
            publishedAt
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

interface BlogEntriesResponse {
  blogs: {
    nodes: Array<{
      title: string;
      articles: {
        nodes: Array<{
          id: string;
          title: string;
          handle: string;
          contentHtml: string;
          publishedAt: string;
          image: {
            url: string;
            altText: string | null;
          } | null;
        }>;
      };
    }>;
  };
}

export interface BlogEntry {
  id: string;
  blogTitle: string;
  title: string;
  handle: string;
  contentHtml: string;
  publishedAt: string;
  imageUrl: string | null;
  imageAlt: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private apollo: Apollo) {}

  getBlogEntries(): Observable<BlogEntry[]> {
    return this.apollo.query<BlogEntriesResponse>({
      query: GET_BLOG_ENTRIES,
      fetchPolicy: 'network-only',
    }).pipe(
      map(({ data }) => (data?.blogs.nodes ?? []).flatMap((blog) =>
        blog.articles.nodes.map((article) => ({
          id: article.id,
          blogTitle: blog.title,
          title: article.title,
          handle: article.handle,
          contentHtml: article.contentHtml,
          publishedAt: article.publishedAt,
          imageUrl: article.image?.url ?? null,
          imageAlt: article.image?.altText ?? null,
        })),
      )),
    );
  }
}
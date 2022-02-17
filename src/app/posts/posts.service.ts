import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}
  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content };
    this.http
      .post<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }
}

import { PostService } from './../posts.service';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

interface Post {
  title: string;
  content: string;
}
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub!: Subscription;
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts();
    
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}

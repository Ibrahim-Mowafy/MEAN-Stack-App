import { PostService } from './../posts.service';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub!: Subscription;
  isLoading = false;
  totalPost = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData);
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId);
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}

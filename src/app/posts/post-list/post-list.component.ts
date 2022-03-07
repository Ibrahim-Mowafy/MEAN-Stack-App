import { AuthService } from './../../auth/auth.service';
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
  private postsSub!: Subscription;
  private authStatusSub!: Subscription;
  isLoading = false;
  totalPost = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated = false;
  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postsCount: number }) => {
        this.isLoading = false;
        this.totalPost = postData.postsCount;
        this.posts = postData.posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;

    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(postId: string) {
    this.isLoading = true;

    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

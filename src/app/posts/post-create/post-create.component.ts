import { Post } from './../post.model';
import { PostService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: any;
  isLoading = false;
  private mode: string = 'create';
  private postId!: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.get('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || '';
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }
  onSavePost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(postForm.value.title, postForm.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      );
    }
    postForm.resetForm();
  }
}

import { PostService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  constructor(private postService: PostService) {}

  ngOnInit(): void {}
  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    this.postService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }
}

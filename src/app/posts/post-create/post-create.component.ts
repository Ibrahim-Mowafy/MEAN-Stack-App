import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: any;
  isLoading = false;
  private mode: string = 'create';
  private postId!: string;
  form!: FormGroup;
  imagePreview: string = '';
  private authStatusSub: Subscription | undefined;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.AuthService.getAuthStatusListener().subscribe(
      (authStatus) => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required], [mimeType]),
    });
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
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
  ngOnDestroy(): void {
    this.authStatusSub?.unsubscribe();
  }
}

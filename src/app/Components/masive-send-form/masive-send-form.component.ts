import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from 'src/app/Services/localstorage.service';
import { environment } from 'src/environments/environment';

export interface MasiveSendFormResponse{
  message: string;
  file: File;
}

@Component({
  selector: 'app-masive-send-form',
  templateUrl: './masive-send-form.component.html',
  styleUrl: './masive-send-form.component.css'
})
export class MasiveSendFormComponent {
  form!: FormGroup;
  maxSizeMessage: number = environment.config.maxSizeMessage;
  file!: File;

  @Output() onFormSubmit: EventEmitter<MasiveSendFormResponse> = new EventEmitter()

  constructor(
    private formBuilder: FormBuilder,
    private localStorage: LocalstorageService,
  ){
    this.createForm();
    const currentMessage = localStorage.getFromLocalStorage("message");
    this.form.reset({
      message:currentMessage
    })
  }

  createForm(){
      this.form = this.formBuilder.group({
        message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxSizeMessage)]],
        file: ['', [Validators.required]],
      })
    }

  sendMessage(){
    const {message} = this.form.value;
    this.onFormSubmit.emit({
      message,
      file: this.file
    })
  }

  get messageInvalid(){
    return this.form.get("message")?.invalid && this.form.get("message")?.touched
  }

  get fileInvalid(){
    return this.form.get("file")?.invalid && this.form.get("file")?.touched
  }

  get messageLength(){
    return this.form.get("message")?.value?.length || 0;
  }

  saveToLocalStorage(){
    this.localStorage.saveToLocalStorage("message",this.form.get("message")?.value || "")
  }

  onFileSelected(event: any){
    this.file = event.target.files[0];
  }

  clearForm(){
    this.form.reset();
    this.localStorage.saveToLocalStorage("message","")
  }
}

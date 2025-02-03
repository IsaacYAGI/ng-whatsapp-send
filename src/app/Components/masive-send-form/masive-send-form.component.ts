import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from 'src/app/Services/localstorage.service';
import { environment } from 'src/environments/environment';

export interface MasiveSendFormResponse{
  message: string;
  phoneNumber?: string;
  file?: File;
}

const phoneNumberValidators = [Validators.required, Validators.minLength(9)];
const fileValidators = [Validators.required];

@Component({
  selector: 'app-masive-send-form',
  templateUrl: './masive-send-form.component.html',
  styleUrl: './masive-send-form.component.css'
})
export class MasiveSendFormComponent implements OnInit{
  form!: FormGroup;
  maxSizeMessage: number = environment.config.maxSizeMessage;
  file!: File;

  @Input() isTestMessage = false;
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

  ngOnInit(): void {
    if (this.isTestMessage){
      this.form.get("file")?.clearValidators()
      this.form.get("phoneNumber")?.setValidators(phoneNumberValidators)
    }else{
      this.form.get("file")?.setValidators(fileValidators)
      this.form.get("phoneNumber")?.clearValidators()
    }
    this.form.get("file")?.updateValueAndValidity()
    this.form.get("phoneNumber")?.updateValueAndValidity()
  }

  createForm(){
      this.form = this.formBuilder.group({
        message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxSizeMessage)]],
        file: ['', fileValidators],
        phoneNumber: ['', phoneNumberValidators],
      })
    }

  sendMessage(){
    const {message, phoneNumber} = this.form.value;
    this.onFormSubmit.emit({
      message,
      phoneNumber,
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

  get phoneNumberInvalid(){
    return this.form.get("phoneNumber")?.invalid && this.form.get("phoneNumber")?.touched
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

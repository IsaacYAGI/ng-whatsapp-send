import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from 'src/app/Services/localstorage.service';
import { environment } from 'src/environments/environment';

export interface MasiveSendFormResponse{
  message: string;
  phoneNumber?: string;
  attachment?: File | null;
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
  fileAttachment!: File | null;
  showAttachmentInput = false;

  @Input() isTestMessage = false;
  @Output() onFormSubmit: EventEmitter<MasiveSendFormResponse> = new EventEmitter()

  constructor(
    private formBuilder: FormBuilder,
    private localStorage: LocalstorageService,
  ){
    this.createForm();
  }

  ngOnInit(): void {
    const currentMessage = this.localStorage.getFromLocalStorage("message");
    const attachFile = (this.localStorage.getFromLocalStorage("attachFile") === "true")
    this.form.reset({
      message:currentMessage,
      attachFile: attachFile
    })

    if (this.isTestMessage){
      this.form.get("file")?.clearValidators()
      this.form.get("phoneNumber")?.setValidators(phoneNumberValidators)
    }else{
      this.form.get("file")?.setValidators(fileValidators)
      this.form.get("phoneNumber")?.clearValidators()
    }
    this.showAttachmentInput = attachFile
    if (this.showAttachmentInput){
      this.form.get("attachment")?.setValidators(fileValidators)
    }else{
      this.form.get("attachment")?.clearValidators()
    }

    this.form.get("file")?.updateValueAndValidity()
    this.form.get("attachment")?.updateValueAndValidity()
    this.form.get("phoneNumber")?.updateValueAndValidity()
  }

  onCheckboxChange(event: any){
    const value = event.target.checked

    if (value){
      this.showAttachmentInput = true;
      this.form.get("attachment")?.setValidators(fileValidators)
      this.localStorage.saveToLocalStorage("attachFile", value)

    }else{
      this.form.get("attachment")?.clearValidators()
      this.form.get("attachment")?.setValue("")
      this.fileAttachment = null;
      this.showAttachmentInput = false;
      this.localStorage.saveToLocalStorage("attachFile", value || false)
    }
    this.form.get("attachment")?.updateValueAndValidity()
  }

  createForm(){
      this.form = this.formBuilder.group({
        message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxSizeMessage)]],
        attachFile: [false,],
        attachment: ['',fileValidators],
        file: ['', fileValidators],
        phoneNumber: ['', phoneNumberValidators],
      })
    }

  sendMessage(){
    const {message, phoneNumber} = this.form.value;
    this.onFormSubmit.emit({
      message,
      phoneNumber,
      file: this.file,
      attachment: this.fileAttachment
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

  get fileAttachmentInvalid(){
    return this.form.get("attachment")?.invalid && this.form.get("attachment")?.touched
  }

  saveToLocalStorage(){
    this.localStorage.saveToLocalStorage("message",this.form.get("message")?.value || "")
  }

  onAttachmentSelected(event: any){
    this.fileAttachment = event.target.files[0];
  }

  onFileSelected(event: any){
    this.file = event.target.files[0];
  }

  clearForm(){
    this.form.reset();
    this.showAttachmentInput = false;
    this.form.get("attachment")?.clearValidators()
    this.form.get("attachment")?.updateValueAndValidity()
    this.localStorage.saveToLocalStorage("attachFile", "false")
    this.localStorage.saveToLocalStorage("message","")
  }
}

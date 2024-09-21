import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/Services/http.service';
import { LocalstorageService } from 'src/app/Services/localstorage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message-test',
  templateUrl: './message-test.component.html',
  styleUrls: ['./message-test.component.css']
})
export class MessageTestComponent {
  form!: FormGroup;
  contPhones: number;
  currentSent: number;
  loading: boolean;
  maxSizeMessage: number = environment.config.maxSizeMessage;

  constructor( private formBuilder: FormBuilder, private localStorage: LocalstorageService, private sendWhatsappService: HttpService){
    this.contPhones = 0;
    this.currentSent = 0;
    this.loading = false;
    this.createForm();
    const currentMessage = localStorage.getFromLocalStorage("message");
    this.form.reset({
      message:currentMessage
    })
  }

  get messageInvalid(){
    return this.form.get("message")?.invalid && this.form.get("message")?.touched
  }

  get phoneNumberInvalid(){
    return this.form.get("phoneNumber")?.invalid && this.form.get("phoneNumber")?.touched
  }

  get messageLength(){
    return this.form.get("message")?.value?.length || 0;
  }

  createForm(){
    this.form = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxSizeMessage)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
    })
  }


  async sendMessage(){
    console.log("Sending messages...")
    console.log(this.form.value)
    this.loading = true;
    const message = this.form.get("message")?.value;
    const phoneNumbers = this.form.get("phoneNumber")?.value.split(",");
    this.contPhones = phoneNumbers.length;
    await this.sendWhatsappService.startSendSession();
    for (const number of phoneNumbers){
      await this.sendWhatsappService.sendWhatsapp(number,message)
      await this.sendWhatsappService.sleep(300);
      this.currentSent++;
    }
    this.loading = false;
    this.currentSent = 0;
  }

  clearForm(){
    this.form.reset();
    this.localStorage.saveToLocalStorage("message","")
  }

  saveToLocalStorage(){
    this.localStorage.saveToLocalStorage("message",this.form.get("message")?.value || "")
  }
}

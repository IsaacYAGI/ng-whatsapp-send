import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/Services/http.service';
import { LocalstorageService } from 'src/app/Services/localstorage.service';
import { UtilsService } from 'src/app/Services/utils.service';
import { environment } from 'src/environments/environment';
const Mustache = require('mustache');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  form!: FormGroup;
  file!: File;
  contPhones: number;
  currentSent: number;
  loading: boolean;
  maxSizeMessage: number = environment.config.maxSizeMessage;

  constructor( private formBuilder: FormBuilder,
      private localStorage: LocalstorageService,
      private sendWhatsappService: HttpService,
      private utilsService: UtilsService
    ){
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

  get fileInvalid(){
    return this.form.get("file")?.invalid && this.form.get("file")?.touched
  }

  get messageLength(){
    return this.form.get("message")?.value?.length || 0;
  }

  saveToLocalStorage(){
    this.localStorage.saveToLocalStorage("message",this.form.get("message")?.value || "")
  }

  createForm(){
    this.form = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxSizeMessage)]],
      file: ['', [Validators.required]],
    })
  }

  async processCsv(csv: string){
    console.log("processCsv:",csv)
    const csvObj = this.utilsService.CSVToJSON(csv)
    this.loading = true;
    const message = this.form.get("message")?.value;
    this.contPhones = csvObj.length;
    const shouldContinue = confirm(`Se va a enviar el mensaje a ${csvObj.length} contactos. ¿Desea continuar?`)
    if (shouldContinue){
      await this.sendWhatsappService.startSendSession();
      for (const row of csvObj){
        console.log("sending whatsapp to:",row)
        const compiledMessage = Mustache.render(message,  row)
        await this.sendWhatsappService.sendWhatsapp(row.phone.trim(),compiledMessage)
        await this.sendWhatsappService.sleep(environment.config.sleepBetweenMessagesInMs);
        this.currentSent++;
      }
    }

    this.loading = false;
    this.currentSent = 0;
  }

  sendMessage(){
    console.log("Sending messages...")
    console.log(this.form.value)

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      // console.log(e)
      this.processCsv(fileReader.result as string)
    }
    fileReader.readAsText(this.file);
  }

  onFileSelected(event: any){
    this.file = event.target.files[0];

  }

  clearForm(){
    this.form.reset();
    this.localStorage.saveToLocalStorage("message","")
  }
}

import { Component } from '@angular/core';
import { MasiveSendFormResponse } from 'src/app/Components/masive-send-form/masive-send-form.component';
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
  contPhones: number;
  currentSent: number;
  loading: boolean;
  message: string = "";

  constructor(
      private sendWhatsappService: HttpService,
      private utilsService: UtilsService
    ){
      this.contPhones = 0;
    this.currentSent = 0;
    this.loading = false;
  }

  async processCsv(csv: string){
    console.log("processCsv:",csv)
    const csvObj = this.utilsService.CSVToJSON(csv)
    this.loading = true;
    const message = this.message;
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

  sendMessage(event: MasiveSendFormResponse){
    console.log("Response form:", event)
    console.log("Sending messages...")
    // console.log(this.form.value)
    this.message = event.message;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      // console.log(e)
      this.processCsv(fileReader.result as string)
    }
    fileReader.readAsText(event.file ?? new File([],""));
  }



}

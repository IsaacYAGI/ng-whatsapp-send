import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MasiveSendFormResponse } from 'src/app/Components/masive-send-form/masive-send-form.component';
import { HttpService } from 'src/app/Services/http.service';
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


  constructor(
    private sendWhatsappService: HttpService
  ){
    this.contPhones = 0;
    this.currentSent = 0;
    this.loading = false;
  }

  async sendMessage(event: MasiveSendFormResponse){
    console.log("Sending messages...")
    console.log(event)
    this.loading = true;
    const message = event.message;
    const phoneNumbers = event.phoneNumber?.split(",") || [];
    this.contPhones = phoneNumbers.length;
    await this.sendWhatsappService.startSendSession();
    for (const number of phoneNumbers){
      await this.sendWhatsappService.sendWhatsapp(number,message)
      await this.sendWhatsappService.sleep(environment.config.sleepBetweenMessagesInMs);
      this.currentSent++;
    }
    this.loading = false;
    this.currentSent = 0;
  }

}

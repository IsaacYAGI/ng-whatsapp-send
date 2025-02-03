import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MasiveSendFormResponse } from 'src/app/Components/masive-send-form/masive-send-form.component';
import { HttpService } from 'src/app/Services/http.service';
import { Base64File, UtilsService } from 'src/app/Services/utils.service';
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
  formResponse: MasiveSendFormResponse | null = null;

  constructor(
    private sendWhatsappService: HttpService,
    private utilsService: UtilsService

  ){
    this.contPhones = 0;
    this.currentSent = 0;
    this.loading = false;
  }

  async sendMessage(event: MasiveSendFormResponse){
    console.log("Sending messages...")
    console.log(event)
    this.loading = true;
    this.formResponse = event;
    const message = this.formResponse?.message;
    const caption = this.formResponse?.caption;
    let attachmentB64: Base64File | null = null;
    if (this.formResponse?.includeAttachment){
      attachmentB64  = await this.utilsService.fileToBase64(this.formResponse.attachment!)
    }
    const phoneNumbers = event.phoneNumber?.split(",") || [];
    this.contPhones = phoneNumbers.length;
    await this.sendWhatsappService.startSendSession();
    for (const number of phoneNumbers){
      if (this.formResponse?.includeMessage){
        await this.sendWhatsappService.sendWhatsapp(number, message!)
        await this.sendWhatsappService.sleep(environment.config.sleepBetweenMessagesInMs);
      }
      if (this.formResponse?.includeAttachment){
        await this.sendWhatsappService.sendWhatsappDocument(number,attachmentB64!, caption)
        await this.sendWhatsappService.sleep(environment.config.sleepBetweenMessagesInMs);
      }
      this.currentSent++;
    }
    this.loading = false;
    this.currentSent = 0;
  }

}

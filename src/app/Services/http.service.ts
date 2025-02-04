import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base64File } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl = `${environment.wsApiUrl}`
  constructor(private http: HttpClient) { }

  startSendSession(){
    const response$ = this.http.post(`${this.apiUrl}/start-send-session`, {})
    return lastValueFrom(response$)
  }

  sendWhatsapp(phoneNumber: string, message:string){
    const message$ = this.http.post(`${this.apiUrl}/send-whatsapp`, {
      message:message,
      phone: phoneNumber
    })
    return lastValueFrom(message$)
  }

  sendWhatsappDocument(phoneNumber: string, file: Base64File, caption: string|null = null){

    const message$ = this.http.post(`${this.apiUrl}/send-whatsapp-file-b64`, {
      file:file.file,
      filename: file.name,
      mime: file.mime,
      phone: phoneNumber,
      ...{caption}
    })
    return lastValueFrom(message$)
  }

  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve,ms))
  }
}

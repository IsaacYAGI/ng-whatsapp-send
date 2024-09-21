import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve,ms))
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl = `${environment.wsApiUrl}/send-whatsapp`
  constructor(private http: HttpClient) { }

  sendWhatsapp(phoneNumber: string, message:string){
    const message$ = this.http.post(this.apiUrl, {
      message:message,
      phone: phoneNumber
    })
    return lastValueFrom(message$)
  }

  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve,ms))
  }
}

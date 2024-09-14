import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  saveToLocalStorage(key:string, message: string){
    localStorage.setItem(key,message)
  }

  getFromLocalStorage(key: string){
    return localStorage.getItem(key)
  }
}

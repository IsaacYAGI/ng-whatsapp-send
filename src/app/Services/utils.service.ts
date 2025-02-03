import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Base64File{
  mime: string;
  file: string
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  CSVToJSON(csvText: string): any[]{
    const allLines = csvText.trim().split("\n");
    const header = allLines[0]
    const dataLines = allLines.slice(1)
    const fieldNames = header.split(environment.config.templateDelimiter)

    let objList = []

    for (let i = 0; i < dataLines.length; i++){
      let obj:any = {}
      const data = dataLines[i].split(environment.config.templateDelimiter)
      for (let j = 0; j < fieldNames.length; j++){
        const fieldName = this.removeLineBreaks(fieldNames[j].toLowerCase().trim());
        obj[fieldName] = this.removeLineBreaks(data[j])
      }
      objList.push(obj)
    }
    return objList
  }

  removeLineBreaks(text: string): string{
    return text?.replace(/\r?\n|\r/,"") || ""
  }

  fileToBase64(file: File): Promise<Base64File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({
                mime: file.type,
                file: base64String
            });
        };
        reader.onerror = error => reject(error);
    });
}
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
}

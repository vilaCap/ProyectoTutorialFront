import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../client/model/Client';
import { Prestamo } from './model/Prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  constructor(
    private http: HttpClient
    ) { }

  getPrestamos(title?: String, client?: String, date?: Date): Observable<Prestamo[]> {
    console.log("Date get = " + date);
    return this.http.get<Prestamo[]>(this.composeFindUrl(title, client, date));
  }

  private composeFindUrl(title?: String, client?: String, date?: Date) : string {
    let params = '';

    if (title != null) {
        params += 'title='+title;
    }

    if (client != null) {
        if (params != '') params += "&";
        params += "client="+client;
    }

    if (date != null) {
        if (params != '') params += "&";
        params += "prestamo_date="+date;
    }

    let url = 'http://localhost:8080/prestamo'

    if (params == '') return url;
    else return url + '?'+params;
  }

  deletePrestamo(id: number):  Observable<any> {
    return this.http.delete('http://localhost:8080/prestamo/' + id);
  }

  savePrestamo(prestamo: Prestamo): Observable<Prestamo> {
      let url = 'http://localhost:8080/prestamo';
      if(prestamo.id != null){
          url += "/"+prestamo.id;
      }
      return this.http.put<Prestamo>(url, prestamo);
  }
}

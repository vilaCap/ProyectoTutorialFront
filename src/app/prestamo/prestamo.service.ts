import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../client/model/Client';
import { Game } from '../game/model/Game';
import { LoanPage } from './model/LoanPage';
import { Pageable } from './model/page/Pageable';
import { Prestamo } from './model/Prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {



  constructor(
    private http: HttpClient
    ) { }

  getPrestamos(pageable: Pageable): Observable<LoanPage> {
    return this.http.post<LoanPage>('http://localhost:8080/loan', {pageable:pageable});
  }

  getPrestamo(game?: number, client?: number, date?: Date): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.composeFindUrl(game, client, date));
  }

  private composeFindUrl(game?: number, client?: number, date?: Date) : string {
    let params = '';
    let dateS = '';

    if (game != null) {
        params += 'game_id='+game;
    }

    if (client != null) {
        if (params != '') params += "&";
        params += "client_id="+client;
    }

    if (date != null) {
        if (params != '') params += "&";
        const dateSendingToServer = new DatePipe('en-US').transform(date, 'dd/MM/yyyy')
        params += "loan_date="+dateSendingToServer;
    }

    let url = 'http://localhost:8080/loan'

    if (params == '') return url;
    else return url + '?'+params;
  }

  deletePrestamo(id: number):  Observable<any> {
    return this.http.delete('http://localhost:8080/loan/' + id);
  }

  savePrestamo(prestamo: Prestamo): Observable<Prestamo> {
      let url = 'http://localhost:8080/loan';
      if(prestamo.id != null){
          url += "/"+prestamo.id;
      }
      return this.http.put<Prestamo>(url, prestamo);
  }
}

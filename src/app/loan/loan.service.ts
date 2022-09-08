import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../client/model/Client';
import { Game } from '../game/model/Game';
import { LoanPage } from './model/LoanPage';
import { Pageable } from './model/page/Pageable';
import { Loan } from './model/Loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {



  constructor(
    private http: HttpClient
    ) { }

  getLoans(customerId? :number, gameId? : number, searchDate?: Date,  pageable? : Pageable) : Observable<LoanPage> {
    return this.http.post<LoanPage>(this.composeFindUrl(customerId, gameId, searchDate), {pageable:pageable});
  }

  getLoan(customerId? :number, gameId? : number, searchDate?: Date) : Observable<Loan[]> {
    return this.http.get<Loan[]>(this.composeFindUrl(customerId, gameId, searchDate));
  }

  private composeFindUrl(game?: number, client?: number, date?: Date) : string {
    let params = '';

    if (game != null) {
        params += 'game_id='+game;
    }

    if (client != null) {
        if (params != '') params += "&";
        params += "client_id="+client;
    }

    if (date != null) {
        if (params != '') params += "&";
        const dateSendingToServer = new DatePipe('en-US').transform(date, 'yyyy/MM/dd')
        params += "loan_date="+dateSendingToServer;
    }

    let url = 'http://localhost:8080/loan'

    if (params == '') return url;
    else return url + '?'+params;
  }

  deleteLoan(id: number):  Observable<any> {
    return this.http.delete('http://localhost:8080/loan/' + id);
  }

  saveLoan(loan: Loan): Observable<Loan> {
      let url = 'http://localhost:8080/loan';
      if(loan.id != null){
          url += "/"+loan.id;
      }
      return this.http.put<Loan>(url, loan);
  }
}

import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TitleStrategy } from '@angular/router';
import { ConnectableObservable } from 'rxjs';
import { ClientService } from 'src/app/client/client.service';
import { Client } from 'src/app/client/model/Client';
import { GameService } from 'src/app/game/game.service';
import { Game } from 'src/app/game/model/Game';
import { Loan } from '../model/Loan';
import { LoanService } from '../loan.service';

@Component({
  selector: 'app-loan-editor',
  templateUrl: './loan-editor.component.html',
  styleUrls: ['./loan-editor.component.scss']
})
export class LoanEditorComponent implements OnInit {

  games: Game[];
  clients: Client[];
  loans: Loan[];
  loan: Loan;
  selectedGame: string;
  selectedClient: string;
  game: Game;
  client: Client;
  nameClient: string;
  titleGame: string;
  

  constructor(
    public dialogRef: MatDialogRef<LoanEditorComponent>,
    public gameService: GameService,
    public clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loanService: LoanService) { }

  ngOnInit(): void {
    if (this.data.loan != null) {
      this.loan = Object.assign({}, this.data.loan);
    }
    else {
      this.loan = new Loan();
    }

    this.loanService.getLoan().subscribe(
      loans => this.loans = loans
    )

    this.gameService.getGames().subscribe(
        games => this.games = games
    );
    if (this.data.game != null) {
        this.game = Object.assign({}, this.data.game);
    }
    else {
        this.game = new Game();
    }

    this.clientService.getClients().subscribe(
      clients => this.clients = clients
  );
  
  if (this.data.client != null) {
      this.client = Object.assign({}, this.data.client);
  }
  else {
      this.client = new Client();
  }
  }
  
  onSave() {
    let dateLoan: Date = new Date(this.loan.loanDate);
    let dateDev: Date = new Date(this.loan.devDate);
    let date14: Date = new Date();
    let existsClient: boolean = false;
    let existsGame: boolean = false;
    date14.setDate(dateLoan.getDate() + 14);
    
    if( dateLoan > dateDev){
      alert("La fecha de devolucion debe ser posterior a la de prestamo.")
    }
    else if( dateDev > date14){
      alert("El prestamo puede durar un maximo de 14 dias");
    }
    else {
      for(var i = 0; i < this.loans.length; i++){ 
        if(this.loans[i].client.name == this.selectedClient){
          existsClient = true;
        }
        if(this.loans[i].game.title == this.selectedGame){
          existsGame = true;
        }
      }
      if(existsGame){
        alert("El juego seleccionado ya esta en posesion de un cliente");
      }
      else if(existsClient){
        alert("El cliente seleccionado ya tiene un juego en su posesion");
      }
      else{
        //for para obtener el juego que tiene el titulo seleccionado
        for(var i = 0; i < this.games.length; i++){
          if(this.games[i].title == this.selectedGame){
            this.loan.game = this.games[i];
          }
        }
    
        //for para obtener el cliente seleccionado
        for(var i = 0; i < this.clients.length; i++){
          if(this.clients[i].name == this.selectedClient){
            this.loan.client = this.clients[i];
          }
        }
    
        this.loanService.saveLoan(this.loan).subscribe(result => {
          this.dialogRef.close();
        });
      }
    }
  }  

  onClose() {
    this.dialogRef.close();
  }

  setNameClient(name: MatSelectChange){
    this.nameClient = name.value;
  }

  setTitleGame(title: MatSelectChange){
    this.titleGame = title.value;
  }

  getNameClient(): string{
   return this.nameClient;
  }

  getTitleGame(): string{
    return this.titleGame;
  }
}

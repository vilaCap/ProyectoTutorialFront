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
import { Prestamo } from '../model/Prestamo';
import { PrestamoService } from '../prestamo.service';

@Component({
  selector: 'app-prestamo-editor',
  templateUrl: './prestamo-editor.component.html',
  styleUrls: ['./prestamo-editor.component.scss']
})
export class PrestamoEditorComponent implements OnInit {

  games: Game[];
  clients: Client[];
  prestamos: Prestamo[];
  prestamo: Prestamo;
  selectedGame: string;
  selectedClient: string;
  game: Game;
  client: Client;
  nameClient: string;
  titleGame: string;
  

  constructor(
    public dialogRef: MatDialogRef<PrestamoEditorComponent>,
    public gameService: GameService,
    public clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prestamoService: PrestamoService) { }

  ngOnInit(): void {
    if (this.data.prestamo != null) {
      this.prestamo = Object.assign({}, this.data.prestamo);
    }
    else {
      this.prestamo = new Prestamo();
    }

    this.prestamoService.getPrestamo().subscribe(
      prestamos => this.prestamos = prestamos
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
    let dateLoan: Date = new Date(this.prestamo.loanDate);
    let dateDev: Date = new Date(this.prestamo.devDate);
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
      for(var i = 0; i < this.prestamos.length; i++){ 
        if(this.prestamos[i].client.name == this.selectedClient){
          existsClient = true;
        }
        if(this.prestamos[i].game.title == this.selectedGame){
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
            this.prestamo.game = this.games[i];
          }
        }
    
        //for para obtener el cliente seleccionado
        for(var i = 0; i < this.clients.length; i++){
          if(this.clients[i].name == this.selectedClient){
            this.prestamo.client = this.clients[i];
          }
        }
    
        this.prestamoService.savePrestamo(this.prestamo).subscribe(result => {
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
    console.log("get name client: " + this.selectedClient);
   return this.nameClient;
  }

  getTitleGame(): string{
    return this.titleGame;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { LoanService } from '../loan.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { LoanEditorComponent } from '../loan-editor/loan-editor.component';
import { Game } from 'src/app/game/model/Game';
import { GameService } from 'src/app/game/game.service';
import { Client } from 'src/app/client/model/Client';
import { ClientService } from 'src/app/client/client.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/author/model/page/Pageable';


@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  loans: Loan[];
  game : Game;
  games: Game[];
  client: Client;
  clients: Client[];
  filterGame: number;
  filterClient: number;
  filterDate: Date;
  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'prestamoDate', 'devDate', 'action'];
  cMultiCtrl: FormControl = new FormControl();
  selectedGame: string;
  selectedClient: String;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private loanService: LoanService,
    private gameService: GameService,
    private clientService: ClientService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {

    this.gameService.getGames().subscribe(
        games => this.games = games
    );

    this.clientService.getClients().subscribe(
      clients => this.clients = clients
  );

    this.loadPage();
  }

  createLoan(){
    const dialogRef = this.dialog.open(LoanEditorComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  onCleanFilter(): void {
    this.filterGame = null;
    this.selectedGame = null;
    this.filterClient = null;
    this.selectedClient = null;
    this.filterDate = null;

    this.loadPage();
  }

  onSearch(): void {  
    let game = this.filterGame != null ? this.filterGame : null;
    let client = this.filterClient != null ? this.filterClient : null;
    let date = this.filterDate != null ? this.filterDate : null;
  
    this.loanService.getLoan(game, client, date).subscribe(
        loans =>  this.dataSource.data = loans
    );
  }

  deleteLoan(loan){
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar prestamo", description: "Atención si borra el prestamo se perderán sus datos.<br> ¿Desea eliminar el prestamo?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  }

  setFilterGame(game: MatSelectChange){
    this.filterGame = game.value;
  }

  setFilterClient(client: MatSelectChange){
    this.filterClient = client.value;
  }

  setFileterDate(){
    
  }

  loadPage(event?: PageEvent) {

    let pageable : Pageable =  {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
            property: 'id',
            direction: 'ASC'
        }]
    }

    if (event != null){
        pageable.pageSize = event.pageSize
        pageable.pageNumber = event.pageIndex;
    }

    this.loanService.getLoans(pageable).subscribe(data => {
        this.dataSource.data = data.content;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
    });

}  

}
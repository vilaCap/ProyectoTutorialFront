import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamo } from '../model/Prestamo';
import { PrestamoService } from '../prestamo.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { PrestamoEditorComponent } from '../prestamo-editor/prestamo-editor.component';
import { Game } from 'src/app/game/model/Game';
import { GameService } from 'src/app/game/game.service';
import { Client } from 'src/app/client/model/Client';
import { ClientService } from 'src/app/client/client.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/author/model/page/Pageable';


@Component({
  selector: 'app-prestamo-list',
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent implements OnInit {
  prestamos: Prestamo[];
  game : Game;
  games: Game[];
  client: Client;
  clients: Client[];
  filterGame: number;
  filterClient: number;
  filterDate: Date;
  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'game', 'client', 'prestamoDate', 'devDate', 'action'];
  cMultiCtrl: FormControl = new FormControl();
  selectedGame: string;
  selectedClient: String;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private prestamoService: PrestamoService,
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

  createPrestamo(){
    const dialogRef = this.dialog.open(PrestamoEditorComponent, {
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

    this.onSearch();
  }

  onSearch(): void {  
    let game = this.filterGame != null ? this.filterGame : null;
    let client = this.filterClient != null ? this.filterClient : null;
    let date = this.filterDate != null ? this.filterDate : null;
  
    this.prestamoService.getPrestamo(game, client, date).subscribe(
        prestamos =>  this.dataSource.data = prestamos
    );
  }

  deletePrestamo(prestamo){
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar prestamo", description: "Atención si borra el prestamo se perderán sus datos.<br> ¿Desea eliminar el prestamo?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.prestamoService.deletePrestamo(prestamo.id).subscribe(result => {
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

    this.prestamoService.getPrestamos(pageable).subscribe(data => {
        this.dataSource.data = data.content;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
    });

}  

}
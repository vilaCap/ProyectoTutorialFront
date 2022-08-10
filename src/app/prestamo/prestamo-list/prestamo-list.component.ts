import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamo } from '../model/Prestamo';
import { PrestamoService } from '../prestamo.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { PrestamoEditorComponent } from '../prestamo-editor/prestamo-editor.component';


@Component({
  selector: 'app-prestamo-list',
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent implements OnInit {
  prestamos: Prestamo[];
  filterTitle: string;
  filterClient: string;
  filterDate: Date;
  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'title', 'client', 'prestamoDate', 'devDate', 'action'];

  constructor(
    private prestamoService: PrestamoService,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {

    this.prestamoService.getPrestamos().subscribe(
        prestamos => this.dataSource.data = prestamos
    );
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
    this.filterTitle = null;
    this.filterClient = null;
    this.filterDate = null;

    this.onSearch();
  }

  onSearch(): void {  
    let title = this.filterTitle != null ? this.filterTitle : null;
    let client = this.filterClient != null ? this.filterClient : null;
    let date = this.filterDate != null ? this.filterDate : null;
    
    console.log("Filter date = " + this.filterDate);

    this.prestamoService.getPrestamos(title, client, date).subscribe(
        prestamos =>  (this.dataSource.data = prestamos,
          console.log("Date = " + date))
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
}
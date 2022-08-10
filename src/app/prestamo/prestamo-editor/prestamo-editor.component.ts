import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prestamo } from '../model/Prestamo';
import { PrestamoService } from '../prestamo.service';

@Component({
  selector: 'app-prestamo-editor',
  templateUrl: './prestamo-editor.component.html',
  styleUrls: ['./prestamo-editor.component.scss']
})
export class PrestamoEditorComponent implements OnInit {

  prestamo: Prestamo;

  constructor(
    public dialogRef: MatDialogRef<PrestamoEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prestamoService: PrestamoService) { }

  ngOnInit(): void {
    if (this.data.prestamo != null) {
      this.prestamo = Object.assign({}, this.data.prestamo);
    }
    else {
      this.prestamo = new Prestamo();
    }
  }
  
  onSave() {
    
    if(this.prestamo.devDate)
    this.prestamoService.savePrestamo(this.prestamo).subscribe(result => {
      this.dialogRef.close();
    });
  }  

  onClose() {
    this.dialogRef.close();
  }

}

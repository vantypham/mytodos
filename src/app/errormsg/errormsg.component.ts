import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-errormsg',
  templateUrl: './errormsg.component.html',
  styleUrls: ['./errormsg.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,]
})
export class ErrormsgComponent {

}

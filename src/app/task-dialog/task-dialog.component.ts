import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule, MatChipsModule, MatRadioModule, MatDividerModule],
})
export class TaskDialogComponent implements OnInit {
  form!: FormGroup;
  newtask = '..add new todo task here';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    let initValue = '';
    let initId = Date.now();
    let initColor = "background-color: #fff";
    let initChecked = false;
    let newtaskFromLocalStorage = localStorage.getItem('newtask');
    initValue = newtaskFromLocalStorage ? JSON.parse(newtaskFromLocalStorage).textArea : '';
    initId = newtaskFromLocalStorage ? JSON.parse(newtaskFromLocalStorage).id : Date.now();
    initColor = newtaskFromLocalStorage ? JSON.parse(newtaskFromLocalStorage).color : initColor;
    initChecked = newtaskFromLocalStorage ? JSON.parse(newtaskFromLocalStorage).checked : initChecked;
    
    this.form = this.fb.group({
      id: initId,
      textArea: initValue,
      color: initColor,
      checked: initChecked
    });
    // Handle value changes
    this.form.get('textArea')?.valueChanges.subscribe(value => {
      //console.log('Text Area:', value);
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      //console.log('Form Submitted', JSON.stringify(this.form.value));
      localStorage.setItem('newtask', JSON.stringify(this.form.value));
    }
  }


  // clickOnSaveButton(newtask: string): void {
  //   console.log(`click on save button with newtask value ${newtask}}`);
  //   localStorage.setItem('newtask', JSON.stringify(newtask));
  // }
  
  
}

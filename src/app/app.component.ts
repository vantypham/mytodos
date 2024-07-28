import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'mytodos';
  flag = false;

  ngOnInit(): void {
    localStorage.setItem('flag', 'false');
  }

  onToggle(event: MatSlideToggleChange): void {
    this.flag = event.checked
    ;
    console.log('Toggle State:', this.flag);
    localStorage.setItem('flag', JSON.stringify(this.flag));
    //console.log('toggle flag: ', this.flag);
  }
}


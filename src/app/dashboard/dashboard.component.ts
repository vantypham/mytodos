import {Component, OnInit} from '@angular/core';
import {NgFor} from '@angular/common';
import { DatePipe } from '@angular/common';

import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';

import {MatCardModule} from '@angular/material/card';
import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  DragStartDelay,
} from '@angular/cdk/drag-drop';
import { ErrormsgComponent } from '../errormsg/errormsg.component';

export interface Task {
  id: number;
  textArea: string;
  color?: string;
  checked?: boolean;
  changedDate?: number;
}
export interface MyLink {
  text: string;
  url: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  providers: [DatePipe],
  imports: [CdkDropListGroup, CdkDropList, NgFor, CdkDrag, NgFor,MatIconModule, MatCardModule, MatInputModule,
    MatCheckboxModule, MatSelectModule, MatRadioModule, FormsModule, MatFormFieldModule, ReactiveFormsModule,
    MatSlideToggleModule, MatDividerModule, MatButtonModule, MatDialogModule, TaskDialogComponent],
})
export class DashboardComponent implements OnInit  {
  form!: FormGroup;
  today: Date = new Date();
  formattedDate: string | null;
  flag: boolean = false;
  dragdelay: DragStartDelay = 100;
  doingchecked: boolean = false;

  links: MyLink[] = [
    {text: 'Gmail', url: 'https://mail.google.com/'},
    {text: 'ChatGPT', url: 'https://chatgpt.com/'},
      {text: 'LinkedIn', url: 'https://www.linkedin.com/'},
      // {text: 'Indeed', url: 'https://www.indeed.com/'},
      // {text: 'Glassdoor', url: 'https://www.glassdoor.com/'},
      // {text: 'Monster', url: 'https://www.monster.com/'},
      // {text: 'ZipRecruiter', url: 'https://www.ziprecruiter.com/Search-Jobs-Near-Me'},
      // {text: 'Dice', url: 'https://www.dice.com/dashboard/profiles'},
      // {text: 'Talent', url: 'https://www.talent.com/'},
      // {text: 'ResumeBuilder', url: 'https://www.resumebuilder.com/'},
      // {text: 'CV Builder', url: 'https://www.cvbuilderapp.com/'},
      // {text: 'Hired', url: 'https://www.hired.com/'},
      // {text: 'GitHub', url: 'https://github.com/'},
      // {text: 'Udemy', url: 'https://www.udemy.com/'},
      // {text: 'Draw.io', url: 'https://app.diagrams.net/'},
      // {text: 'mpnjs', url: 'https://www.npmjs.com/'},
      // {text: 'mvn-repo', url: 'https://mvnrepository.com/'},
    ];

  todo: Task[] = [];
  //todoFiltered: Task[] = [];
  doing: Task[] = [];
  //doingFiltered: Task[] = [];
  done: Task[] = [];
  //doneFiltered: Task[] = [];
  mycolor: ThemePalette = 'accent';
  newtaskvalue: Task = {id: Date.now(), textArea: ''};
  searchTerm: string = '';

  constructor(public dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) {
    this.formattedDate = this.datePipe.transform(this.today, 'fullDate');
  }

  ngOnInit(): void {
    //search term:
    this.form = this.fb.group({
      textInput: ''
    });
    //flag
    this.flag = localStorage.getItem('flag') === 'true';
    //console.log(`flag: ${this.flag}`);


    //console.log(`initializing ngOnInit()`);
    let todoInitList = localStorage.getItem('local_todos');
    if (todoInitList) {
      this.todo = JSON.parse(todoInitList);
      //this.todoFiltered = this.todo; // show all tasks in the filtered list initially
    } else {
      this.todo = [];
    }
    //
    let doingInitList = localStorage.getItem('local_doings');
    if (doingInitList) {
      this.doing = JSON.parse(doingInitList);
      //this.doingFiltered = this.doing; // show all tasks in the filtered list initially
    } else {
      this.doing = [];
    }
    //
    let doneInitList = localStorage.getItem('local_dones');
    if (doneInitList) {
      this.done = JSON.parse(doneInitList);
      //this.doneFiltered = this.done; // show all tasks in the filtered list initially
    } else {
      this.done = [];
    }

    // Handle value changes SEARCH
    // this.form.get('textInput')?.valueChanges.subscribe(value => {
    //   this.searchTerm = value;
      //filtering
    // });
  }

  // CLick ADD button
  openDialog() {
    if (localStorage.getItem('flag') === 'true') {
      localStorage.setItem('newtask', '');
      const dialogRef = this.dialog.open(TaskDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        //console.log(`Dialog result: ${JSON.stringify(result)}`);
        if (result) {
          var newtask = localStorage.getItem('newtask');
          if (newtask) {
            this.newtaskvalue = newtask ? JSON.parse(newtask) : {id: Date.now, textArea: ''};
            if (this.newtaskvalue.checked === undefined) {this.newtaskvalue.checked = false;}
            this.newtaskvalue.changedDate = Date.now();
            this.todo.push(this.newtaskvalue);
            //store to localStorage:
            localStorage.setItem('local_todos', JSON.stringify(this.todo));
            //update todoFiltered
            //this.todoFiltered = this.todo;
            //reset
            this.newtaskvalue = {id: Date.now(), textArea: ''};
            localStorage.setItem('newtask', '');
            this.searchTerm ='';
            this.form.get('textInput')?.setValue('');
          }
        }
      });
    } 
    else {
      const dialogRef = this.dialog.open(ErrormsgComponent);
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log(`Dialog result: ${JSON.stringify(result)}`);
      // })
    }
  }

  // CLick ADD button on Doing List
  openDialog2() {
    if (localStorage.getItem('flag') === 'true') {
      localStorage.setItem('newtask', '');
      const dialogRef = this.dialog.open(TaskDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        //console.log(`Dialog result: ${JSON.stringify(result)}`);
        if (result) {
          var newtask = localStorage.getItem('newtask');
          if (newtask) {
            this.newtaskvalue = newtask ? JSON.parse(newtask) : {id: Date.now, textArea: ''};
            if (this.newtaskvalue.checked === undefined) {this.newtaskvalue.checked = false;}
            this.newtaskvalue.changedDate = Date.now();
            this.doing.push(this.newtaskvalue);
            //store to localStorage:
            localStorage.setItem('local_doings', JSON.stringify(this.doing));
            //reset
            this.newtaskvalue = {id: Date.now(), textArea: ''};
            localStorage.setItem('newtask', '');
            
          }
        }
      });
    } 
    else {
      const dialogRef = this.dialog.open(ErrormsgComponent);
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log(`Dialog result: ${JSON.stringify(result)}`);
      // })
    }
  }

  
  
  //drag and drop
  drop(event: CdkDragDrop<Task[]>) {
    
    if (localStorage.getItem('flag') === 'true') {
      // console.log("previousContainer=" + JSON.stringify(event.previousContainer.data));
      // console.log("container=" + JSON.stringify(event.container.data));
      // console.log("previousOBEJCT=" + JSON.stringify(event.previousContainer.data[event.previousIndex]));
      // console.log("containerOBJECT=" + JSON.stringify(event.previousContainer.data[event.currentIndex]));
      event.previousContainer.data[event.previousIndex].checked = false;
      event.previousContainer.data[event.previousIndex].changedDate = Date.now();
      // movingObj.checked = false;
      // event.previousContainer.data[event.previousIndex] = movingObj;
      
      if (event.previousContainer === event.container) {
        //console.log(`Dropping 1-ordering`);
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        //console.log(`Dropping 2-moving to other list`);
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
      localStorage.setItem('local_todos', JSON.stringify(this.todo));
      localStorage.setItem('local_doings', JSON.stringify(this.doing));
      localStorage.setItem('local_dones', JSON.stringify(this.done));
    } else {
      this.dialog.open(ErrormsgComponent);
    }
  }


  ////
  deleteAllDone() {
    if (localStorage.getItem('flag') === 'true') {
      localStorage.removeItem('local_dones');
      this.done = [];
      //empty filter list.
      //this.doneFiltered = [];
    } else {
      this.dialog.open(ErrormsgComponent);
    }
  }
  
  deleteOneItemInTodoList(id: number) {
    if (localStorage.getItem('flag') === 'true') {
      let alist = this.todo.filter(i => i.id!== id);
      localStorage.setItem('local_todos', JSON.stringify(alist));
      this.todo = alist;
      //filter again for todo list.
      //this.todoFiltered = this.todo.filter(task => task.textArea.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.dialog.open(ErrormsgComponent);
    }
  }
  deleteOneItemInDoingList(id: number) {
    if (localStorage.getItem('flag') === 'true') {
      let alist = this.doing.filter(i => i.id!== id);
      localStorage.setItem('local_doings', JSON.stringify(alist));
      this.doing = alist;
      //filter again for doing list.
      //this.doingFiltered = this.doing.filter(task => task.textArea.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.dialog.open(ErrormsgComponent);
    }
  }
  deleteOneItemInDoneList(id: number) {
    if (localStorage.getItem('flag') === 'true') {
      let alist = this.done.filter(i => i.id !== id);
      localStorage.setItem('local_dones', JSON.stringify(alist));
      this.done = alist;
      //filter again for done list.
      //this.doneFiltered = this.done.filter(task => task.textArea.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.dialog.open(ErrormsgComponent);
    }
  }

  //name is one of below values: 'local_doings', 'local_todos', 'local_dones'
  openDialogEdit(item: Task, name: string) {
    if (localStorage.getItem('flag') === 'true') {
    let list: Task[] = [];
    if (name === 'local_todos') list = this.todo;
    if (name === 'local_doings') list = this.doing;
    if (name === 'local_dones') list = this.done;

    localStorage.setItem('newtask', JSON.stringify(item));

    const dialogRef = this.dialog.open(TaskDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${JSON.stringify(result)}`);
      if (result) {
        var newtask = localStorage.getItem('newtask');
        if (newtask) {
          this.newtaskvalue = newtask ? JSON.parse(newtask) : {id: Date.now(), textArea: ''};
          // looking for existing Task in 'todo' list, if it exists then replace it with the new task
          let index = list.findIndex(i => i.id === this.newtaskvalue.id);
          if (this.newtaskvalue.checked === undefined) {this.newtaskvalue.checked = false;}
          if (index > -1) {
            list[index] = this.newtaskvalue;
          } else {
            // otherwise, add new task to 'todo' list
            list.push(this.newtaskvalue);
          }
          //store to localStorage:
          localStorage.setItem(name, JSON.stringify(list));//name 
          //reset
          this.newtaskvalue = {id: Date.now(), textArea: ''};
          localStorage.setItem('newtask', '');

        }
      }
    });
  } else {
    this.dialog.open(ErrormsgComponent);
  }
  }

  //Search
  onSubmit() {
    console.log("searchTerm:" + this.searchTerm);
  }

  async clickDoingChecked(isChecked: boolean | undefined, id: number) {
    if (localStorage.getItem('flag') === 'true') {
    await new Promise(r => setTimeout(r, 1000));
    if (isChecked === undefined) {
      isChecked = false;
    }
    //looking for a task in doing list:
    let task = this.doing.find(i => i.id === id);
    if (task) {
      task.checked = !isChecked;
      task.changedDate = Date.now();
      // console.log("task.checked:" + task.checked);

      // replace a task in doing list with the new task above
      let index = this.doing.findIndex(i => i.id === id);
      if (index > -1) {
        this.doing[index] = task;
      } else {
        console.log("Task not found in doing list");
      }

      // add a task to done list if it's checked
      if (task.checked) {
        
        this.done.push(task);
        // remove task from doing list
        this.doing = this.doing.filter(i => i.id!== id);
      }

      //sort done list by checked status
      
      this.done.sort((a, b) => {
        if (a.changedDate === undefined) a.changedDate = Date.now();
        if (b.changedDate === undefined) b.changedDate = Date.now();
        return (a.changedDate > b.changedDate) ? -1 : 1;
      });

      //store to localStorage:
      localStorage.setItem('local_dones', JSON.stringify(this.done));
      localStorage.setItem('local_doings', JSON.stringify(this.doing));

    } 
  } else {
    //looking for a task in doing list:
    let task = this.doing.find(i => i.id === id);
    if (task) {
      task.checked = !isChecked;
      // replace a task in doing list with the new task above
      let index = this.doing.findIndex(i => i.id === id);
      if (index > -1) {
        this.doing[index] = task;
      } else {
        console.log("Task not found in doing list");
      }
    }
    this.dialog.open(ErrormsgComponent);
  }
  }

  async clickTodoChecked(isChecked: boolean | undefined, id: number) {
    console.log("isChecked=", isChecked);
    if (localStorage.getItem('flag') === 'true') {
    await new Promise(r => setTimeout(r, 1000));
    if (isChecked === undefined) {
      isChecked = false;
    }
    //looking for a task in doing list:
    let task = this.todo.find(i => i.id === id);
    if (task) {
      task.checked = !isChecked;
      // console.log("task.checked:" + task.checked);

      // replace a task in doing list with the new task above
      let index = this.todo.findIndex(i => i.id === id);
      if (index > -1) {
        this.todo[index] = task;
      } else {
        console.log("Task not found in doing list");
      }

      // add a task to done list if it's checked
      if (task.checked) {
        task.changedDate = Date.now();
        this.done.push(task);
        // remove task from doing list
        this.todo = this.todo.filter(i => i.id!== id);

        //sort done list by checked status
      
        this.done.sort((a, b) => {
          if (a.changedDate === undefined) a.changedDate = Date.now();
          if (b.changedDate === undefined) b.changedDate = Date.now();
          return (a.changedDate > b.changedDate) ? -1 : 1;
        });

        //store to localStorage:
        localStorage.setItem('local_dones', JSON.stringify(this.done));
        localStorage.setItem('local_todos', JSON.stringify(this.todo));

      }

      

    } 
  } else {
    //
    let task = this.todo.find(i => i.id === id);
    if (task) {
      task.checked = !isChecked;
      // replace a task in doing list with the new task above
      let index = this.todo.findIndex(i => i.id === id);
      if (index > -1) {
        this.todo[index] = task;
      } else {
        console.log("Task not found in doing list");
      }
    }
    //
    this.dialog.open(ErrormsgComponent);
  }
  }

  //
  textAreaTrim(text: string) : string {
    // get 100 characters from text
    return text.length > 300? text.substr(0, 300) + '...' : text;
  }

}
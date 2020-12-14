import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-enterexpense',
  templateUrl: './enterexpense.component.html',
  styleUrls: ['./enterexpense.component.scss']
})
export class EnterexpenseComponent implements AfterViewInit {

  public dataSource = {
    titles: [],
    values: []
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    //Query backend
    let params = new HttpParams();
    params = params.append('username', 'admin');
    this.http.get('http://localhost:3000/getexpense', {params: params})
    .subscribe((res: any) => {
      //Update dataSource based on results
      for (var i = 0; i < res.length; i++){
        this.dataSource.titles[i] = res[i].title;
        this.dataSource.values[i] = res[i].expense;
    }
      this.createTable();
    });
  }

  createTable() {
    //Clear div
    document.getElementById('expenseTable').innerHTML = "";
    //Prepare variables
    var tableDiv = document.getElementById('expenseTable');
    var createdTable = document.createElement('table');
    var createdTableBody = document.createElement('tbody');
    //Create elements and table from variables
    //Create table head
    var th = document.createElement('tr');
    var thd = document.createElement('th');
    thd.appendChild(document.createTextNode('Expense Title'));
    th.appendChild(thd);
    thd = document.createElement('th');
    thd.appendChild(document.createTextNode('Expense Value'));
    th.appendChild(thd);
    createdTableBody.appendChild(th);
    //Create table body
    for (var i = 0; i < this.dataSource.titles.length; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < 2; j++) {
        var td = document.createElement('td');
        if(j == 0){
          td.appendChild(document.createTextNode(this.dataSource.titles[i]));
        } else{
          td.appendChild(document.createTextNode(this.dataSource.values[i]));
        }
          tr.appendChild(td);
      }
      createdTableBody.appendChild(tr);
    }
    createdTable.appendChild(createdTableBody);
    tableDiv.appendChild(createdTable);
  }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-enterbudget',
  templateUrl: './enterbudget.component.html',
  styleUrls: ['./enterbudget.component.scss']
})

export class EnterbudgetComponent implements AfterViewInit {

  public dataSource = {
    ids: [],
    titles: [],
    values: []
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    //Query backend
    let params = new HttpParams();
    params = params.append('username', 'admin');
    this.http.get('http://localhost:3000/getbudget', {params: params})
    .subscribe((res: any) => {
      //Update dataSource based on results
      for (var i = 0; i < res.length; i++){
        this.dataSource.ids[i] = res[i].id;
        this.dataSource.titles[i] = res[i].title;
        this.dataSource.values[i] = res[i].budget;
    }
      this.createTable();
    });
  }

  createTable() {
    //Clear div
    document.getElementById('budgetTable').innerHTML = "";
    //Prepare variables
    var tableDiv = document.getElementById('budgetTable');
    var createdTable = document.createElement('table');
    var tableAttr = document.createAttribute('id');
    tableAttr.value = 'budgetTableTable';
    createdTable.setAttributeNode(tableAttr);
    var createdTableBody = document.createElement('tbody');
    //Create elements and table from variables
    //Create table head
    var th = document.createElement('tr');
    var thd = document.createElement('th');
    thd.appendChild(document.createTextNode('Budget Title'));
    th.appendChild(thd);
    thd = document.createElement('th');
    thd.appendChild(document.createTextNode('Budget Value'));
    th.appendChild(thd);
    thd = document.createElement('th');
    thd.appendChild(document.createTextNode('Delete'));
    th.appendChild(thd);
    createdTableBody.appendChild(th);
    //Create table body
    for (var i = 0; i < this.dataSource.titles.length; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < 3; j++) {
        var td = document.createElement('td');
        if(j == 0){
          td.appendChild(document.createTextNode(this.dataSource.titles[i]));
        } else if(j == 2){
          var delBox = document.createElement('input');
          var delBoxAttr = document.createAttribute('type');
          delBoxAttr.value = 'checkbox';
          delBox.setAttributeNode(delBoxAttr);
          delBoxAttr = document.createAttribute('id');
          delBoxAttr.value = this.dataSource.ids[i];
          delBox.setAttributeNode(delBoxAttr);
          td.appendChild(delBox);
        } else{
          td.appendChild(document.createTextNode(this.dataSource.values[i]));
        }
          tr.appendChild(td)
      }
      createdTableBody.appendChild(tr);
    }
    createdTable.appendChild(createdTableBody);
    tableDiv.appendChild(createdTable)
  }

  delbudget(){
    var table = (<HTMLTableElement>document.getElementById('budgetTableTable'));
    var needDeleted = [];
    for(var i = 1; i < (this.dataSource.ids.length + 1); i++){
      var row = table.rows[i];
      var cellCheckbox = row.cells[2].firstChild as HTMLInputElement;
      if(cellCheckbox.checked){
        //Delete through backend
        let params = new HttpParams();
        this.http.post('http://localhost:3000/delbudget', {
          "username": "admin",
          "id":cellCheckbox.id
        })
        .subscribe((res: any) => {
          //Respond based on response code if needed here
        });
      }
    }
    //Update table by reloading the page
    location.reload();
  }
}

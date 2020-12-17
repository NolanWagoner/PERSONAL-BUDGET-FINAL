import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
    this.http.get('http://localhost:3000/getbudget', { headers: headers})
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

  delBudget(){
    var table = (<HTMLTableElement>document.getElementById('budgetTableTable'));
    var needDeleted = [];
    for(var i = 1; i < (this.dataSource.ids.length + 1); i++){
      var row = table.rows[i];
      var cellCheckbox = row.cells[2].firstChild as HTMLInputElement;
      if(cellCheckbox.checked){
        //Delete through backend
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
        this.http.post('http://localhost:3000/delbudget', { "id":cellCheckbox.id }, {headers: headers})
        .subscribe((res: any) => {
          //Respond based on response code if needed here
        });
      }
    }
    //Update table by reloading the page
    location.reload();
  }

  submitBudget(){
    var budgetTitle = document.getElementById('budgetTitleInput') as HTMLInputElement;
    var budgetValue = document.getElementById('budgetValueInput') as HTMLInputElement;
    var errPara = document.getElementById('enterBudgetError') as HTMLParagraphElement;
    //Validate Input
    if(budgetTitle.value == ''){
      console.error('Enter a value for Budget Title/Category before submitting');
      errPara.innerHTML = 'Enter a value for Budget Title/Category before submitting';
      return;
    } else if(budgetValue.value == ''){
      console.error('Enter a value for Budget Value before submitting');
      errPara.innerHTML = 'Enter a value for Budget Value before submitting';
      return;
    }
    //Add to database through backend
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
    this.http.post('http://localhost:3000/postbudget', {
      'title': budgetTitle.value,
      'budget': budgetValue.value
    }, {headers: headers})
    .subscribe((res: any) => {
      //Respond based on response code if needed here
    });
    location.reload();
  }
}

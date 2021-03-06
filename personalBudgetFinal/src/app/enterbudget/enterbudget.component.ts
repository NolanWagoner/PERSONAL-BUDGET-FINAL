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
    this.http.get('http://64.225.61.205:3000/getbudget', { headers: headers})
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
      if((i%2) == 0){
        var evenRowAttr = document.createAttribute('class');
        evenRowAttr.value = 'even-row';
        tr.setAttributeNode(evenRowAttr);
      } else{
        var oddRowAttr = document.createAttribute('class');
        oddRowAttr.value = 'odd-row';
        tr.setAttributeNode(oddRowAttr);
      }
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
        this.http.post('http://64.225.61.205:3000/delbudget', { "id": parseInt(cellCheckbox.id) }, {headers: headers})
        .subscribe((res: any) => {
          //Update table by reloading the page
          location.reload();
        });
      }
    }
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
    } else if(this.dataSource.titles.indexOf(budgetTitle.value) != -1){
      console.error('A budget entry with that title already exists');
      errPara.innerHTML = 'A budget entry with that title already exists';
      return;
    } else if(budgetTitle.value.length < 1){
      console.error('Budget title too short');
      errPara.innerHTML = 'Please enter a budget title longer than one character';
      return;
    } else if(budgetTitle.value.length > 25){
      console.error('Budget title too long');
      errPara.innerHTML = 'Please enter a budget title shorter than 120 characters';
      return;
    } else if(parseFloat(budgetValue.value) < 0){
      console.error('Budget value cannot be less than 0');
      errPara.innerHTML = 'Please enter a budget title that is greater than 0';
      return;
    } else if(parseFloat(budgetValue.value) > 99999999999999999999){
      console.error('Budget value cannot be more than 20 digits');
      errPara.innerHTML = 'Please enter a budget value that is less than 20 digits long';
      return;
    }
    //Add to database through backend
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
    this.http.post('http://64.225.61.205:3000/postbudget', {
      'title': budgetTitle.value,
      'budget': parseFloat(budgetValue.value)
    }, {headers: headers})
    .subscribe((res: any) => {
      location.reload();
    });
  }
}

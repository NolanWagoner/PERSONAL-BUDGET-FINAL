import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-enterexpense',
  templateUrl: './enterexpense.component.html',
  styleUrls: ['./enterexpense.component.scss']
})
export class EnterexpenseComponent implements AfterViewInit {

  public dataSource = {
    ids: [],
    titles: [],
    values: [],
    budgetTitles: []
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    //Query backend
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
    this.http.get('http://localhost:3000/getexpense', {headers: headers})
    .subscribe((res: any) => {
      //Update dataSource based on results
      for (var i = 0; i < res.length; i++){
        this.dataSource.ids[i] = res[i].id;
        this.dataSource.titles[i] = res[i].title;
        this.dataSource.values[i] = res[i].expense;
      }
    });

    //Query backend for budget titles
    this.http.get('http://localhost:3000/getbudget', {headers: headers})
    .subscribe((res: any) => {
      //Update dataSource based on results
      for (var i = 0; i < res.length; i++){
        this.dataSource.budgetTitles[i] = res[i].title;
      }
      this.createTable();
      this.populateExpenseTitleDropdown();
    });
  }

  createTable() {
    //Clear div
    document.getElementById('expenseTable').innerHTML = "";
    //Prepare variables
    var tableDiv = document.getElementById('expenseTable');
    var createdTable = document.createElement('table');
    var tableAttr = document.createAttribute('id');
    tableAttr.value = 'expenseTableTable';
    createdTable.setAttributeNode(tableAttr);
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
          tr.appendChild(td);
      }
      createdTableBody.appendChild(tr);
    }
    createdTable.appendChild(createdTableBody);
    tableDiv.appendChild(createdTable);
  }

  delExpense(){
    var table = (<HTMLTableElement>document.getElementById('expenseTableTable'));
    var needDeleted = [];
    for(var i = 1; i < (this.dataSource.ids.length + 1); i++){
      var row = table.rows[i];
      var cellCheckbox = row.cells[2].firstChild as HTMLInputElement;
      if(cellCheckbox.checked){
        //Delete through backend
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
        this.http.post('http://localhost:3000/delexpense', {
          "id": parseInt(cellCheckbox.id)
        }, {headers: headers})
        .subscribe((res: any) => {
        });
      }
    }
    //Update table by reloading the page
    location.reload();
  }

  submitExpense(){
    var expenseTitle = document.getElementById('expenseTitleInput') as HTMLInputElement;
    var expenseValue = document.getElementById('expenseValueInput') as HTMLInputElement;
    var errPara = document.getElementById('enterExpenseError') as HTMLParagraphElement;
    //Validate Input
    if(expenseTitle.value == '' || expenseTitle.value == 'default'){
      console.error('Enter a value for Expense Title/Category before submitting');
      errPara.innerHTML = 'Enter a value for Expense Title/Category before submitting';
      return;
    } else if(expenseValue.value == ''){
      console.error('Enter a value for Expense Value before submitting');
      errPara.innerHTML = 'Enter a value for Expense Value before submitting';
      return;
    } else if(this.dataSource.titles.indexOf(expenseTitle.value) != -1){
      console.error('An expense entry with that title already exists');
      errPara.innerHTML = 'An expense entry with that title already exists';
      return;
    } else if(parseFloat(expenseValue.value) < 0){
      console.error('Expense value cannot be less than 0');
      errPara.innerHTML = 'Please enter a expense title that is greater than 0';
      return;
    } else if(parseFloat(expenseValue.value) > 99999999999999999999){
      console.error('Expense value cannot be more than 20 digits');
      errPara.innerHTML = 'Please enter a expense value that is less than 20 digits long';
      return;
    }
    //Add to database through backend
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
    this.http.post('http://localhost:3000/postexpense', {
      'title': expenseTitle.value,
      'expense': parseFloat(expenseValue.value)
    }, {headers: headers})
    .subscribe((res: any) => {
    });
    location.reload();
  }

  populateExpenseTitleDropdown(){
    for(var i = 0; i < this.dataSource.budgetTitles.length; i++){
      if(this.dataSource.titles.indexOf(this.dataSource.budgetTitles[i]) == -1){
        var titleSelect = document.getElementById('expenseTitleInput') as HTMLInputElement;
        var titleOption = document.createElement('option');
        titleOption.value = this.dataSource.budgetTitles[i];
        titleOption.innerHTML = this.dataSource.budgetTitles[i];
        titleSelect.appendChild(titleOption);
      }
    }
  }
}

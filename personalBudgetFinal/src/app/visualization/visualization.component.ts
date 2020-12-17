import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ChartDataSets, ChartOptions, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements AfterViewInit {

  public dataSource = {
    budgetTitles: [],
    budgetValues: [],
    expenseTitles: [],
    expenseValues: [],
    orderedExpenseValues: []
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    //Query backend for budget data
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('access_token'));
    this.http.get('http://localhost:3000/getbudget', {headers: headers})
    .subscribe((res: any) => {
      //Update dataSource based on results
      for (var i = 0; i < res.length; i++){
        this.dataSource.budgetTitles[i] = res[i].title;
        this.dataSource.budgetValues[i] = res[i].budget;
      }
    });
    //Query backend for expense data
    this.http.get('http://localhost:3000/getexpense', {headers: headers})
    .subscribe((res: any) => {
      //Update dataSource based on results
      for (var i = 0; i < res.length; i++){
        this.dataSource.expenseTitles[i] = res[i].title;
        this.dataSource.expenseValues[i] = res[i].expense;
      }
    });
    setTimeout(() => {  this.orderExpense(); }, 400);
  }

  //START OF BAR CHART SPECIFIC DATA
  public barChartOptions: ChartOptions = {
    responsive: true,
    // unused structures (for dynamic theming)
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  //Bar Chart Labels, type definition, legend boolean, data location definition, colors
  public barChartLabels: Label[] = this.dataSource.budgetTitles;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: this.dataSource.budgetValues, label: 'Budget' },
    { data: this.dataSource.orderedExpenseValues, label: 'Expense' }
  ];
  public barChartColors: Array<any> = [
    { backgroundColor: '#de6a61' },
    { backgroundColor: '#1d3d58' },
  ]
  //END OF BAR CHART SPECIFIC DATA

  //START OF RADIAL CHART SPECIFIC DATA
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = this.dataSource.budgetTitles;

  public radarChartData: ChartDataSets[] = [
    { data: this.dataSource.budgetValues, label: 'Budget' },
    { data: this.dataSource.orderedExpenseValues, label: 'Expense' }
  ];
  public radarChartType: ChartType = 'radar';
  public radarChartColors: Array<any> = [
    {
      backgroundColor: '#de6a6180',
      borderColor: '#de6a61',
      pointBackgroundColor: '#de6a61'
    },
    {
      backgroundColor: '#1d3d5880',
      borderColor: '#1d3d5899',
      pointBackgroundColor: '#1d3d58'
    }
  ]
  //END OF RADIAL CHART SPECIFIC DATA

  //START OF PIE CHART SPECIFIC DATA
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
  };
  public pieChartLabels: Label[] = this.dataSource.budgetTitles;
  public pieChartData: number[] = this.dataSource.budgetValues;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        '#1d3d58', '#de6a61', '#f4834c', '#b0a1b4', '#d2ebd8', '#b1becd', '#97e5d7', '#ffdfd3', '#ff6961',
        '#bdb0d0', '#2d7f9d', '#ae8094', '#129a7d', '#e7bdb3', '#f0d774', '#5784ba', '#8da47e', '#77dd77',
        '#1d3d58', '#de6a61', '#f4834c', '#b0a1b4', '#d2ebd8', '#b1becd', '#97e5d7', '#ffdfd3', '#ff6961',
        '#bdb0d0', '#2d7f9d', '#ae8094', '#129a7d', '#e7bdb3', '#f0d774', '#5784ba', '#8da47e', '#77dd77',
        '#1d3d58', '#de6a61', '#f4834c', '#b0a1b4', '#d2ebd8', '#b1becd', '#97e5d7', '#ffdfd3', '#ff6961',
        '#bdb0d0', '#2d7f9d', '#ae8094', '#129a7d', '#e7bdb3', '#f0d774', '#5784ba', '#8da47e', '#77dd77'
      ]
    },
  ];
  //END OF PIE CHART SPECIFIC DATA

  //All chart events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  //Oder the expenses in the same way as the budget
  orderExpense(){
    //Oder the expenses in the same way as the budget
    var orderedExpense = [];
    for (var i = 0; i < this.dataSource.budgetTitles.length; i++){
      var locationOfI = this.dataSource.expenseTitles.indexOf(this.dataSource.budgetTitles[i])
      if(locationOfI == -1){
        orderedExpense.push(0);
      } else{
        orderedExpense.push(this.dataSource.expenseValues[locationOfI]);
      }
    }
    //Set dataSource and chart based off of ordered data
    this.dataSource.orderedExpenseValues = orderedExpense;
    this.barChartData[1].data = this.dataSource.orderedExpenseValues;
    this.radarChartData[1].data = this.dataSource.orderedExpenseValues;
  }

}

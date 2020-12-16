import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnterbudgetComponent } from './enterbudget/enterbudget.component';
import { EnterexpenseComponent } from './enterexpense/enterexpense.component';
import { FooterComponent } from './footer/footer.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MenuComponent,
    DashboardComponent,
    EnterbudgetComponent,
    EnterexpenseComponent,
    FooterComponent,
    VisualizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

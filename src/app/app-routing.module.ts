import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsComponent } from './bills/bills.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';


const routes: Routes = [
  {path: '', redirectTo: 'bills', pathMatch:"full"},
  {path: "bills", component: BillsComponent},
  {path: "bills/:id", component: BillDetailsComponent},
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routeComponents =[BillsComponent,BillDetailsComponent, PageNotFoundComponent]

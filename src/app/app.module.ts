import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routeComponents } from './app-routing.module';
import { FormModalComponent } from './form-modal/form-modal.component';
import { BillTypesService } from './bill-types.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    routeComponents,
    FormModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [BillTypesService],
  bootstrap: [AppComponent]
})
export class AppModule { }

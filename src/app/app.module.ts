import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { HomeComponent } from './Pages/home/home.component';
import { MessageTestComponent } from './Pages/message-test/message-test.component';
import { WhatsappFormatGuideComponent } from './Components/whatsapp-format-guide/whatsapp-format-guide.component';
import { InformationComponent } from './Components/information/information.component';
import { MasiveSendFormComponent } from './Components/masive-send-form/masive-send-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    MessageTestComponent,
    WhatsappFormatGuideComponent,
    InformationComponent,
    MasiveSendFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

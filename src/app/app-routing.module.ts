import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { MessageTestComponent } from './Pages/message-test/message-test.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'message-test', component: MessageTestComponent},
  {path:"", pathMatch:"full", redirectTo:"home"},
  {path: '**', pathMatch: 'full', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

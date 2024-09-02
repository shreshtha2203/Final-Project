// import { AuthGuard } from './guards/auth-guard.guard';
import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { ChatbotpageComponent } from './chatbotpage/chatbotpage.component';


const routes: Routes = [
  {path:'login', component: LoginpageComponent},
  {path:'website',component: ChatbotpageComponent},
  {path:'',redirectTo: '/website',pathMatch:'full'}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

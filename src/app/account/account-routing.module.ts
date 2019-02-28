import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterExternalComponent } from './register/register-external.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const accountRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'registerexternal/:provider/:providerKey', component: RegisterExternalComponent },
    { path: 'thank-you/:email', component: ThankYouComponent }
];

@NgModule({
    imports: [RouterModule.forChild(accountRoutes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }

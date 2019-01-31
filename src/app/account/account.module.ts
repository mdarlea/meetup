import { NgModule } from '@angular/core';
import { AccountService } from './shared/account.service';
import { ExternalLoginCallbackComponent} from './external-login-callback/external-login-callback.component';
import { PassResetComponent } from './login/pass-reset.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterExternalComponent } from './register/register-external.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [        
        AccountRoutingModule,
        SharedModule
    ],
    declarations: [
        ExternalLoginCallbackComponent,
        PassResetComponent,
        LoginComponent,
        RegisterComponent,
        RegisterExternalComponent,
        ThankYouComponent],
    providers: [
        AccountService
    ]
})
export class AccountModule { }

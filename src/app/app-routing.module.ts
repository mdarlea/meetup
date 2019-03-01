import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    {
      path: 'account',
      loadChildren: 'app/account/account.module#AccountModule'
    },
    {
      path: 'meetings',
      loadChildren: 'app/meetings/meetings.module#MeetingsModule',
      canLoad: [AuthGuard]
    },
    {
      path: 'dashboard',
      loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
      canLoad: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }

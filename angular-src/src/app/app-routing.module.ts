import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'authenticate', loadChildren: () => import('./authentication/authentication-routing.module').then(module => module.AuthenticationRouting) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-routing.module').then(module => module.DashboardRouting) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard } from "../authentication/authentication.guard";
import { DashboardComponent } from "./dashboard.component";
import { VaccineManagementComponent } from "./vaccine-management/vaccine-management.component";

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthenticationGuard], children: [
        { path: '', redirectTo: 'vaccine-management' },
        { path: 'vaccine-management', component: VaccineManagementComponent }
    ] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRouting {}
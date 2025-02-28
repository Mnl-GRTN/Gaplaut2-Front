import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { AuthComponent } from './public/pages/auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { TestComponent } from './private/pages/test/test.component';
import { DashboardComponent } from './private/pages/dashboard/dashboard.component';
import { CentresPanelComponent } from './private/components/centres-panel/centres-panel.component';
// import { ConfigPanelComponent } from './private/pages/config-panel/config-panel.component';
// import { MyCentrePanelComponent } from './private/pages/my-centre-panel/my-centre-panel.component';
// import { PlanningPanelComponent } from './private/pages/planning-panel/planning-panel.component';

export const routes: Routes = [

    { path: "home" , component: HomeComponent },
    { path: "login" , component: AuthComponent },
    { path: "test", component: TestComponent, canActivate: [AuthGuard] },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'centres', component: CentresPanelComponent, data: { roles: ['ROLE_superadmin'] } },
        //   { path: 'config', component: ConfigPanelComponent, data: { roles: ['ROLE_superadmin'] } },
        //   { path: 'my-centre', component: MyCentrePanelComponent, data: { roles: ['ROLE_admin'] } },
        //   { path: 'planning', component: PlanningPanelComponent, data: { roles: ['ROLE_admin', 'ROLE_medecin'] } },
          { path: '', redirectTo: 'centres', pathMatch: 'full' } // Default route for dashboard
        ]
      },
    { path: "**" , redirectTo: "/home" }, // Redirect to home if the route doesn't exist
    { path: "" , redirectTo: "/home" , pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

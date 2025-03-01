import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { AuthComponent } from './public/pages/auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './private/pages/dashboard/dashboard.component';
import { CentresPanelComponent } from './private/pages/centres-panel/centres-panel.component';
import { ConfigPanelComponent } from './private/pages/config-panel/config-panel.component';
import { WelcomeBoardComponent } from './private/pages/welcome-board/welcome-board.component';
import { MyCenterPanelComponent } from './private/pages/my-center-panel/my-center-panel.component';
import { PlanningPanelComponent } from './private/pages/planning-panel/planning-panel.component';

export const routes: Routes = [

    { path: "home" , component: HomeComponent },
    { path: "login" , component: AuthComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'centres', component: CentresPanelComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_superadmin'] } },
          { path: 'config', component: ConfigPanelComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_superadmin'] } },
          { path: 'my-centre', component: MyCenterPanelComponent, canActivate:[AuthGuard], data: { roles: ['ROLE_admin'] } },
          { path: 'planning', component: PlanningPanelComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_admin', 'ROLE_doctor'] } },
          { path: '', component: WelcomeBoardComponent, pathMatch: 'full' } // Default route for dashboard
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

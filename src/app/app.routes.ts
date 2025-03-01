import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { AuthComponent } from './public/pages/auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { TestComponent } from './private/pages/test/test.component';
import { DashboardComponent } from './private/pages/dashboard/dashboard.component';
import { CentresPanelComponent } from './private/components/centres-panel/centres-panel.component';
import { ConfigPanelComponent } from './private/components/config-panel/config-panel.component';
import { WelcomeBoardComponent } from './private/components/welcome-board/welcome-board.component';
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
          { path: 'centres', component: CentresPanelComponent, canActivate: [AuthGuard] },
          { path: 'config', component: ConfigPanelComponent, canActivate: [AuthGuard] },
        //   { path: 'my-centre', component: MyCentrePanelComponent, data: { roles: ['ROLE_admin'] } },
        //   { path: 'planning', component: PlanningPanelComponent, data: { roles: ['ROLE_admin', 'ROLE_medecin'] } },
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

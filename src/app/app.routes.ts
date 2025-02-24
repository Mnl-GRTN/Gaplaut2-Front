import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { AuthComponent } from './public/pages/auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { TestComponent } from './private/pages/test/test.component';

export const routes: Routes = [

    { path: "home" , component: HomeComponent },
    { path: "login" , component: AuthComponent },
    { path: "test", component: TestComponent, canActivate: [AuthGuard] },
    { path: "**" , redirectTo: "/home" }, // Redirect to home if the route doesn't exist
    { path: "" , redirectTo: "/home" , pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

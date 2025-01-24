import { Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { VaccinationCenterComponent } from './vaccination-center/vaccination-center.component';
import { VaccinationCenterListComponent } from './vaccination-center-list/vaccination-center-list.component';

export const routes: Routes = [

    { path: "first" , component: FirstComponent },
    { path: "second/:id" , component: SecondComponent },
    { path: "centers", component: VaccinationCenterListComponent },
    { path : "centers/detail/:id", component: VaccinationCenterComponent},
    { path: "" , redirectTo: "/centers" , pathMatch: "full" }
];

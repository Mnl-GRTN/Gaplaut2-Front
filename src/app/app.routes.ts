import { Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { VaccinationCenterComponent } from './vaccination-center/vaccination-center.component';
import { VaccinationCenterListComponent } from './vaccination-center-list/vaccination-center-list.component';
import { SearchCenterComponent } from './components/search-center/search-center.component';

export const routes: Routes = [

    { path: "first" , component: FirstComponent },
    { path: "second/:id" , component: SecondComponent },
    { path: "centers", component: VaccinationCenterListComponent },
    { path : "centers/detail/:id", component: VaccinationCenterComponent},
    { path: "search" , component: SearchCenterComponent },
    { path: "" , redirectTo: "/search" , pathMatch: "full" }
];

import { Routes } from '@angular/router';
import { KitchenComponent } from './pages/food/kitchen/kitchen.component';
import { CustomersComponent } from './pages/food/customers/customers.component';

export const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'kitchen', component: KitchenComponent },
];

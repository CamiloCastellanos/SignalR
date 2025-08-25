import { Routes } from '@angular/router';
import { KitchenComponent } from './pages/food/kitchen/kitchen.component';
import { CustomersComponent } from './pages/food/customers/customers.component';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'kitchen', component: KitchenComponent },
  { path: 'chat', component: ChatComponent },
  { path: '**', component: HomeComponent },
  { path: '', component: HomeComponent },
];

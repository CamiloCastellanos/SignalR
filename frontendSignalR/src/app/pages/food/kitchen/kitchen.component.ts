import { DatePipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, Subscription } from 'rxjs';
//Project
import { Order, OrderState } from '../../../model/data-food';
import { FoodRealtimeClientService } from '../../../services/food-realtime-client.service';
import { environment } from '../../../../environment/environment';

@Component({
    selector: 'app-kitchen',
    imports: [
        ReactiveFormsModule,
        JsonPipe,
        DatePipe,
        FormsModule,
    ],
    templateUrl: './kitchen.component.html',
    styleUrl: './kitchen.component.css'
})
export class KitchenComponent {

  foodStates = ['Ordered', 'Preparing', 'AwaitingDelivery', 'Completed'];
  orderSubscription: Subscription | undefined;
  orders = signal<Order[]>([]);

  constructor(private realtime: FoodRealtimeClientService, private http: HttpClient) {
    this.realtime.connect();
  }

  async ngOnInit() {
    // Load exisiting orders (static data)
    let existingOrders = await firstValueFrom(this.http.get<Array<Order>>(environment.methodGetOrders));
    this.orders.set([...existingOrders]);
    /// Subscribe to future order updates
    this.orderSubscription = this.realtime.ordersUpdated$.subscribe(orders => this.orders.set([...orders]));
  }

  async updateState(id: number, $event: Event) {
    let value = ($event.target as HTMLSelectElement)?.value; // Get the text from the control
    await this.realtime.updateFoodItem(id, value as OrderState); // Set the new enum value
  }
}

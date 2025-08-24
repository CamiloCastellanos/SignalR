import { Component, signal } from '@angular/core';
import { firstValueFrom, Subscription } from "rxjs";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { JsonPipe, NgOptimizedImage } from '@angular/common';

// Project
import { FoodRealtimeClientService } from '../../../services/food-realtime-client.service';
import { FoodItem, Order } from '../../../model/data-food';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgOptimizedImage,
    JsonPipe,
    FormsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  availableFood = signal<Array<FoodItem>>([]);
  activeOrders = signal<Array<Order>>([]);
  activeOrdersSubscription?: Subscription;
  showActiveOrders = false;
  tableNumber?: number;

  constructor(private realtime: FoodRealtimeClientService, private http: HttpClient) {
    this.realtime.connect();
  }

  ngOnDestroy(): void {
    this.activeOrdersSubscription?.unsubscribe();
  }

  async ngOnInit() {
    let food = await firstValueFrom(this.http.get<Array<FoodItem>>(environment.methodGetFood));
    this.availableFood.set([...food]);

    let orders = await firstValueFrom(this.http.get<Array<Order>>(environment.methodGetOrders));
    this.activeOrders.set([...orders]);

    this.activeOrdersSubscription = this.realtime.ordersUpdated$.subscribe(orders => {
      this.activeOrders.set([...orders]);
    });
  }

  async sendOrder(foodId: number, tableNumber: number) {
    await this.realtime.orderFoodItem(foodId, tableNumber);
  }

  showActiveOrdersToggle() {
    this.showActiveOrders = !this.showActiveOrders;
  }

}

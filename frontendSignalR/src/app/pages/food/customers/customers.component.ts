import { Component, signal } from '@angular/core';
import { firstValueFrom, Subscription } from "rxjs";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

// Project
import { FoodRealtimeClientService } from '../../../services/food-realtime-client.service';
import { FoodItem, Order } from '../../../model/data-food';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-customers',
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  availableFood = signal<Array<FoodItem>>([]);
  activeOrders = signal<Array<Order>>([]);
  activeOrdersSubscription?: Subscription;
  showActiveOrders = false;
  tableNumber?: number;
  showAlert: boolean = false;

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
    debugger;
    this.showAlert = true;

    // Ocultar después de 3 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  showActiveOrdersToggle() {
    this.showActiveOrders = !this.showActiveOrders;
  }

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}

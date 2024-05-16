import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedTicketService {
  private cantTicketsSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  cantTickets$: Observable<number | null> = this.cantTicketsSubject.asObservable();

  setCantTickets(cantTickets: number) {
    this.cantTicketsSubject.next(cantTickets);
  }
}
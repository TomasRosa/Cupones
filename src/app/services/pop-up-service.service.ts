// pop-up.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService<T = any> {
  private isOpenSubject = new BehaviorSubject<number>(0);
  isOpen$ = this.isOpenSubject.asObservable();

  open() {
    this.isOpenSubject.next(this.isOpenSubject.value + 1);
  }

  close() {
    const newValue = this.isOpenSubject.value - 1;
    this.isOpenSubject.next(newValue >= 0 ? newValue : 0);
  }
}
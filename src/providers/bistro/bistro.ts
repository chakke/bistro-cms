import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BistroProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BistroProvider {
  mRestaurantID: string = "bistro";
  constructor(public http: HttpClient) {

  }

  public getCurrentRestaurantID(): string {
    return this.mRestaurantID;
  }

}

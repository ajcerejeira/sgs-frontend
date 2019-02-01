import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Data {
  items: any;

  constructor(public http: Http) { }

  filterVehicles(searchTerm, list) {
    if (searchTerm && searchTerm != "") {
      this.items = list;
      return this.items.filter((item) => {
        return (item.meta['register'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (item.meta['make'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });
    }
    else {
      return list;
    }
  }

  filterAccidents(searchTerm, list) {
    if (searchTerm && searchTerm != "") {
      this.items = list;
      return this.items.filter((item) => {
        return (item['address'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item['date'].split('T')[0].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });
    }
    else {
      return list;
    }
  }
}

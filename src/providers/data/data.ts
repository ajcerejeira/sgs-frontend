import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Data {

    items: any;

    constructor(public http: Http) {
    }

    filterItems(searchTerm, list){
      if(searchTerm != "") {
        this.items = list;
        return this.items.filter((item) => {
            return item.register.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     
      }
      else {
        return list;
      }
    }

}
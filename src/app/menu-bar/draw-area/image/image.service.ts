import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ImageService {

  constructor(private http: Http) { }

  get() {
      return this.http.get('assets/darth_1.svg').toPromise();
  }
}

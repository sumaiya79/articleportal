import { Injectable } from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class SerCreateService {


  body;
  headers;
  url;

  constructor(private _http: Http) { }

  getExistTitle(title): Observable <any>{
    this.url = 'http://localhost:3000/users/getArticleTitle?title='+title;
    return this._http.get(this.url).map((response: Response) => response.json());

}

  createArticle(fd: any) : Observable<any>{
    console.log(fd.get('image'));
    this.body = {title: fd.get('title'), description: fd.get('description'), publishdate: fd.get('publishdate'), image: fd.get('image')};
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/users/createArticle', this.body, {
      headers: this.headers
    }).map(res => res.json());
  }

}

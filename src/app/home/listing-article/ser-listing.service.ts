import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SerListingService {

  url;
  headers;
  body;

  constructor(private _http: Http) { }

  getImage(){
    this.url = 'http://localhost:3000/users/getImage';
    return this._http.get(this.url).map((response: Response) => response.json());
  }

  getArticles() {
   try{ this.url = 'http://localhost:3000/users/getAllArticles';
     return this._http.get(this.url).map((response: Response) => response.json());}
  catch(e){
     console.log(e);
  }
  }

  getArticleById(id) {
    this.url = 'http://localhost:3000/users/getArticleById?id='+id;
    return this._http.get(this.url).map((response: Response) => response.json());
  }

  getExistTitle(title) {
    this.url = 'http://localhost:3000/users/getArticleTitle?title='+title;
    return this._http.get(this.url).map((response: Response) => response.json());
  }


  deleteArticle(id){
    console.log(id);
    this.url = 'http://localhost:3000/users/deleteArticle?id='+id;
    return this._http.delete(this.url).map((response : Response) => response.json());
  }

  deleteImage(image){
    console.log("Image: "+image);
    this.url = 'http://localhost:3000/users/deleteImage?image='+image;
    return this._http.delete(this.url).map((response : Response) => response.json());
  }

  updateArticle(article, id){
    this.body = {title: article.title, description: article.description, publishdate: article.publishdate, image: article.image};
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.url = 'http://localhost:3000/users/updateArticle?id='+id;
    return this._http.put(this.url, this.body, this.headers).map((response: Response) => response.json());
  }

  updateImage(prev_image, new_image){
    this.body = {new_image: new_image, prev_image: prev_image};
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.url = 'http://localhost:3000/users/updateImage?new_image='+new_image+'&prev_image='+prev_image;
    return this._http.put(this.url, this.body, this.headers).map((response: Response) => response.json());
  }
}

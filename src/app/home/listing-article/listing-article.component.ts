import {Component, OnInit} from '@angular/core';
import {SerListingService} from './ser-listing.service';
import * as $ from 'jquery';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:3000/users/upload_image';

@Component({
  selector: 'app-listing-article',
  templateUrl: './listing-article.component.html',
  styleUrls: ['./listing-article.component.css']
})


export class ListingArticleComponent implements OnInit {

  array: any = [];
  array_date: any = [];
  article: any = {title: '', description: '', publishdate: '', image: ''};

  d: any;
  dd: any;
  data: any = [];

  exist: boolean;
  empty: boolean = false;
  error_msg: string;
  error_res;

  disable_alert: boolean = false;
  delete_error: boolean = false;

  head: string;

  load: boolean = true;

  id: string;
  image_name: string;
  image_preview: boolean;
  image_array: any = [];
  image_error: string;
  imageError: boolean;
  input_date: any = [];
  m: any;
  mm: any;
  resMsg;

  path = 'http://localhost:3000/static/uploads/';
  publishError;
  publish_error;

  selectedfile: any;
  resCode;

  title_error: boolean = false;
  today: any;

  url: string;
  update_error: boolean = false;
  update_success: boolean = false;
  update_msg: string;
  update_refresh: string;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'photo',
    allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']
  });

  view_title: string;
  view_description;
  view: any = [];

  warning_msg: string;
  warning: boolean;

  y: any;
  yyyy: any;

  constructor(private _httpService: SerListingService) {
  }


  ngOnInit() {
    //uploads an image if changed in update form using ng2 File Selector

    $('html').bind('keypress', function (e) {
      if (e.keyCode == 13) {
        return false;
      }
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    };

    //Api to get all articles from database and stores it in an array, shows a prompt if no article is to
    //display due to server error or no data being added yet.

    try {
      this._httpService.getArticles().subscribe(
        data => {

          this.data = data;
          this.resCode = this.data.status;
          this.resMsg = this.data.message;
          this.array = this.data.data;

          if (this.array.length == 0) {
            this.load = false;
            this.empty = true;
            this.error_msg = 'No article to display, please create an article first.';
          } else {
            this.empty = false;
          }
        },
        error => {
          this.load = false;
          this.empty = true;
          this.error_msg = 'An error occured from the server: ' + error;
        },
        () => {
          this.load = false;
        }
      );
    }
    catch(e){
      console.log(e);
    }
  }

  readUrl(event: any) {
    this.selectedfile = event.target.files[0];
    if (this.selectedfile !== undefined) {
    }
    if (this.selectedfile.type.includes('image')) {
      this.image_preview = true;
      this.image_array = this.selectedfile.name.split('.');
      this.image_name = this.image_array[0] + '-' + Date.now() + '.' + this.image_array[1];
      this.article.image = this.image_name;
      this.disable_alert = false;
      this.imageError = false;

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
          this.url = (<FileReader>event.target).result;

        };
        reader.readAsDataURL(event.target.files[0]);

      }
    } else {
      this.image_preview = false;
      this.url = '';
      this.imageError = true;
      this.image_error = 'Invalid image type selected, please select image type only!';
      this.disable_alert = true;
    }
  }


  deleteArticle(article) {
    this.id = article.id;
  }

  //deletes an article when 'yes' button is selected from delete modal, deletes a record from database and
  //from the screen using delete api and splice respectively.

  yesDelete() {

    this.head = 'Delete Article Alert!';
    for (let i = 0; i < this.array.length; i++) {
      if (this.id == this.array[i].id) {
        this.image_name = this.array[i].image;

        this._httpService.deleteArticle(this.id).subscribe(
          data => console.log(),
          error => {
            document.getElementById('wait').style.display = 'none';
            this.update_success = false;
            this.update_error = true;
            this.update_msg = 'Deletion Failed!' + error;
          },
          () => {
            this._httpService.deleteImage(this.image_name).subscribe(
              data => console.log(),
              error => {
              },
              () => {
              }
            );
            document.getElementById('wait').style.display = 'none';
            this.update_error = false;
            this.update_success = true;
            this.update_msg = 'Success! Article has been deleted successully!';
            this.array.splice(i, 1);
          }
        );
      }
    }
  }

  //fetches article's detail and displays it in detail modal.
  detailArticle(article) {

    this._httpService.getArticleById(article.id).subscribe(
      data => {
        this.view = data;
      },
      error => {
        document.getElementById('wait_detail').style.display = 'none';
        this.view_title = '';
        this.view_description = 'Error: ' + error;
      },
      () => {
        document.getElementById('wait_detail').style.display = 'none';
        this.view_title = this.view.title;
        this.view_description = this.view.description;
      }
    );
  }

  //update => 2 step updation, opens up a modal and fetches data in input field any field left null will resume
  //with its previous value, user can update any attribute and press 'yes' to forward the effect.

  updateArticle(article) {

    this.id = article.id;
    this._httpService.getArticleById(article.id).subscribe(
      data => this.view = data,
      error => {
        this.warning = true;
        this.delete_error = true;
        this.warning_msg = 'Error: ' + error;
        document.getElementById('yes').style.display = 'none';
        document.getElementById('no').style.display = 'none';
        document.getElementById('alert').style.backgroundColor = 'red';
        document.getElementById('alert').style.color = 'lightgrey';

      },
      () => {
        (<HTMLInputElement>document.getElementById('title')).value = this.view.title;
        (<HTMLInputElement>document.getElementById('desc')).value = this.view.description;
        this.array_date = this.view.publishdate.split(/[- T]+/);

        this.image_preview = true;
        this.url = 'http://localhost:3000/static/uploads/' + this.view.image;

        this.d = new Date();
        this.y = parseInt(this.array_date[0]);
        this.m = parseInt(this.array_date[1]);

        this.dd = parseInt(this.array_date[2]);
        this.d.setUTCFullYear(this.y, this.m - 1, this.dd);
        (<HTMLInputElement>document.getElementById('publishdate')).valueAsDate = this.d;

      }
    );


    if (this.article.title === '' || this.article.title === undefined || this.article.title === null ||
      this.article.description === '' || this.article.description === undefined || this.article.description === null ||
      this.article.publishdate === '' || this.article.publishdate === undefined || this.article.publishdate === null) {
      this.warning = true;
      this.warning_msg = 'Fields without any value will be restored to previous one.';
    }
  }

  //to validate if title exists. If title is replaced by the same title, no api will be executed.
  validateTitle(): boolean {

    if (this.view.title === this.article.title) {
      console.log('values same!');
      return true;
    } else {
      this._httpService.getExistTitle(this.article.title).subscribe(
        data => {
          this.exist = data.exist;
        },
        error => {
          console.log('error!');
        },
        () => {
          if (this.exist == false) {
            this.title_error = false;
            this.exist = false;
            this.disable_alert = false;
          } else {
            this.title_error = true;
            this.exist = true;
            this.disable_alert = true;
          }
        }
      );
      return this.exist;
    }
  }

  //to validate entered date to be within specified limits, i.e. article's date of publish should not be greater
  //than today's date.
  validateDate(): boolean {

    this.publish_error = '';
    this.publishError = false;
    this.today = new Date();
    this.dd = this.today.getDate();
    this.mm = this.today.getMonth() + 1;
    this.yyyy = this.today.getFullYear();

    if (this.dd < 10) {
      this.dd = '0' + this.dd;
    }
    if (this.mm < 10) {
      this.mm = '0' + this.mm;
    }
    this.today = this.yyyy + '-' + this.mm + '-' + this.dd;

    this.array_date = this.article.publishdate.split('-');
    this.input_date = this.array_date[0] + '-' + this.array_date[1] + '-' + this.array_date[2];

    if (this.input_date > this.today) {
      this.publishError = true;
      document.getElementById('pub').style.borderColor = 'red';
      this.publish_error = 'Please enter valid date of publish of article';
      this.disable_alert = true;
      return false;
    } else if (this.input_date <= this.today) {
      document.getElementById('pub').style.borderColor = 'green';
      this.publishError = false;
      this.disable_alert = false;
      return true;
    }
  }


  //once changes can made they'll be reflected to database and server by this method which calls 'put' API
  yesUpdate(update) {

    this.update_refresh = update;

    this.head = 'Update Article Alert!';
    if (!this.validateTitle()) {

      this.title_error = false;

      if (this.article.title === '' || this.article.title === undefined || this.article.title === null) {
        this.article.title = this.view.title;

      }
      if (this.article.description === '' || this.article.description === undefined || this.article.description === null) {
        this.article.description = this.view.description;

      }
      if (this.article.publishdate === '' || this.article.publishdate === undefined || this.article.publishdate === null) {
        this.article.publishdate = this.view.publishdate;
      }

      // if (this.selectedfile.type === undefined) {
      this.disable_alert = false;
      this.article.image = this.view.image;
      this._httpService.updateArticle(this.article, this.id).subscribe(
        data => {
          this.update_error = false;
          this.update_success = false;
        },
        error => {
          document.getElementById('wait').style.display = 'none';
          this.update_success = false;
          this.update_error = true;
          this.update_msg = 'Update Failed!' + error;
        },
        () => {
          this.uploader.uploadAll();
          document.getElementById('wait').style.display = 'none';
          this.update_error = false;
          this.update_success = true;
          this.update_msg = 'Article is updated successfully!';
        }
      );
    }
    else {
      this.title_error = true;
    }
  }

  refresh() {
    if (this.update_refresh === 'update') {
      location.reload();
    }
  }
  }

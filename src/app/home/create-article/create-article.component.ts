import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {SerCreateService} from './ser-create.service';
import {HttpClient} from '@angular/common/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';


const URL = 'http://localhost:3000/users/upload_image';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

  array_date: any = [];
  article = {title: '', description: '', publishdate: '', image: ''};

  exist: boolean;

  finput: any;

  description: any;
  descError: boolean;
  dd: any;
  dis: boolean;

  input_date: string;
  image_error: string;
  image_name: string;
  imageError: boolean;
  image_array: any = [];
  image_preview: boolean = false;
  image_status: boolean;

  mm: any;

  publish_error: string;
  publishdate: any;
  publishError: boolean;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'photo',
    allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']
  });

  selectedfile: any;
  showSuccess: boolean;
  submit_error: boolean = false;


  title: any;
  title_error: string;
  titleError: boolean;
  today: any;

  url: string;

  yyyy: string;

  constructor(private _httpService: SerCreateService, private http: HttpClient, private changeDetector: ChangeDetectorRef) {
  }

  //ng2 File Uploader for uploading images on server
  //converts today's date and separates day, month and year, and sets maximum limit of publish date;
  ngOnInit() {

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

      if (status == 200) {
        this.submit_error = false;
        this.showSuccess = true;
      }
      else {
        this.showSuccess = false;
        this.submit_error = true;
      }
    };

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
    document.getElementById('publishdate').setAttribute('max', this.today);
  }


  // validates title returns false if title is unentered or if title name exists, sets border color
  //indlicating validation

  validateTitle(): boolean {
    if (this.title == '' || this.title == undefined) {
      document.getElementById('title').style.borderColor = 'red';
      this.title_error = 'Above field is required, please enter the title.';
      this.titleError = true;
      return false;
    }

    else if (this.titleExists(this.title) && this.title != undefined) {
      document.getElementById('title').style.borderColor = 'green';
      this.titleError = false;
      return true;
    }

    else if (!this.titleExists(this.title)) {
      return false;
    }
  }

  // call to api or checking if title exists or unique, returns false if title exists and true if it is unique
  titleExists(title): boolean {
    try {
      this._httpService.getExistTitle(title).subscribe(
        data => {
          if (data.exist == true) {
            document.getElementById('title').style.borderColor = 'red';
            this.title_error = 'Article Title exists. Please select another title for you article';
            this.titleError = true;
            this.exist = false;
          }
        },
        error => {
          alert('Server Error: ' + error);
          console.log('');
        },
        () => {
        }
      );
      return true;
    }
    catch(Exception){
      console.log(Exception);
    }
  }

  showTitleTip() {
    if (!this.validateTitle()) {
      document.getElementById('title').style.borderColor = 'red';
      this.titleError = true;
    }
  }

  hideTitleTip() {
    if (!this.validateTitle()) {
      this.titleError = false;
    }
  }

  // validates description returns false if description is unentered sets border color indicating validation
  validateDescription(): boolean {

    if (this.description === '' || this.description === undefined) {
      document.getElementById('desc').style.borderColor = 'red';
      this.descError = true;
      return false;
    } else {
      document.getElementById('desc').style.borderColor = 'green';
      this.descError = false;
      return true;
    }
  }

  showDescTip() {
    if (!this.validateDescription()) {
      document.getElementById('desc').style.borderColor = 'red';
      this.descError = true;
    }
  }

  hideDescTip() {
    if (!this.validateDescription()) {
      this.descError = false;
    }
  }


  // returns false if date is not publised or entered date exceeds its limit
  validateDate(): boolean {

    if (this.publishdate === '' || this.publishdate === undefined || this.publishdate === null) {
      this.publishError = true;
      document.getElementById('pub').style.borderColor = 'red';
      this.publish_error = 'Please enter date of publish of article';
      return false;
    } else if (this.publishdate !== undefined || this.publishdate !== '' || this.publishdate !== null) {
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

      this.array_date = this.publishdate.split('-');
      this.input_date = this.array_date[0] + '-' + this.array_date[1] + '-' + this.array_date[2];

      if (this.input_date > this.today) {
        this.publishError = true;
        document.getElementById('pub').style.borderColor = 'red';
        this.publish_error = 'Please enter valid date of publish of article';
        return false;
      } else if (this.input_date < this.today) {
        document.getElementById('pub').style.borderColor = 'green';
        this.publishError = false;
        return true;
      } else if (this.input_date === this.today) {
        this.publishError = false;
        document.getElementById('pub').style.borderColor = 'green';
        return true;
      }
    }
  }


  // validates image, checks if image is entered or not, if yes, then check the type of image
  validateImage(): boolean {
    if (this.selectedfile === undefined || this.selectedfile === '' || this.selectedfile === null) {
      this.imageError = true;
      this.image_error = 'Please select an image for your article!';
      return false;
    } else if (this.selectedfile.type.includes('image')) {
      this.imageError = false;
      return true;
    } else {
      this.imageError = true;
      return false;
    }
  }


  //On successful submission clear the form to make it ready for next article
  clear() {
    this.title = '';
    this.description = '';
    $('input[type = date]').val('');
    $('input[type = file]').val('');
    // $('#success').show();
    document.getElementById('title').style.borderColor = '#ccc';
    document.getElementById('desc').style.borderColor = '#ccc';
    this.url = '';
    this.image_status = false;
    this.image_preview = false;
    this.selectedfile = '';
  }

  //selects a file from window, converts its url and displays the image in <img>, also
  //converts the image name to be passed in form data, that is stored in database.
  readUrl(event: any) {


    this.selectedfile = event.target.files[0];
    if (this.selectedfile !== undefined) {
      this.imageError = false;
    }
    if (this.selectedfile.type.includes('image')) {
      this.dis = false;
      this.image_preview = true;
      this.image_array = this.selectedfile.name.split('.');
      this.image_name = this.image_array[0] + '-' + Date.now() + '.' + this.image_array[1];

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
          this.url = (<FileReader>event.target).result;
        };
        reader.readAsDataURL(event.target.files[0]);

      }
      this.image_status = true;
    } else {
      this.dis = true;
      this.image_preview = false;
      this.url = '';
      this.imageError = true;
      this.image_error = 'Invalid image type selected, please select image type only!';
      this.image_status = false;

    }

    if (this.selectedfile.type === undefined) {
      this.finput = '';
      this.dis = true;
      this.image_preview = false;
      this.url = '';
      this.imageError = true;
      this.image_error = 'Invalid image type selected, please select image type only!';
      this.image_status = false;

    }
  }

  submit(event) {
    if (this.validateTitle() && this.validateDescription() && this.validateDate() && this.validateImage() && this.image_status) {
      const fd = new FormData();
      fd.append('title', this.title);
      fd.append('description', this.description);
      fd.append('publishdate', this.publishdate);
      fd.append('image', this.image_name);


      this._httpService.createArticle(fd).subscribe(
        data => {
          console.log(data);
        },
        error => {
          this.submit_error = true;
        },
        () => {
          this.uploader.uploadAll();
          this.showSuccess = true;
          this.submit_error = false;
          this.clear();
        }
      );
    }
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateArticleComponent } from './home/create-article/create-article.component';
import { ListingArticleComponent } from './home/listing-article/listing-article.component';
import { SerListingService} from './home/listing-article/ser-listing.service';
import { SerCreateService} from './home/create-article/ser-create.service';
import { HeaderComponent } from './home/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateArticleComponent,
    ListingArticleComponent,
    HeaderComponent,
    FileSelectDirective,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    routing,
    FormsModule,
    HttpModule,
    HttpClientModule,
  ],
  providers: [RouterModule, SerListingService, SerCreateService],
  bootstrap: [AppComponent]
})
export class AppModule { }

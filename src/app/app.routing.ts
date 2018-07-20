import {Routes, RouterModule} from '@angular/router';
import { HomeComponent} from './home/home.component';
import { CreateArticleComponent } from './home/create-article/create-article.component';
import { ListingArticleComponent } from './home/listing-article/listing-article.component';



const APP_ROUTES: Routes = [

  {path: '',  redirectTo: '/home', pathMatch : 'full'},

          {path: 'home', component: HomeComponent},
          {path: 'create-article', component: CreateArticleComponent},
          {path: 'listing-article', component: ListingArticleComponent},

];

export const routing = RouterModule.forRoot(APP_ROUTES);



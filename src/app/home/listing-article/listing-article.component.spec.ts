import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingArticleComponent } from './listing-article.component';

describe('ListingArticleComponent', () => {
  let component: ListingArticleComponent;
  let fixture: ComponentFixture<ListingArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

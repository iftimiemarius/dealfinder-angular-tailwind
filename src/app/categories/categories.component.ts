import { inject } from '@angular/core';
import { Firestore, collectionData, collection, query, orderBy, limit } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  parent: string = '';
  categories: Observable<Category[]>;

  constructor(private route: ActivatedRoute) {
    const categoriesCollection = collection(this.firestore, 'categories');
    this.categories = collectionData(categoriesCollection) as Observable<Category[]>;
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      this.parent = params['id'];
    });
  }

  getParentCategory(categories: Category[]) {
    return categories.find(obj => obj.internal == this.parent)?.name;
  }

  getCurrentCategories(categories: Category[]) {
    return categories.filter(obj => obj.parent == this.parent);
  }
}

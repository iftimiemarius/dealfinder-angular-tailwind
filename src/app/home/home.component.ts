import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { Firestore, collectionData, collection, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  firestore: Firestore = inject(Firestore);
  parent: string = 'toate';
  categories: Observable<Category[]>;
  top_products: Observable<Product[]>;
  disc_products: Observable<Product[]>;

  constructor() {
    const categoriesCollection = collection(this.firestore, 'categories');
    this.categories = collectionData(categoriesCollection) as Observable<Category[]>;

    const productsCollectionTopReference = collection(this.firestore, 'products');
    const productsCollectionTop = query(productsCollectionTopReference, orderBy('views', 'desc'), limit(10));
    this.top_products = collectionData(productsCollectionTop) as Observable<Product[]>;

    const productsCollectionDiscReference = collection(this.firestore, 'products');
    const productsCollectionDiscounted = query(productsCollectionDiscReference, orderBy('discount', 'desc'), limit(10));
    this.disc_products = collectionData(productsCollectionDiscounted) as Observable<Product[]>;
  }


  getParentCategory(categories: Category[]) {
    return categories.find(obj => obj.internal == this.parent)?.name;
  }

  getCurrentCategories(categories: Category[]) {
    return categories.filter(obj => obj.parent == this.parent);
  }
}

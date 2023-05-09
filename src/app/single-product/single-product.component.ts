import { inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collectionData, doc, getDoc, collection, query, orderBy, limit, updateDoc, increment } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { Listing } from '../models/listing';


class ConvertedSpec {
  constructor (public tag: string, public value: string) 
  {

  }
}


@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent {
  firestore: Firestore = inject(Firestore);
  currentProduct?: Product = undefined;
  currentListings: Observable<Listing[]> = new Observable<Listing[]>;
  currentSpecs: ConvertedSpec[] = [];

  constructor(private route: ActivatedRoute) {

  }

  async ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      this.getProductData(params['id']);
    });
  }

  async getProductData(productId: string) {
    const documentReference = doc(this.firestore, 'products', productId);
    const currentDocument = await getDoc(documentReference);
    if (currentDocument.exists()) {
      this.currentProduct = currentDocument.data() as Product;
      this.convertSpecsToList();
      updateDoc(documentReference, {views: increment(1)})
    }

    const currentListingsReference = collection(this.firestore, 'products', productId, 'listings');
    const currentListingsQuery = query(currentListingsReference, orderBy('price'));
    this.currentListings = collectionData(currentListingsQuery) as Observable<Listing[]>;
  }

  convertSpecsToList() {
    this.currentSpecs = [];
    const sortedKeys = Object.keys(this.currentProduct!.specs);
    sortedKeys.sort();
    sortedKeys.forEach((key: any) => {
      const value = this.currentProduct!.specs[key];
      this.currentSpecs.push(new ConvertedSpec(key, value));
    });
  }

  goToURL(url: string){
    window.open(url, "_blank");
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collectionData, collection, query, orderBy, limit, getCountFromServer, startAfter, getDocs, endAt, where, AggregateField, AggregateQuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { SortingType } from '../models/sorting-type';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  currentProducts: Observable<Product[]> = new Observable();
  productCollectionQuery: any;
  queryWithoutLimit: any;
  productsCount: any;
  startIndex: number = 1;
  itemsPerPage: number = 10;
  endpoint: string = '';
  reloadItems: boolean = true;
  noSort: boolean = true;
  currentSort: string = '';
  currentProductsCount: number = 1;
  sortingObjects: Observable<SortingType[]> = new Observable();
  currentCountObject: Promise<AggregateQuerySnapshot<{ count: AggregateField<number>; }>>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.endpoint = router.url.split('?')[0];
    const productsCountReference = collection(this.firestore, 'products');
    this.currentCountObject = getCountFromServer(productsCountReference);


    const sortingTypesReference = collection(this.firestore, 'sorting');
    this.sortingObjects = collectionData(sortingTypesReference) as Observable<SortingType[]>;
  }

  async ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      let currentPage = 1;
      if ('page' in params) {
        currentPage = params['page'];
      }
      this.startIndex = (currentPage - 1) * this.itemsPerPage + 1;

      if (this.reloadItems) {
        const productCollectionQueryReference = collection(this.firestore, 'products');
        
        this.productCollectionQuery = query(productCollectionQueryReference);

        const parent = this.endpoint.split('/')[2];
        this.productCollectionQuery = query(this.productCollectionQuery, where("category." + parent, '==', true));

        if ('search' in params) {
          this.productCollectionQuery = query(this.productCollectionQuery, where("search", 'array-contains', params['search']));
        }

        if ('sort' in params) {
          this.currentSort = params['sort'];
          this.noSort = false;
          const tags = params['sort'].split('_');
          const orderString = tags[0];
          const orderType = tags[1];
          this.productCollectionQuery = query(this.productCollectionQuery, orderBy(orderString, orderType));
        } else {
          this.noSort = true;
          this.currentSort = '';
        }


        // Save the query without the limit
        this.queryWithoutLimit = this.productCollectionQuery;


        this.currentCountObject = getCountFromServer(this.queryWithoutLimit);
        
        this.currentCountObject.then((currentCount) => {
        this.productsCount = currentCount.data().count;
        });

        this.productCollectionQuery = query(this.productCollectionQuery, limit(this.itemsPerPage));
        this.currentProducts = collectionData(this.productCollectionQuery) as Observable<Product[]>;

        this.currentProducts.subscribe((products) => {
          this.currentProductsCount = products.length;
        });

        this.router.navigate([this.endpoint], { queryParams: { page: 1 }, queryParamsHandling: "merge" });
      }
    });
  }

  nextProducts() {

  }

  prevProducts() {

  }

  async prevPage() {
    const documentSnapshots = await getDocs(this.productCollectionQuery);
    const firstVisible = documentSnapshots.docs[0];
    this.currentProducts = collectionData(query(this.queryWithoutLimit, endAt(firstVisible), limit(this.itemsPerPage))) as Observable<Product[]>;

    const currentPage = Math.floor(this.startIndex / this.productsCount) + 1;
    this.reloadItems = false;
    this.router.navigate([this.endpoint], { queryParams: { page: currentPage - 1 }, queryParamsHandling: "merge" });
  }

  async nextPage() {
    const documentSnapshots = await getDocs(this.productCollectionQuery);
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
    this.currentProducts = collectionData(query(this.queryWithoutLimit, startAfter(lastVisible), limit(this.itemsPerPage))) as Observable<Product[]>;

    const currentPage = Math.floor(this.startIndex / this.productsCount) + 1;
    this.reloadItems = false;
    this.router.navigate([this.endpoint], { queryParams: { page: currentPage + 1 }, queryParamsHandling: "merge" });
  }

  isNextPageAvailable() {
    const currentPage = Math.floor(this.startIndex / this.productsCount) + 1;
    const numPages = Math.floor(this.productsCount / this.itemsPerPage);

    return currentPage < numPages;
  }

  isPrevPageAvailable() {
    const currentPage = Math.floor(this.startIndex / this.productsCount) + 1;

    return currentPage > 1;
  }

  onChange(event: any) {
    this.router.navigate([this.endpoint], { queryParams: { sort: event.value }, queryParamsHandling: "merge" });
  }

  isSelected(sorting: string) {
    return sorting === this.currentSort;
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Created components
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { SingleProductComponent } from './single-product/single-product.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categorie/:id', component: CategoriesComponent },
  { path: 'produse/:id', component: ProductsComponent },
  { path: 'produs/:id', component: SingleProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

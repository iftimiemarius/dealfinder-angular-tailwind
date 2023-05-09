import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {
  }
  
  search(searchForm: any) {
    let parent = 'toate';
    console.log(this.router.url);
    const paths = this.router.url.split('?')[0].split('/');
    if (paths[1] == 'categorie' || paths[1] == 'produse') {
      parent = paths[2];
    }

    this.router.navigate(['/', 'produse', parent], { queryParams: { search: searchForm } });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() products!: Product[];
  selectedIndex: number = 0;

  ngOnInit() {
    setInterval(() => {
      this.onNextClick();
    }, 3000);
  }

  selectImage(index: number) {
    this.selectedIndex = index;
  }

  onPrevClick() {
    if (this.selectedIndex == 0) {
      this.selectedIndex = this.products.length - 1;
    }
    else {
      this.selectedIndex--;
    }
  }

  onNextClick() {
    if (this.selectedIndex == this.products.length - 1) {
      this.selectedIndex = 0;
    }
    else {
      this.selectedIndex++;
    }
  }
}

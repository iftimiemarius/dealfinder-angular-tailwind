import { Spec } from '../models/spec';


export interface Product {
  id: string;
  name: string;
  image: string;
  min: number;
  currency: string;
  specs: Spec;
  views: number;
  discount: number;
}

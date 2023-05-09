import { ListingTag } from '../models/listing-tag';

export interface Listing {
  domain: string;
	name: string;
  price: number;
  tags: ListingTag[];
  url: string;
  currency: string;
}

import { FoursquareLocation } from './foursquare-location';
import { FoursquareCategory } from './foursquare-category';

export interface FoursquareVenue  {
  id: string;
  name: string;
  location: FoursquareLocation;
  categories: Array<FoursquareCategory>;
}

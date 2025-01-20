import { type SchemaTypeDefinition } from 'sanity';
import cars from './cars';
import rental from './rental'; 
import customer from './customer';
import payment from './payment';


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cars, rental, customer, payment], 
};
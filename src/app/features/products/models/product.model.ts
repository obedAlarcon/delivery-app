





export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}


export interface Product {

  id:number;

  name:string;

  description:string;

  price:number;

  stock:number;

  imageUrl:string;

  categoryId:number;
   category:Category;
  isActive:boolean;

}
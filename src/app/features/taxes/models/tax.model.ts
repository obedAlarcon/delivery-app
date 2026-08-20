export interface Tax {

  id: number;
     code: string;
  name: string;

  description?: string;

  percentage: number;

  isActive: boolean;

}
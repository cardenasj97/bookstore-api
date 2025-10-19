export type Author = {
  id: number;
  name: string;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Book = {
  id: number;
  title: string;
  description?: string | null;
  publishedAt?: Date | null;
  authors: Author[];
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
};

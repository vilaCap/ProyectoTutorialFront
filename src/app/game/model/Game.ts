import { Category } from "../../category/model/Category";
import { Author } from "../../author/model/Author";

export class Game {
    id: number;
    title: string;
    age: number;
    category: Category;
    author: Author;
}
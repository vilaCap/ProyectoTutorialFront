import { Pageable } from "./page/Pageable";
import { Author } from "../model/Author";

export class AuthorPage {
    content: Author[];
    pageable: Pageable;
    totalElements: number;
}

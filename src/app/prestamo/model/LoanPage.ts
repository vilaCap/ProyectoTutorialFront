import { Pageable } from "./page/Pageable";
import { Prestamo } from "./Prestamo";

export class LoanPage {
    content: Prestamo[];
    pageable: Pageable;
    totalElements: number;
}

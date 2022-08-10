import { Client } from "src/app/client/model/Client";

export class Prestamo {
    id: number;
    title: string;
    client: Client;
    prestamoDate: Date;
    devDate: Date;
}
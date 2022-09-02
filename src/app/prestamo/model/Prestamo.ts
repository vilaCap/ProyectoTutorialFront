import { Client } from "src/app/client/model/Client";
import { Game } from "src/app/game/model/Game";

export class Prestamo {
    id: number;
    game: Game;
    client: Client;
    loanDate: Date;
    devDate: Date;
}
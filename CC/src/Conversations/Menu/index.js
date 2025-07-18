import { Flow } from "../../Flow/Flow.js"
import { OneLineMessage } from "../../Flow/utils/OneLineMessage.js"
import { MenuController } from "./MenuController.js"
export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(`Buenas tardes señor {name}, como lo puedo ayudar hoy?`)
    .addAnswer(OneLineMessage(["Contamos con", "1. Cafe helado", "2. Cafe con Leche", "3. Capuchino"]))
    .addAnswer(MenuController)
    .setName("Menú")
// Removemos .setNextFlow(Final) porque ahora será dinámico
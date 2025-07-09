import { Flow } from "../../../Flow/Flow.js"
import { Final } from "../../Final/index.js"

export const FlowCapuchino = new Flow()
    .addAnswer("¡Magnífica elección! ☕✨")
    .addAnswer("Nuestro capuchino tiene la espuma perfecta")
    .addAnswer("¿Le gustaría personalizarlo?")
    .addAnswer("1. Capuchino clásico")
    .addAnswer("2. Con canela")
    .addAnswer("3. Con chocolate")
    .addAnswer("Por favor seleccione una opción (1-3)")
    .setName("Capuchino")
    .setNextFlow(Final)

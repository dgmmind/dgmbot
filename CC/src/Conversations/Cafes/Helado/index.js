import { Flow } from "../../../Flow/Flow.js"
import { Final } from "../../Final/index.js"

export const FlowHelado = new Flow()
    .addAnswer("¡Excelente elección! ☃️")
    .addAnswer("Nuestro café helado es perfecto para días calurosos")
    .addAnswer("¿Le gustaría agregarlo con:")
    .addAnswer("1. Crema batida")
    .addAnswer("2. Jarabe de vainilla")
    .addAnswer("3. Sin extras")
    .addAnswer("Por favor seleccione una opción (1-3)")
    .setName("Café Helado")
    .setNextFlow(Final)
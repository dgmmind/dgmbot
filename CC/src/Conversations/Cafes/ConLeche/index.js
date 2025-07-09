import { Flow } from "../../../Flow/Flow.js"
import { Final } from "../../Final/index.js"

export const FlowConLeche = new Flow()
    .addAnswer("¡Perfecta elección! ☕")
    .addAnswer("Nuestro café con leche es cremoso y delicioso")
    .addAnswer("¿Qué tipo de leche prefiere?")
    .addAnswer("1. Leche entera")
    .addAnswer("2. Leche descremada")
    .addAnswer("3. Leche de almendras")
    .addAnswer("Por favor seleccione una opción (1-3)")
    .setName("Café con Leche")
    .setNextFlow(Final)
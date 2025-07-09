import { Answer } from "../../Flow/Answer.js"
import { FlowHelado } from "../Cafes/Helado/index.js"
import { FlowConLeche } from "../Cafes/ConLeche/index.js"
import { FlowCapuchino } from "../Cafes/Capuchino/index.js"

const cafes = ["Helado", "Con Leche", "Capuchino"]
const flows = [FlowHelado, FlowConLeche, FlowCapuchino]

export class MenuController extends Answer {
    waitForAnswer = true
    async handler(ctx) {
        const option = Number(ctx.body[0])

        // Guardar la selección en memoria
        ctx.useMemo(ctx.phoneNumber, "cafe", cafes[option - 1])

        if (isNaN(option) || !cafes[option - 1]) {
            await ctx.reply("Usted ha no ha seleccionado una opción valida!")
            ctx.moveToStep(ctx.phoneNumber, 0)
            return
        }

        // Enviar mensaje de confirmación
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado Café {cafe}`))

        // Cambiar el nextFlow del flow actual según la opción
        ctx.FlowContext.nextFlow = flows[option - 1]
    }
}

import { Flow } from "../Flow/Flow.js";
import { Answer } from "../Flow/Answer.js";
import { OneLineMessage } from "../Flow/utils/OneLineMessage.js";



class DetailBusiness extends Answer {
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)

        const resumen = `
              📝 *Resumen del registro de su empresa en Humanosisu*:
              • NOMBRE: ${ctx.useMemo(ctx.phoneNumber, "NAME_BUSINESS")}
              • RTN: ${ctx.useMemo(ctx.phoneNumber, "RTN_BUSINESS")}
              ✅ ¡Gracias por confiar en Humanosisu! Pronto un asesor lo contactará.`;

        await ctx.reply(resumen);
    }
}
export const FinalBusiness = new Flow()
    .addAnswer("Sus datos fueron registrados!")
    .addAnswer(DetailBusiness)
    .setName("Despedida");

export class AskNameController extends Answer {
    waitForAnswer = true;

    async handler(ctx) {
        const rtn = ctx.body.trim();
        // Validación: solo números y exactamente 14 dígitos
        const isValidRTN = /^\d{14}$/.test(rtn);
        if (!isValidRTN) {
            await ctx.reply('❌ El RTN debe tener exactamente *14 números* y no debe contener letras ni espacios.');
            return ctx.moveToStep(ctx.phoneNumber, 0);
        }
        // Guardar el RTN válido
        ctx.useMemo(ctx.phoneNumber, "RTN_BUSINESS", rtn);
        await ctx.delayWithPresence("composing", 3);
        // await ctx.reply(ctx.MemoText(ctx.phoneNumber, `RTN de su empresa es *{RTN_BUSINESS}*`));
    }
}

export const AskName = new Flow()
    .addAnswer(`Nombre de empresa: *{NAME_BUSINESS}*`)
    .addAnswer("¿Cuál es el RTN de su empresa?")
    .addAnswer(AskNameController)
    .setName("AskName")
    .setNextFlow(FinalBusiness)
export class BusinessController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        ctx.useMemo(ctx.phoneNumber, "NAME_BUSINESS", ctx.body);
        await ctx.delayWithPresence("composing", 3)
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Su empresa se llama *{NAME_BUSINESS}*`));
    }
}

export const FlowBusiness = new Flow()
    .addAnswer("Excelente, completa los siguientes datos de empresa.")
    .addAnswer(OneLineMessage([
        "¿Como se llama su empresa?"
    ]))
    .addAnswer(BusinessController)
    .setName("FlowBusiness")
    .setNextFlow(AskName);

const menuInit = ["Empleo", "Empresa"];
export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const option = Number(ctx.body[0]);
        if (isNaN(option) || !menuInit[option - 1]) {
            await ctx.delayWithPresence("composing", 3)
            await ctx.reply('Usted ha no ha seleccionado una opción valida!');
            ctx.moveToStep(ctx.phoneNumber, 0);
            return;
        }

        if (option ===1){
            ctx.FlowContext.nextFlow = FlowEmployees;
        }else if(option===2){
            ctx.FlowContext.nextFlow = FlowBusiness;
        }

    }
}
export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(`Buenas tardes señor {name}?`)
    .addAnswer(OneLineMessage(["Eres una empresa o buscas empleo escribe el numero de opcion", "1. Busco empleo", "2. Soy una empresa"]))
    .addAnswer(MenuController)
    .setName("Menú")



export class Saludo extends Answer {
    waitForAnswer = true;
    constructor() {
        super();
    }
    async handler(ctx) {
        ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
        await ctx.delayWithPresence('composing', 3);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Hola {name}!'));

    }
}


export const FlowSaludo = new Flow()
    .addKeyboard(['hello', 'sup', 'whats doing'])
    .addKeyboard({
    key: ["hola", 'que onda', 'weee'],
    mode: 'equals',
    sensitive: false
})
    .addAnswer('[RRHH] - Hola, cual es tu nombre?')
    .addAnswer(Saludo)
    .setNextFlow(MenuFlow)
    .setName("Saludo");
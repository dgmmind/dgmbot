import { Flow } from "../Flow/Flow.js";
import { Answer } from "../Flow/Answer.js";
import { OneLineMessage } from "../Flow/utils/OneLineMessage.js";

//=== FLUJO DE EMPLEADOS ===


class AskName extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "fullname", ctx.body);
        await ctx.reply("¿Cuál es tu DNI?");
    }
}

class AskDNI extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "dni", ctx.body);
        await ctx.reply("¿Cuál es tu número de teléfono?");
    }
}

class AskPhone extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "phone", ctx.body);
        await ctx.reply("¿Cuál es tu correo electrónico?");
    }
}

class AskEmail extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "email", ctx.body);
        await ctx.reply("¿Qué idioma hablas?");
    }
}

class AskLanguage extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "language", ctx.body);
        await ctx.reply("¿Cuál es tu dirección exacta?");
    }
}

class AskAddress extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "address", ctx.body);
        await ctx.reply("✅ Procesando tus datos...");
    }
}

class ResumenEmpleado extends Answer {
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)

        const resumen = `
📝 *Resumen de tu registro en Humansisu*:
- Nombre completo: ${ctx.useMemo(ctx.phoneNumber, "fullname")}
- DNI: ${ctx.useMemo(ctx.phoneNumber, "dni")}
- Teléfono: ${ctx.useMemo(ctx.phoneNumber, "phone")}
- Correo: ${ctx.useMemo(ctx.phoneNumber, "email")}
- Idioma: ${ctx.useMemo(ctx.phoneNumber, "language")}
- Dirección: ${ctx.useMemo(ctx.phoneNumber, "address")}

✅ ¡Gracias por confiar en Humansisu! Pronto nos pondremos en contacto contigo.
        `;

        await ctx.reply(resumen);
    }
}


export const FlowEmployees = new Flow()
    .addAnswer("Perfecto, estás en el flujo para *personas que buscan empleo*.")
    .addAnswer("Primero, ¿cuál es tu nombre completo?")
    .addAnswer(AskName)
    .addAnswer(AskDNI)
    .addAnswer(AskPhone)
    .addAnswer(AskEmail)
    .addAnswer(AskLanguage)
    .addAnswer(AskAddress)
    .addAnswer(ResumenEmpleado)
    .setName("FlowEmployees");


//
// === FLUJO DE EMPRESAS ===
//

class AskRTN extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "rtn", ctx.body);
        await ctx.reply("¿Cuál es el nombre de la empresa?");
    }
}

class AskCompanyName extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "company_name", ctx.body);
        await ctx.reply("¿Cuál es el correo de contacto?");
    }
}

class AskCompanyEmail extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "company_email", ctx.body);
        await ctx.reply("¿Cuántos empleados tienen aproximadamente?");
    }
}

class AskCompanySize extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "company_size", ctx.body);
        await ctx.reply("¿Cuál es el rubro de la empresa?");
    }
}

class AskSector extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)
        ctx.useMemo(ctx.phoneNumber, "sector", ctx.body);
        await ctx.reply("✅ Procesando la información de su empresa...");
    }
}

class ResumenEmpresa extends Answer {
    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3)

        const resumen = `
📝 *Resumen del registro de su empresa en Humansisu*:
- RTN: ${ctx.useMemo(ctx.phoneNumber, "rtn")}
- Empresa: ${ctx.useMemo(ctx.phoneNumber, "company_name")}
- Correo: ${ctx.useMemo(ctx.phoneNumber, "company_email")}
- Nº de empleados: ${ctx.useMemo(ctx.phoneNumber, "company_size")}
- Rubro: ${ctx.useMemo(ctx.phoneNumber, "sector")}

✅ ¡Gracias por confiar en Humansisu! Pronto un asesor lo contactará.
        `;

        await ctx.reply(resumen);
    }
}


export const FlowBusiness = new Flow()
    .addAnswer("Excelente, estás en el flujo para *empresas que desean reclutar*.")
    .addAnswer("A continuación solicitaremos algunos datos:")
    .addAnswer(OneLineMessage([
        "1. RTN",
        "2. Nombre de la empresa",
        "3. Correo",
        "4. Cantidad de empleados",
        "5. Rubro",
    ]))
    .addAnswer("¿Cuál es su RTN?")
    .addAnswer(AskRTN)
    .addAnswer(AskCompanyName)
    .addAnswer(AskCompanyEmail)
    .addAnswer(AskCompanySize)
    .addAnswer(AskSector)
    .addAnswer(ResumenEmpresa)
    .setName("FlowBusiness");


//
// === FLUJO INICIAL ===
//

class SelectorController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const input = ctx.body.toLowerCase();
        await ctx.delayWithPresence("composing", 3)

        if (input.includes("empleo") || input.includes("1") || input.includes("trabajo")) {
            ctx.FlowContext.nextFlow = FlowEmployees;
        } else if (input.includes("empresa") || input.includes("reclutar")  || input.includes("2")) {
            ctx.FlowContext.nextFlow = FlowBusiness;
        } else {
            await ctx.reply("Por favor, escribe *empleo* o *empresa* para continuar.");
            ctx.moveToStep(ctx.phoneNumber, 0);
        }
    }
}

export const FlowSaludo = new Flow()
    .addKeyboard(["hola", "hello"])
    .addAnswer("👋 ¡Bienvenido a soy Jorge de *Humansisu*!")
    .addAnswer(OneLineMessage([
        "Seleccione una opción para continuar:",
        "1. Estoy buscando *empleo* o escriba *1*",
        "2. Soy una *empresa* que desea reclutar o escriba *2*",
    ]))
    .addAnswer(SelectorController)
    .setName("Saludo")

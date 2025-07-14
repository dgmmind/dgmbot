import { Flow } from "../Flow/Flow.js";
import { Answer } from "../Flow/Answer.js";
import { OneLineMessage } from "../Flow/utils/OneLineMessage.js";
import fs from "fs"

//=== FLUJO DE EMPLEADOS ===


class AskName extends Answer {
    waitForAnswer = true;

    async handler(ctx) {
        await ctx.delayWithPresence("composing", 3);
        ctx.useMemo(ctx.phoneNumber, "fullname", ctx.body);

        // Primer mensaje con la pregunta
        await ctx.reply("¿Cuál es tu DNI?");

        // Segundo mensaje solo con el enlace del video (esto hará que WhatsApp genere la miniatura)
        await ctx.send("https://www.youtube.com/watch?v=j4ai2UkbwdQ");
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
//
// import { createClient } from '@supabase/supabase-js';
//
// import { Flow } from "../Flow/Flow.js";
// import { Answer } from "../Flow/Answer.js";
// import { OneLineMessage } from "../Flow/utils/OneLineMessage.js";
//
// const supabase = createClient(
//     'https://zgicsrxvknzudvconhif.supabase.co',
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWNzcnh2a256dWR2Y29uaGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjE1MDksImV4cCI6MjA2NzgzNzUwOX0.cwGE6MVYELSMiBOaJU4SVwNbKZ3TVAwo1S0ohD_LMnw'
// );
//
// function esCorreoValido(correo) {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(correo);
// }
//
//
// // --- FLUJO EMPLEADOS ---
//
// class AskName extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const nombre = ctx.body.trim();
//         if (!nombre) {
//             await ctx.reply("❌ El nombre es obligatorio.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         ctx.useMemo(ctx.phoneNumber, "fullname", nombre);
//         await ctx.reply("¿Cuál es tu DNI? (13 dígitos numéricos)");
//     }
// }
//
// class AskDNI extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const dni = ctx.body.trim();
//         if (!/^\d{13}$/.test(dni)) {
//             await ctx.reply("❌ DNI inválido. Debe tener 13 dígitos numéricos.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         const { data: existing, error } = await supabase
//             .from('candidates')
//             .select('candidate_identity')
//             .eq('candidate_identity', dni)
//             .limit(1);
//
//         if (error) {
//             await ctx.reply("⚠️ Error validando DNI. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         if (existing.length > 0) {
//             await ctx.reply("🚫 Este DNI ya está registrado. Debes comenzar de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//
//         ctx.useMemo(ctx.phoneNumber, "dni", dni);
//         await ctx.reply("¿Cuál es tu número de teléfono? (8 dígitos numéricos)");
//     }
// }
//
// class AskPhone extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const phone = ctx.body.trim();
//         if (!/^\d{8}$/.test(phone)) {
//             await ctx.reply("❌ Teléfono inválido. Debe tener 8 dígitos numéricos.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         const { data: existing, error } = await supabase
//             .from('candidates')
//             .select('phone_number')
//             .eq('phone_number', phone)
//             .limit(1);
//
//         if (error) {
//             await ctx.reply("⚠️ Error validando teléfono. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         if (existing.length > 0) {
//             await ctx.reply("🚫 Este teléfono ya está registrado. Debes comenzar de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//
//         ctx.useMemo(ctx.phoneNumber, "phone", phone);
//         await ctx.reply("¿Cuál es tu correo electrónico?");
//     }
// }
//
// class AskEmail extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const email = ctx.body.trim();
//         if (!esCorreoValido(email)) {
//             await ctx.reply("❌ Correo inválido. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         const { data: existing, error } = await supabase
//             .from('candidates')
//             .select('candidate_email')
//             .eq('candidate_email', email)
//             .limit(1);
//
//         if (error) {
//             await ctx.reply("⚠️ Error validando correo. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         if (existing.length > 0) {
//             await ctx.reply("🚫 Este correo ya está registrado. Debes comenzar de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//
//         ctx.useMemo(ctx.phoneNumber, "email", email);
//         await ctx.reply("¿Qué idioma hablas?");
//     }
// }
//
// class AskLanguage extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const lang = ctx.body.trim();
//         if (!lang) {
//             await ctx.reply("❌ El idioma es obligatorio.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         ctx.useMemo(ctx.phoneNumber, "language", lang);
//         await ctx.reply("¿Cuál es tu dirección exacta?");
//     }
// }
//
// class AskAddress extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const address = ctx.body.trim();
//         if (!address) {
//             await ctx.reply("❌ La dirección es obligatoria.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         ctx.useMemo(ctx.phoneNumber, "address", address);
//         await ctx.reply("✅ Procesando tus datos...");
//
//         const dataToInsert = {
//             candidate_name: ctx.useMemo(ctx.phoneNumber, "fullname"),
//             candidate_identity: ctx.useMemo(ctx.phoneNumber, "dni"),
//             phone_number: ctx.useMemo(ctx.phoneNumber, "phone"),
//             candidate_email: ctx.useMemo(ctx.phoneNumber, "email"),
//             candidate_language: ctx.useMemo(ctx.phoneNumber, "language"),
//             candidate_address: ctx.useMemo(ctx.phoneNumber, "address"),
//         };
//
//         const { error } = await supabase.from('candidates').insert([dataToInsert]);
//         if (error) {
//             await ctx.reply("❌ Error guardando datos, intenta más tarde.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//     }
// }
//
// class ResumenEmpleado extends Answer {
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const resumen = `
// 📝 *Resumen de tu registro en Humansisu*:
// - Nombre completo: ${ctx.useMemo(ctx.phoneNumber, "fullname")}
// - DNI: ${ctx.useMemo(ctx.phoneNumber, "dni")}
// - Teléfono: ${ctx.useMemo(ctx.phoneNumber, "phone")}
// - Correo: ${ctx.useMemo(ctx.phoneNumber, "email")}
// - Idioma: ${ctx.useMemo(ctx.phoneNumber, "language")}
// - Dirección: ${ctx.useMemo(ctx.phoneNumber, "address")}
//
// ✅ ¡Gracias por confiar en Humansisu! Pronto nos pondremos en contacto contigo.
//     `;
//         await ctx.reply(resumen);
//     }
// }
//
// export const FlowEmployees = new Flow()
//     .addAnswer("Perfecto, estás en el flujo para *personas que buscan empleo*.")
//     .addAnswer("Primero, ¿cuál es tu nombre completo?")
//     .addAnswer(AskName)
//     .addAnswer(AskDNI)
//     .addAnswer(AskPhone)
//     .addAnswer(AskEmail)
//     .addAnswer(AskLanguage)
//     .addAnswer(AskAddress)
//     .addAnswer(ResumenEmpleado)
//     .setName("FlowEmployees");
//
// // --- FLUJO EMPRESAS ---
//
// class AskRTN extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const rtn = ctx.body.trim();
//         if (!/^\d{14}$/.test(rtn)) {
//             await ctx.reply("❌ RTN inválido. Debe tener 14 dígitos numéricos.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         const { data: existing, error } = await supabase
//             .from('business')
//             .select('rtn_company')
//             .eq('rtn_company', rtn)
//             .limit(1);
//
//         if (error) {
//             await ctx.reply("⚠️ Error validando RTN. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         if (existing.length > 0) {
//             await ctx.reply("🚫 Este RTN ya está registrado. Debes comenzar de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//
//         ctx.useMemo(ctx.phoneNumber, "rtn", rtn);
//         await ctx.reply("¿Cuál es el nombre de la empresa?");
//     }
// }
//
// class AskCompanyName extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const name = ctx.body.trim();
//         if (!name) {
//             await ctx.reply("❌ El nombre de la empresa es obligatorio.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         ctx.useMemo(ctx.phoneNumber, "company_name", name);
//         await ctx.reply("¿Cuál es el correo de contacto?");
//     }
// }
//
// class AskCompanyEmail extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const email = ctx.body.trim();
//         if (!esCorreoValido(email)) {
//             await ctx.reply("❌ Correo inválido. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         const { data: existing, error } = await supabase
//             .from('business')
//             .select('email_company')
//             .eq('email_company', email)
//             .limit(1);
//
//         if (error) {
//             await ctx.reply("⚠️ Error validando correo. Intenta de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         if (existing.length > 0) {
//             await ctx.reply("🚫 Este correo ya está registrado. Debes comenzar de nuevo.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//
//         ctx.useMemo(ctx.phoneNumber, "company_email", email);
//         await ctx.reply("¿Cuántos empleados tienen aproximadamente?");
//     }
// }
//
// class AskCompanySize extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const size = ctx.body.trim();
//         if (!size || isNaN(size)) {
//             await ctx.reply("❌ Debes ingresar un número válido para cantidad de empleados.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         ctx.useMemo(ctx.phoneNumber, "company_size", size);
//         await ctx.reply("¿Cuál es el rubro de la empresa?");
//     }
// }
//
// class AskSector extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const sector = ctx.body.trim();
//         if (!sector) {
//             await ctx.reply("❌ El rubro es obligatorio.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//         ctx.useMemo(ctx.phoneNumber, "sector", sector);
//         await ctx.reply("✅ Procesando la información de su empresa...");
//
//         const dataToInsert = {
//             rtn_company: ctx.useMemo(ctx.phoneNumber, "rtn"),
//             name_company: ctx.useMemo(ctx.phoneNumber, "company_name"),
//             email_company: ctx.useMemo(ctx.phoneNumber, "company_email"),
//             company_size: ctx.useMemo(ctx.phoneNumber, "company_size"),
//             sector: ctx.useMemo(ctx.phoneNumber, "sector"),
//         };
//
//         const { error } = await supabase.from('business').insert([dataToInsert]);
//         if (error) {
//             await ctx.reply("❌ Error guardando datos, intenta más tarde.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//     }
// }
//
// class ResumenEmpresa extends Answer {
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const resumen = `
// 📝 *Resumen del registro de su empresa en Humansisu*:
// - RTN: ${ctx.useMemo(ctx.phoneNumber, "rtn")}
// - Empresa: ${ctx.useMemo(ctx.phoneNumber, "company_name")}
// - Correo: ${ctx.useMemo(ctx.phoneNumber, "company_email")}
// - Nº de empleados: ${ctx.useMemo(ctx.phoneNumber, "company_size")}
// - Rubro: ${ctx.useMemo(ctx.phoneNumber, "sector")}
//
// ✅ ¡Gracias por confiar en Humansisu! Pronto un asesor lo contactará.
//     `;
//         await ctx.reply(resumen);
//     }
// }
//
// export const FlowBusiness = new Flow()
//     .addAnswer("Excelente, estás en el flujo para *empresas que desean reclutar*.")
//     .addAnswer("A continuación solicitaremos algunos datos:")
//     .addAnswer("¿Cuál es su RTN?")
//     .addAnswer(AskRTN)
//     .addAnswer(AskCompanyName)
//     .addAnswer(AskCompanyEmail)
//     .addAnswer(AskCompanySize)
//     .addAnswer(AskSector)
//     .addAnswer(ResumenEmpresa)
//     .setName("FlowBusiness");
//
// // --- FLUJO SALUDO y SELECCIÓN ---
//
// class SelectorController extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 3);
//         const input = ctx.body.toLowerCase();
//
//         if (input.includes("empleo") || input.includes("1") || input.includes("trabajo")) {
//             ctx.FlowContext.nextFlow = FlowEmployees;
//             await ctx.reply("Has seleccionado el flujo de *empleados*.");
//         } else if (input.includes("empresa") || input.includes("reclutar") || input.includes("2")) {
//             ctx.FlowContext.nextFlow = FlowBusiness;
//             await ctx.reply("Has seleccionado el flujo de *empresas*.");
//         } else {
//             await ctx.reply("Por favor, escribe *empleo* o *empresa* para continuar.");
//             return ctx.moveToStep(ctx.phoneNumber, 0);
//         }
//     }
// }
//
// export const FlowSaludo = new Flow()
//     .addKeyboard(["hola", "hello"])
//     .addAnswer("👋 ¡Bienvenido a soy Jorge de *Humansisu*!")
//     .addAnswer(OneLineMessage([
//         "Seleccione una opción para continuar:",
//         "1. Estoy buscando *empleo* o escriba *1*",
//         "2. Soy una *empresa* que desea reclutar o escriba *2*",
//     ]))
//     .addAnswer(SelectorController)
//     .setName("Saludo");

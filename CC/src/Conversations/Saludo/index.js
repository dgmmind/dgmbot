// import { Flow } from "../../Flow/Flow.js";
// import {Answer} from "../../Flow/Answer.js";
// import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
//
// const cafes = ["Helado", "Con Leche", "Capuchino"]
//
// export const Final = new Flow()
//     .addAnswer("Gracias por su pedido! :D")
//     .addAnswer("Cafe Juanito agradece su preferencia")
//     .setName("Despedida")
//
// export class HeladoController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "extras", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Perfecto {name}! Tu café helado con {extras} estará listo pronto"))
//     }
// }
//
// export const FlowHelado = new Flow()
//     .addAnswer(`¡Excelente elección {name}! ☃️`)
//     .addAnswer("Nuestro café helado es perfecto para días calurosos")
//     .addAnswer("¿Le gustaría agregarlo con:")
//     .addAnswer("1. Crema batida")
//     .addAnswer("2. Jarabe de vainilla")
//     .addAnswer("3. Sin extras")
//     .addAnswer("Escriba su opción:")
//     .addAnswer(HeladoController)
//     .setName("Helado")
//     .setNextFlow(Final)
//
// export class CapuchinoController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "extras", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Perfecto {name}! Tu capuchino con {extras} estará listo pronto"))
//     }
// }
//
// export const FlowCapuchino = new Flow()
//     .addAnswer(`¡Magnífica elección {name}! ☕✨`)
//     .addAnswer("Nuestro capuchino tiene la espuma perfecta")
//     .addAnswer("¿Le gustaría personalizarlo?")
//     .addAnswer("1. Capuchino clásico")
//     .addAnswer("2. Con canela")
//     .addAnswer("3. Con chocolate")
//     .addAnswer("Escriba su opción:")
//     .addAnswer(CapuchinoController)
//     .setName("Capuchino")
//     .setNextFlow(Final)
//
// export class ConLecheController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "leche", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Perfecto {name}! Tu café con leche {leche} estará listo pronto"))
//     }
// }
//
// export const FlowConLeche = new Flow()
//     .addAnswer(`¡Perfecta elección {name}! ☕`)
//     .addAnswer("Nuestro café con leche es cremoso y delicioso")
//     .addAnswer("¿Qué tipo de leche prefiere?")
//     .addAnswer("1. Leche entera")
//     .addAnswer("2. Leche descremada")
//     .addAnswer("3. Leche de almendras")
//     .addAnswer("Escriba su opción:")
//     .addAnswer(ConLecheController)
//     .setName("Con Leche")
//     .setNextFlow(Final)
//
// // Array con los flows reales (objetos), no strings
// const flows = [FlowHelado, FlowConLeche, FlowCapuchino]
//
// export class MenuController extends Answer {
//     waitForAnswer = true
//     async handler(ctx) {
//         const option = Number(ctx.body[0])
//
//         if (isNaN(option) || !cafes[option - 1]) {
//             await ctx.reply("Usted no ha seleccionado una opción válida!")
//             ctx.moveToStep(ctx.phoneNumber, 0)
//             return
//         }
//
//         // Guardar la selección en memoria
//         ctx.useMemo(ctx.phoneNumber, "cafe", cafes[option - 1])
//
//         // Enviar mensaje de confirmación
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado Café {cafe}`))
//
//         // Cambiar el nextFlow del flow actual según la opción
//         ctx.FlowContext.nextFlow = flows[option - 1]
//     }
// }
//
// export const MenuFlow = new Flow()
//     .addKeyboard(["menu", "menú"])
//     .addAnswer(`Buenas tardes señor {name}, ¿cómo lo puedo ayudar hoy?`)
//     .addAnswer(OneLineMessage(["Contamos con:", "1. Café helado", "2. Café con Leche", "3. Capuchino"]))
//     .addAnswer(MenuController)
//     .setName("Menú")
//
// export class Saludo extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "name", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Hola {name}!"))
//     }
// }
//
// export const FlowSaludo = new Flow()
//     .addKeyboard(["hello", "sup", "whats doing"])
//     .addKeyboard({
//         key: ["hola", "que onda", "weee"],
//         mode: "equals",
//         sensitive: false,
//     })
//     .addAnswer("[TESTING] - Hola, ¿cuál es tu nombre?")
//     .addAnswer(Saludo)
//     .addAnswer("Será redirigido al menú...")
//     .setNextFlow(MenuFlow)
//     .setName("Saludo")
//
import { Flow } from "../../Flow/Flow.js";
import { Answer } from "../../Flow/Answer.js";
import { OneLineMessage } from "../../Flow/utils/OneLineMessage.js";

//
// === FLUJO DE EMPLEADOS ===
//

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

        if (input.includes("empleo") || input.includes("trabajo")) {
            ctx.FlowContext.nextFlow = FlowEmployees;
        } else if (input.includes("empresa") || input.includes("reclutar")) {
            ctx.FlowContext.nextFlow = FlowBusiness;
        } else {
            await ctx.reply("Por favor, escribe *empleo* o *empresa* para continuar.");
            ctx.moveToStep(ctx.phoneNumber, 0);
        }
    }
}

export const FlowSaludo = new Flow()
    .addKeyboard(["hola", "hello"])
    .addAnswer("👋 ¡Bienvenido a *Humansisu*!")
    .addAnswer(OneLineMessage([
        "¿Con quién tenemos el gusto de hablar?",
        "Seleccione una opción para continuar:",
        "1. Estoy buscando *empleo*",
        "2. Soy una *empresa* que desea reclutar",
    ]))
    .addAnswer(SelectorController)
    .setName("Saludo");


// "use client"
//
// import { Flow } from "../../Flow/Flow.js"
// import { Answer } from "../../Flow/Answer.js"
// import { OneLineMessage } from "../../Flow/utils/OneLineMessage.js"
//
// import { PDFReader } from "../../Flow/utils/PDFReader.js"
//
// const cafes = ["Helado", "Con Leche", "Capuchino", "Empleo"]
//
// export const Final = new Flow()
//     .addAnswer("Gracias por su pedido! :D")
//     .addAnswer("Cafe Juanito agradece su preferencia")
//     .setName("Despedida")
//
// export const FinalCV = new Flow()
//     .addAnswer("¡Gracias por enviar tu CV! 📄")
//     .addAnswer("Nuestro equipo de recursos humanos lo revisará")
//     .addAnswer("Te contactaremos pronto si tu perfil encaja con nuestras vacantes")
//     .addAnswer("¡Que tengas un excelente día! ☕")
//     .setName("Despedida CV")
//
// export class HeladoController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "extras", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Perfecto {name}! Tu café helado con {extras} estará listo pronto"))
//     }
// }
//
// export const FlowHelado = new Flow()
//     .addAnswer(`¡Excelente elección {name}! ☃️`)
//     .addAnswer("Nuestro café helado es perfecto para días calurosos")
//     .addAnswer("¿Le gustaría agregarlo con:")
//     .addAnswer("1. Crema batida")
//     .addAnswer("2. Jarabe de vainilla")
//     .addAnswer("3. Sin extras")
//     .addAnswer("Escriba su opción:")
//     .addAnswer(HeladoController)
//     .setName("Helado")
//     .setNextFlow(Final)
//
// export class CapuchinoController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "extras", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Perfecto {name}! Tu capuchino con {extras} estará listo pronto"))
//     }
// }
//
// export const FlowCapuchino = new Flow()
//     .addAnswer(`¡Magnífica elección {name}! ☕✨`)
//     .addAnswer("Nuestro capuchino tiene la espuma perfecta")
//     .addAnswer("¿Le gustaría personalizarlo?")
//     .addAnswer("1. Capuchino clásico")
//     .addAnswer("2. Con canela")
//     .addAnswer("3. Con chocolate")
//     .addAnswer("Escriba su opción:")
//     .addAnswer(CapuchinoController)
//     .setName("Capuchino")
//     .setNextFlow(Final)
//
// export class ConLecheController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "leche", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Perfecto {name}! Tu café con leche {leche} estará listo pronto"))
//     }
// }
//
// export const FlowConLeche = new Flow()
//     .addAnswer(`¡Perfecta elección {name}! ☕`)
//     .addAnswer("Nuestro café con leche es cremoso y delicioso")
//     .addAnswer("¿Qué tipo de leche prefiere?")
//     .addAnswer("1. Leche entera")
//     .addAnswer("2. Leche descremada")
//     .addAnswer("3. Leche de almendras")
//     .addAnswer("Escriba su opción:")
//     .addAnswer(ConLecheController)
//     .setName("Con Leche")
//     .setNextFlow(Final)
//
// export class CVController extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         console.log("🔍 DEBUG CVController - Iniciando verificación")
//         console.log("- Body:", ctx.body)
//         console.log("- Tiene documento:", ctx.hasDocument())
//
//         if (ctx.hasDocument()) {
//             const documentInfo = ctx.getDocumentInfo()
//             console.log("📄 Información del documento:", documentInfo)
//
//             if (!documentInfo) {
//                 await ctx.reply("❌ Error al procesar el documento")
//                 ctx.moveToStep(ctx.phoneNumber, 0)
//                 return
//             }
//
//             const { fileName, fileSize, mimeType } = documentInfo
//
//             // Verificar que sea PDF o DOC
//             const validTypes = [
//                 "application/pdf",
//                 "application/msword",
//                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                 "application/octet-stream",
//             ]
//
//             const isValidType =
//                 validTypes.includes(mimeType) ||
//                 fileName.toLowerCase().includes(".pdf") ||
//                 fileName.toLowerCase().includes(".doc")
//
//             if (isValidType) {
//                 await ctx.reply("📥 Descargando y procesando tu CV...")
//                 await ctx.delayWithPresence("composing", 3)
//
//                 try {
//                     // Descargar el documento
//                     const buffer = await ctx.downloadDocument()
//
//                     // Guardar el archivo
//                     const savedFile = await PDFReader.saveDocument(buffer, fileName, ctx.phoneNumber)
//
//                     // Guardar información en memoria
//                     ctx.useMemo(ctx.phoneNumber, "cv_filename", fileName)
//                     ctx.useMemo(ctx.phoneNumber, "cv_size", fileSize)
//                     ctx.useMemo(ctx.phoneNumber, "cv_type", mimeType)
//                     ctx.useMemo(ctx.phoneNumber, "cv_path", savedFile.filePath)
//
//                     await ctx.reply(`✅ CV recibido: "${fileName}"`)
//                     await ctx.reply(`📊 Tamaño: ${Math.round(fileSize / 1024)} KB`)
//
//                     // Si es PDF, extraer y analizar el texto
//                     if (mimeType === "application/pdf" || fileName.toLowerCase().includes(".pdf")) {
//                         await ctx.reply("🔍 Analizando contenido del CV...")
//                         await ctx.delayWithPresence("composing", 2)
//
//                         try {
//                             const pdfData = await PDFReader.extractTextFromPDF(buffer)
//                             const analysis = PDFReader.analyzeCV(pdfData.text)
//
//                             // Guardar análisis en memoria
//                             ctx.useMemo(ctx.phoneNumber, "cv_text", pdfData.text.substring(0, 1000)) // Primeros 1000 caracteres
//                             ctx.useMemo(ctx.phoneNumber, "cv_pages", pdfData.pages)
//                             ctx.useMemo(ctx.phoneNumber, "cv_analysis", JSON.stringify(analysis))
//
//                             await ctx.reply("📋 Análisis de tu CV:")
//                             await ctx.reply(`📄 Páginas: ${pdfData.pages}`)
//
//                             if (analysis.hasEmail) {
//                                 await ctx.reply(`📧 Email encontrado: ${analysis.emails?.[0] || "Sí"}`)
//                             }
//
//                             if (analysis.hasPhone) {
//                                 await ctx.reply(`📱 Teléfono encontrado: Sí`)
//                             }
//
//                             const sections = []
//                             if (analysis.hasExperience) sections.push("Experiencia laboral")
//                             if (analysis.hasEducation) sections.push("Educación")
//                             if (analysis.hasSkills) sections.push("Habilidades")
//
//                             if (sections.length > 0) {
//                                 await ctx.reply(`✅ Secciones detectadas: ${sections.join(", ")}`)
//                             }
//
//                             if (analysis.keywords.length > 0) {
//                                 await ctx.reply(`🎯 Palabras clave relevantes: ${analysis.keywords.join(", ")}`)
//                             }
//
//                             if (analysis.languages.length > 0) {
//                                 await ctx.reply(`🌍 Idiomas: ${analysis.languages.join(", ")}`)
//                             }
//
//                             // Log completo para el administrador
//                             console.log(`📄 CV PROCESADO EXITOSAMENTE:`)
//                             console.log(`- Candidato: ${ctx.useMemo(ctx.phoneNumber, "name") || "Sin nombre"}`)
//                             console.log(`- Teléfono: ${ctx.phoneNumber}`)
//                             console.log(`- Archivo: ${fileName}`)
//                             console.log(`- Guardado en: ${savedFile.filePath}`)
//                             console.log(`- Páginas: ${pdfData.pages}`)
//                             console.log(`- Análisis:`, analysis)
//                             console.log("=".repeat(60))
//                         } catch (pdfError) {
//                             console.error("❌ Error al procesar PDF:", pdfError)
//                             await ctx.reply("⚠️ CV recibido pero no pude analizar el contenido")
//                             await ctx.reply("El archivo se guardó correctamente para revisión manual")
//                         }
//                     } else {
//                         await ctx.reply("📄 Documento recibido (formato DOC)")
//                         await ctx.reply("Se guardó para revisión manual")
//                     }
//                 } catch (downloadError) {
//                     console.error("❌ Error al descargar documento:", downloadError)
//                     await ctx.reply("❌ Error al procesar el documento")
//                     await ctx.reply("Por favor intenta enviarlo nuevamente")
//                     ctx.moveToStep(ctx.phoneNumber, 0)
//                     return
//                 }
//             } else {
//                 await ctx.reply("❌ Por favor envía tu CV en formato PDF o DOC/DOCX")
//                 await ctx.reply(`Tipo recibido: ${mimeType}`)
//                 ctx.moveToStep(ctx.phoneNumber, 0)
//                 return
//             }
//         } else {
//             // No hay documento
//             if (ctx.body && (ctx.body.toLowerCase().includes("cv") || ctx.body.toLowerCase().includes("curriculum"))) {
//                 await ctx.reply("📄 Para enviar tu CV:")
//                 await ctx.reply("1️⃣ Toca el ícono 📎 (clip)")
//                 await ctx.reply("2️⃣ Selecciona 'Documento'")
//                 await ctx.reply("3️⃣ Elige tu CV (PDF o DOC)")
//                 await ctx.reply("4️⃣ Envíalo")
//                 ctx.moveToStep(ctx.phoneNumber, 0)
//                 return
//             } else {
//                 await ctx.reply("❌ No recibí ningún documento")
//                 await ctx.reply("Usa el botón 📎 para adjuntar tu CV")
//                 ctx.moveToStep(ctx.phoneNumber, 0)
//                 return
//             }
//         }
//     }
// }
//
// export const FlowCV = new Flow()
//     .addAnswer(`¡Excelente {name}! 💼`)
//     .addAnswer("Nos alegra saber que estás interesado en trabajar con nosotros")
//     .addAnswer("En Café Juanito siempre buscamos talento apasionado por el café ☕")
//     .addAnswer("📄 Por favor envía tu CV en formato PDF o DOC")
//     .addAnswer("Usa el botón de 📎 (clip) para adjuntar el archivo")
//     .addAnswer(CVController)
//     .setName("CV")
//     .setNextFlow(FinalCV)
//
// // Array con los flows reales (objetos), no strings
// const flows = [FlowHelado, FlowConLeche, FlowCapuchino, FlowCV]
//
// export class MenuController extends Answer {
//     waitForAnswer = true
//     async handler(ctx) {
//         const option = Number(ctx.body[0])
//
//         if (isNaN(option) || !cafes[option - 1]) {
//             await ctx.reply("Usted no ha seleccionado una opción válida!")
//             ctx.moveToStep(ctx.phoneNumber, 0)
//             return
//         }
//
//         // Guardar la selección en memoria
//         ctx.useMemo(ctx.phoneNumber, "seleccion", cafes[option - 1])
//
//         if (option === 4) {
//             // Opción de empleo
//             await ctx.reply("¡Qué bueno que quieras formar parte de nuestro equipo! 🎉")
//         } else {
//             // Opciones de café
//             await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado Café {seleccion}`))
//         }
//
//         // Cambiar el nextFlow del flow actual según la opción
//         ctx.FlowContext.nextFlow = flows[option - 1]
//     }
// }
//
// export const MenuFlow = new Flow()
//     .addKeyboard(["menu", "menú"])
//     .addAnswer(`Buenas tardes señor {name}, ¿cómo lo puedo ayudar hoy?`)
//     .addAnswer(
//         OneLineMessage(["Contamos con:", "1. Café helado", "2. Café con Leche", "3. Capuchino", "4. Empleo (Enviar CV)"]),
//     )
//     .addAnswer(MenuController)
//     .setName("Menú")
//
// export class Saludo extends Answer {
//     waitForAnswer = true
//     constructor() {
//         super()
//     }
//     async handler(ctx) {
//         await ctx.delayWithPresence("composing", 1)
//         ctx.useMemo(ctx.phoneNumber, "name", ctx.body)
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, "Hola {name}!"))
//     }
// }
//
// export const FlowSaludo = new Flow()
//     .addKeyboard(["hello", "sup", "whats doing"])
//     .addKeyboard({
//         key: ["hola", "que onda", "weee"],
//         mode: "equals",
//         sensitive: false,
//     })
//     .addAnswer("[TESTING] - Hola, ¿cuál es tu nombre?")
//     .addAnswer(Saludo)
//     .addAnswer("Será redirigido al menú...")
//     .setNextFlow(MenuFlow)
//     .setName("Saludo")

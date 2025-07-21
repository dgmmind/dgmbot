import { Flow } from "../Flow/Flow.js";
import { Answer } from "../Flow/Answer.js";
import { OneLineMessage } from "../Flow/utils/OneLineMessage.js";
import { supabase } from "../Flow/utils/supabase.js";



class DetailBusiness extends Answer {
    async handler(ctx) {
        try {
            await ctx.delayWithPresence("composing", 1);

            // Obtener datos
            const name = ctx.useMemo(ctx.phoneNumber, "NAME_BUSINESS");
            const industry = ctx.useMemo(ctx.phoneNumber, "INDUSTRY_BUSINESS");
            const phone = ctx.useMemo(ctx.phoneNumber, "PHONE_BUSINESS");
            const owner = ctx.useMemo(ctx.phoneNumber, "OWNER_BUSINESS");
            const email = ctx.useMemo(ctx.phoneNumber, "EMAIL_BUSINESS");
            const rtn = '00000000000000'; // RTN por defecto

            // Insertar registro
            await ctx.delayWithPresence("composing", 1);
            const { error } = await supabase
                .from('business')
                .insert([{
                    name_company: name,
                    rtn_company: rtn,
                    company_industry: industry,
                    company_owner: owner,
                    phone_number: phone,
                    email_company: email
                }]);

            if (error) {
                await ctx.reply('❌ Ocurrió un error al guardar los datos. Intenta más tarde.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }

            // Log para depuración
            console.log('✅ Empresa guardada en Supabase:', {
                name_company: name,
                rtn_company: rtn,
                company_industry: industry,
                company_owner: owner,
                phone_number: phone,
                email_company: email
            });

            // Mostrar resumen
            const resumen = `\n*Empresa*: ${name}\n*Industria*: ${industry}\n*Telefono*: ${phone}\n*Propietario*: ${owner}\n*Correo*: ${email}\n✅ ¡Gracias por confiar en Humanosisu! Pronto un asesor lo contactará.`;

            await ctx.reply(resumen);
        } catch (error) {
            console.error('Error en DetailBusiness:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
            return ctx.moveToStep(ctx.phoneNumber, 0);
        }
    }
}
export const FinalBusiness = new Flow()
    .addAnswer("Sus datos fueron registrados!")
    .addAnswer(DetailBusiness)
    .setName("Despedida");

    export class AskEmailController extends Answer {
        waitForAnswer = true;
    
        async handler(ctx) {
            try {
                const email = ctx.body.trim().toLowerCase();
                const isValidEmail = /^[^\s@]+@[^-\s@]+\.[^\s@]+$/.test(email);
                if (!isValidEmail) {
                    await ctx.reply('❌ El correo electronico debe tener el formato *juanperez@gmail.com* y no debe contener espacios ni caracteres especiales.');
                    return ctx.moveToStep(ctx.phoneNumber, 0);
                }
                await ctx.delayWithPresence("composing", 1);
                let { data: emailExists } = await supabase
                    .from('business')
                    .select('email_company')
                    .eq('email_company', email)
                    .maybeSingle();
                console.log('Resultado validación email:', emailExists);
                if (emailExists) {
                    await ctx.reply('❌ El correo ya está registrado. Intenta con otro.');
                    return ctx.moveToStep(ctx.phoneNumber, 0);
                }
                ctx.useMemo(ctx.phoneNumber, "EMAIL_BUSINESS", email);
                await ctx.delayWithPresence("composing", 3);
            } catch (error) {
                console.error('Error en AskEmailController:', error);
                await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
        }
    }

    export const AskEmail = new Flow()
    .addAnswer(`Nombre del propietario de su empresa: *{OWNER_BUSINESS}*`)
    .addAnswer("¿Cuál es el correo electronico de su empresa, ejemplo: *juanperez@gmail.com*?")
    .addAnswer(AskEmailController)
    .setName("AskEmail")
    .setNextFlow(FinalBusiness)

    export class AskOwnerController extends Answer {
        waitForAnswer = true;
    
        async handler(ctx) {
            try {
                const owner = ctx.body.trim();
                ctx.useMemo(ctx.phoneNumber, "OWNER_BUSINESS", owner);
                await ctx.delayWithPresence("composing", 3);
            } catch (error) {
                console.error('Error en AskOwnerController:', error);
                await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
        }
    }

export const AskOwner = new Flow()
    .addAnswer(`Numero de telefono de su empresa: *{PHONE_BUSINESS}*`)
    .addAnswer("¿Cuál es el nombre del propietario de su empresa, ejemplo: *Juan Perez*?")
    .addAnswer(AskOwnerController)
    .setName("AskOwner")
    .setNextFlow(AskEmail);

    export class AskPhoneController extends Answer {
        waitForAnswer = true;
    
        async handler(ctx) {
            try {
                const phone = ctx.body.trim();
                const isValidPhone = /^\d{8}$/.test(phone);
                if (!isValidPhone) {
                    await ctx.reply('❌ El numero de telefono debe tener el formato *33158947* y no debe contener letras ni espacios.');
                    return ctx.moveToStep(ctx.phoneNumber, 0);
                }
                await ctx.delayWithPresence("composing", 1);
                let { data: phoneExists } = await supabase
                    .from('business')
                    .select('phone_number')
                    .eq('phone_number', phone)
                    .maybeSingle();
                console.log('Resultado validación phone:', phoneExists);
                if (phoneExists) {
                    await ctx.reply('❌ El teléfono ya está registrado. Intenta con otro.');
                    return ctx.moveToStep(ctx.phoneNumber, 0);
                }
                ctx.useMemo(ctx.phoneNumber, "PHONE_BUSINESS", phone);
                await ctx.delayWithPresence("composing", 3);
            } catch (error) {
                console.error('Error en AskPhoneController:', error);
                await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
        }
    }

    export const AskPhone = new Flow()
    .addAnswer(`Industria de su empresa: *{INDUSTRY_BUSINESS}*`)
    .addAnswer("¿Cuál es el numero de telefono de su empresa, ejemplo: *33158947*?")
    .addAnswer(AskPhoneController)
    .setName("AskPhone")
    .setNextFlow(AskOwner)


    export class AskIndustryController extends Answer {
        waitForAnswer = true;
    
        async handler(ctx) {
            try {
                const industry = ctx.body.trim();
                ctx.useMemo(ctx.phoneNumber, "INDUSTRY_BUSINESS", industry);
                await ctx.delayWithPresence("composing", 3);

            } catch (error) {
                console.error('Error en AskIndustryController:', error);
                await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
        }
    }


    export const AskIndustry = new Flow()
    .addAnswer(`Nombre de empresa: *{NAME_BUSINESS}*`)
    .addAnswer("¿Cuál es la industria de su empresa, ejemplo: *Construcción*?")
    .addAnswer(AskIndustryController)
    .setName("AskIndustry")
    .setNextFlow(AskPhone)   

    export class AskNameController extends Answer {
        waitForAnswer = true;
        async handler(ctx) {
            try {
                ctx.useMemo(ctx.phoneNumber, "NAME_BUSINESS", ctx.body);
                await ctx.delayWithPresence("composing", 3)
            } catch (error) {
                console.error('Error en AskNameController:', error);
                await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
        }
    }


export const FlowBusiness = new Flow()
    .addAnswer("Excelente, completa los siguientes datos de empresa.")
    .addAnswer(OneLineMessage([
        "*¿Como se llama su empresa?*"
    ]))
    .addAnswer(AskNameController)
    .setName("AskName")
    .setNextFlow(AskIndustry);


// FLUJO DE EMPLEADOS

//candidate_name	candidate_identity	phone_number	candidate_email


export class DetailEmployees extends Answer {
    async handler(ctx) {
        try {
            await ctx.delayWithPresence("composing", 1);
            // obtener datos
            const name = ctx.useMemo(ctx.phoneNumber, "NAME_EMPLOYEES");
            const identity = ctx.useMemo(ctx.phoneNumber, "IDENTITY_EMPLOYEES");
            const phone = ctx.useMemo(ctx.phoneNumber, "PHONE_EMPLOYEES");
            const email = ctx.useMemo(ctx.phoneNumber, "EMAIL_EMPLOYEES");
            const language = 'SPA'; // LANG por defecto

            // insertar datos
            await ctx.delayWithPresence("composing", 1);
            const { error } = await supabase
                .from('candidates')
                .insert([{
                    candidate_name: name,
                    candidate_identity: identity,
                    phone_number: phone,
                    candidate_email: email,
                    candidate_language: language
                }]);
                if (error) {
                    await ctx.reply('❌ Ocurrió un error al guardar los datos. Intenta más tarde.', error);
                    return ctx.moveToStep(ctx.phoneNumber, 0);
                }
                await ctx.delayWithPresence("composing", 1);

 // Mostrar resumen
 const resumen = `\n*Nombre*: ${name}\n*Identidad*: ${identity}\n*Telefono*: ${phone}\n*Correo*: ${email}\n✅ ¡Gracias por confiar en Humanosisu! Pronto un asesor lo contactará.`;

 await ctx.reply(resumen);

        } catch (error) {
            console.error('Error en DetailEmployees:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.'); 
        }
    }
}
export const FinalEmployees = new Flow()
    .addAnswer("Sus datos fueron registrados!")
    .addAnswer(DetailEmployees)
    .setName("Despedida");

export class AskEmailEmployeesController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        try {
            const email = ctx.body.trim().toLowerCase();
            // Validar si el correo ya existe
            const { data: emailExists } = await supabase
                .from('candidates')
                .select('candidate_email')
                .eq('candidate_email', email)
                .maybeSingle();
            if (emailExists) {
                await ctx.reply('❌ El correo ya está registrado. Intenta con otro.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
            ctx.useMemo(ctx.phoneNumber, "EMAIL_EMPLOYEES", email);
            await ctx.delayWithPresence("composing", 3)
        } catch (error) {
            console.error('Error en AskEmailEmployeesController:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        }
    }
}

export const AskEmailEmployees = new Flow()
.addAnswer(`Numero de telefono de empleado: *{PHONE_EMPLOYEES}*`)
.addAnswer("¿Cuál es su correo electronico, ejemplo: *juanperez@gmail.com*?")
.addAnswer(AskEmailEmployeesController)
.setName("AskPhoneEmployees")
.setNextFlow(FinalEmployees) 


export class AskPhoneEmployeesController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        try {
            const phone = ctx.body.trim();
            // Validar si el teléfono ya existe
            const { data: phoneExists } = await supabase
                .from('candidates')
                .select('phone_number')
                .eq('phone_number', phone)
                .maybeSingle();
            if (phoneExists) {
                await ctx.reply('❌ El número de teléfono ya está registrado. Intenta con otro.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
            ctx.useMemo(ctx.phoneNumber, "PHONE_EMPLOYEES", phone);
            await ctx.delayWithPresence("composing", 3)
        } catch (error) {
            console.error('Error en AskPhoneEmployeesController:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        }
    }
}






export const AskPhoneEmployees = new Flow()
.addAnswer(`Identidad de empleado: *{IDENTITY_EMPLOYEES}*`)
.addAnswer("¿Cuál es su numero de telefono, ejemplo: *33158947*?")
.addAnswer(AskPhoneEmployeesController)
.setName("AskPhoneEmployees")
.setNextFlow(AskEmailEmployees) 


export class AskIdentityEmployeesController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        try {
            const identity = ctx.body.trim();
            // Validar si la identidad ya existe
            const { data: identityExists } = await supabase
                .from('candidates')
                .select('candidate_identity')
                .eq('candidate_identity', identity)
                .maybeSingle();
            if (identityExists) {
                await ctx.reply('❌ La identidad ya está registrada. Intenta con otra.');
                return ctx.moveToStep(ctx.phoneNumber, 0);
            }
            ctx.useMemo(ctx.phoneNumber, "IDENTITY_EMPLOYEES", identity);
            await ctx.delayWithPresence("composing", 3)
        } catch (error) {
            console.error('Error en AskIdentityEmployeesController:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        }
    }
}

export const AskIdentityEmployees = new Flow()
.addAnswer(`Nombre de empleado: *{NAME_EMPLOYEES}*`)
.addAnswer("¿Cuál es su identidad, ejemplo: *1234567890*?")
.addAnswer(AskIdentityEmployeesController)
.setName("AskIdentityEmployees")
.setNextFlow(AskPhoneEmployees) 



export class AskNameEmployeesController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        try {
            ctx.useMemo(ctx.phoneNumber, "NAME_EMPLOYEES", ctx.body);
            await ctx.delayWithPresence("composing", 3)
        } catch (error) {
            console.error('Error en AskNameEmployeesController:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        }
    }
}



export const FlowEmployees = new Flow()
    .addAnswer("Excelente, completa los siguientes datos de empleado.")
    .addAnswer(OneLineMessage([
        "*¿Como te llamas?*"
    ]))
    .addAnswer(AskNameEmployeesController)
    .setName("AskName")
    .setNextFlow(AskIdentityEmployees);



















const menuInit = ["Empleo", "Empresa"];
export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        try {
            const input = ctx.body.toLowerCase().trim();
            await ctx.delayWithPresence("composing", 3)
            
            // Validar opciones de empleo
            if (input === "1" || input === "empleo" || input.includes("empleo")) {
                ctx.FlowContext.nextFlow = FlowEmployees;
                return;
            }
            
            // Validar opciones de empresa
            if (input === "2" || input === "empresa" || input.includes("empresa")) {
                ctx.FlowContext.nextFlow = FlowBusiness;
                return;
            }
            
            // Si no coincide con ninguna opción
            await ctx.reply('❌ Opción no válida. Por favor escribe:\n• *1* o *empleo* para buscar trabajo\n• *2* o *empresa* para registrar empresa');
            ctx.moveToStep(ctx.phoneNumber, 0);
        } catch (error) {
            console.error('Error en MenuController:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
            return ctx.moveToStep(ctx.phoneNumber, 0);
        }
    }
}
export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(OneLineMessage(["Eres una empresa o buscas empleo escribe el numero de opcion", "1. Busco empleo", "2. Soy una empresa"]))
    .addAnswer(MenuController)
    .setName("Menú")



export class Saludo extends Answer {
    waitForAnswer = true;
    constructor() {
        super();
    }
    async handler(ctx) {
        try {
            ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
            await ctx.delayWithPresence('composing', 3);
            await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Hola {name}!'));

        } catch (error) {
            console.error('Error en Saludo:', error);
            await ctx.reply('❌ Ocurrió un error inesperado. Intenta de nuevo más tarde.');
            return ctx.moveToStep(ctx.phoneNumber, 0);
        }
    }
}


export const FlowSaludo = new Flow()
    .addKeyboard(['hello', 'sup', 'whats doing'])
    .addKeyboard({
    key: ["hola", 'que onda', 'weee'],
    mode: 'equals',
    sensitive: false
})
    .addAnswer('Humanosisu - Hola, cual es tu nombre?')
    .addAnswer(Saludo)
    .setNextFlow(MenuFlow)
    .setName("Saludo");
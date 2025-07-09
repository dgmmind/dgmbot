import { Kind } from "../../Flow/Context.js";
import { Answer } from "../../Flow/Answer.js";
export class Saludo extends Answer {
    waitForAnswer = true;
    constructor() {
        super();
    }
    async handler(ctx) {
        ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
        await ctx.delayWithPresence('composing', 1);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Hola {name}!'));
        return;
    }
}
//# sourceMappingURL=controller.js.map
"use client"
import { Answer } from "./Answer.js"
import { Analyzer } from "./Analyzer.js"
import { Context } from "./Context.js"
import { Memo } from "./Memo.js"

export class Manager {
    database
    BlackList
    WhiteList
    delay = 1000
    Memo = Memo.getInstance()
    ContextReference = Context
    Analyzer = new Analyzer([])
    events = []

    // ✅ NUEVO: Sistema de timeout para flows inactivos
    flowTimeouts = new Map() // Almacena los timeouts activos
    inactivityTimeout = 5 * 60 * 1000 // 5 minutos en milisegundos

    setDatabase(database) {
        this.database = database
    }
    setDelay(ms) {
        this.delay = ms
    }
    useBlackList = (bl) => {
        this.BlackList = bl
        return this
    }
    useContext(newContext) {
        this.ContextReference = newContext
    }
    someEvent(Message) {
        const [event] = Object.keys(Message)[0]
        return this.events.some((ev) => ev === event) || !Message.key.participant
    }
    useEventDisabler = (events) => {
        if (!Array.isArray(events)) {
            this.events.push(events)
            return this
        }
        this.events = this.events.concat(events)
        return this
    }
    useWhiteList = (wl) => {
        this.WhiteList = wl
        return this
    }

    // ✅ NUEVO: Configurar tiempo de inactividad
    setInactivityTimeout = (minutes) => {
        this.inactivityTimeout = minutes * 60 * 1000
        return this
    }

    // ✅ NUEVO: Iniciar timeout para un flow
    startFlowTimeout = (jid) => {
        // Limpiar timeout anterior si existe
        this.clearFlowTimeout(jid)

        const timeoutId = setTimeout(() => {
            console.log(`⏰ Flow timeout para ${jid} - Limpiando por inactividad`)
            this.cleanupInactiveFlow(jid)
        }, this.inactivityTimeout)

        this.flowTimeouts.set(jid, timeoutId)
        console.log(`⏱️ Timeout iniciado para ${jid} (${this.inactivityTimeout / 1000 / 60} minutos)`)
    }

    // ✅ NUEVO: Limpiar timeout de un flow
    clearFlowTimeout = (jid) => {
        const timeoutId = this.flowTimeouts.get(jid)
        if (timeoutId) {
            clearTimeout(timeoutId)
            this.flowTimeouts.delete(jid)
            console.log(`🔄 Timeout cancelado para ${jid}`)
        }
    }

    // ✅ NUEVO: Limpiar flow inactivo
    cleanupInactiveFlow = async (jid) => {
        const flow = this.Flows.get(jid)
        if (flow) {
            console.log(`🧹 Limpiando flow inactivo: ${flow.flowName} para ${jid}`)

            // Enviar mensaje de timeout al usuario
            await this.SocketConnection?.sendMessage(jid, {
                text: "⏰ *Tiempo agotado*\n\nLa conversación ha sido cerrada por inactividad.\nEscribe *hola* para comenzar de nuevo.",
            })

            // Limpiar flow y memoria
            this.Flows.delete(jid)
            this.Memo.reset(jid)
            this.clearFlowTimeout(jid)
        }
    }

    // ✅ NUEVO: Reiniciar timeout cuando hay actividad
    resetFlowTimeout = (jid) => {
        if (this.Flows.has(jid)) {
            this.startFlowTimeout(jid)
        }
    }

    haveReset = (jid, context) => {
        const flow = this.Flows.get(jid)
        if (!flow) return
        const haveNext = flow.getNext()
        if (!haveNext) {
            if (!flow.nextFlow) {
                this.Memo.reset(jid)
                this.clearFlowTimeout(jid) // ✅ Limpiar timeout al terminar
                return this.Flows.delete(jid)
            }
            this.Flows.set(jid, flow.nextFlow.copy())
            this.startFlowTimeout(jid) // ✅ Reiniciar timeout para nuevo flow
            return this.FlowQueue(context)
        }
        flow.CurrentAnswer++
        this.startFlowTimeout(jid) // ✅ Reiniciar timeout en cada paso
        this.FlowQueue(context)
    }

    moveToStep = (jid, step) => {
        const flow = this.Flows.get(jid)
        flow.skipToStep(step)
        this.Flows.set(jid, flow)
        this.resetFlowTimeout(jid) // ✅ Reiniciar timeout al mover paso
    }

    SocketConnection
    Flows = new Map()
    attach = (whatsapp_context) => {
        this.SocketConnection = whatsapp_context
        this.SocketConnection.ev.on("messages.upsert", this.getMessage.bind(this))
    }
    async _delay(ms) {
        return new Promise((res, rej) => {
            setTimeout(() => res(), ms)
        })
    }
    async useDelay(jid) {
        await this.SocketConnection?.sendPresenceUpdate("composing", jid)
        await this._delay(this.delay)
        await this.SocketConnection?.sendPresenceUpdate("available", jid)
    }
    reset = (jid) => {
        const flow = this.Flows.get(jid)
        console.log("Check if reset...")
        if (!flow) return false
        if (!flow.getNext()) {
            console.log("Going to next flow")
            if (flow.nextFlow) {
                flow.nextFlow.CurrentAnswer = -1
                return this.Flows.set(jid, flow.nextFlow)
            }
            this.Flows.delete(jid)
            this.Memo.reset(jid)
            this.clearFlowTimeout(jid) // ✅ Limpiar timeout
            return false
        }
        return false
    }
    addFlow = (flow) => {
        if (Array.isArray(flow)) {
            flow.forEach((f) => this.Analyzer.addFlow(f))
            return this
        }
        this.Analyzer.addFlow(flow)
        return this
    }
    sendToFlow = (flow, jid) => {
        // Crear una copia del flow y resetear su posición
        const newFlow = flow.copy()
        newFlow.CurrentAnswer = -1
        this.Flows.set(jid, newFlow)
        this.startFlowTimeout(jid) // ✅ Iniciar timeout para nuevo flow
        // Ejecutar inmediatamente el nuevo flow
        this.executeFlow(jid)
    }
    executeFlow = async (jid) => {
        const flow = this.Flows.get(jid)
        if (!flow) return
        flow.CurrentAnswer++
        const currentAnswer = flow.getCurrentAnswer()
        if (typeof currentAnswer === "string") {
            await this.useDelay(jid)
            this.SocketConnection?.sendMessage(jid, {
                text: this.Memo.useMemoText(jid, currentAnswer),
            })
            // Continuar con el siguiente paso
            this.continueFlow(jid)
        }
    }
    continueFlow = async (jid) => {
        const flow = this.Flows.get(jid)
        if (!flow) return
        const nextAnswer = flow.getNext()
        if (nextAnswer) {
            setTimeout(() => this.executeFlow(jid), this.delay)
        } else {
            // Flow terminado, ir al siguiente si existe
            if (flow.nextFlow) {
                this.sendToFlow(flow.nextFlow, jid)
            } else {
                this.Flows.delete(jid)
                this.Memo.reset(jid)
                this.clearFlowTimeout(jid) // ✅ Limpiar timeout
            }
        }
    }
    FlowNotFountMessage = ""
    getMessage = async (context) => {
        const cellPhone = context.messages[0].key.remoteJid
        const message = context.messages[0].message?.extendedTextMessage?.text || context.messages[0].message?.conversation
        if (!this.someEvent(context.messages[0])) return
        if (this.BlackList && this.BlackList.get(cellPhone)) return
        if (this.WhiteList && this.WhiteList.get(cellPhone)) return

        let flow = this.Flows.get(cellPhone)
        // if the message had sent by us, we don't make anything
        if (!message || context.messages[0].key.fromMe) return

        // ✅ NUEVO: Reiniciar timeout cuando hay actividad del usuario
        if (flow) {
            this.resetFlowTimeout(cellPhone)
        }

        // if the flow wasn't found we will create one with the analyzer class
        if (!flow) {
            const FlowFount = this.Analyzer.parse(message)
            if (!FlowFount && this.FlowNotFountMessage)
                return this.SocketConnection?.sendMessage(cellPhone, { text: this.FlowNotFountMessage })
            if (!FlowFount) return
            this.Flows.set(cellPhone, FlowFount)
            this.startFlowTimeout(cellPhone) // ✅ Iniciar timeout para nuevo flow
            console.log(`Entering in flow ${FlowFount.flowName}`)
            flow = this.Flows.get(cellPhone)
        }
        await this.FlowQueue(context)
    }
    // TODO: implement what to do when flow gets on its end.
    FlowQueue = async (context) => {
        const jid = context.messages[0].key.remoteJid
        const flow = this.Flows.get(jid)
        const CurrentAnswer = flow.getCurrentAnswer()
        if (typeof CurrentAnswer === "string") {
            console.log("Answer is of string type.")
            await this.useDelay(jid)
            this.SocketConnection?.sendMessage(jid, {
                text: this.Memo.useMemoText(jid, CurrentAnswer),
            })
            this.haveReset(jid, context)
        } else if (CurrentAnswer.prototype && CurrentAnswer.prototype instanceof Answer) {
            console.log("Answer is AnswerAPI like")
            const nanswer = new CurrentAnswer()
            // here is the logic to the context messages
            if (nanswer.waitForAnswer && !flow.AreWeWaiting) {
                flow.AreWeWaiting = true
                this.Flows.set(jid, flow)
                this.startFlowTimeout(jid) // ✅ Iniciar timeout mientras espera respuesta
                console.log(this.Flows.get(jid))
                return
            }
            if (nanswer.waitForAnswer && flow.AreWeWaiting) {
                const response = nanswer.handler(new this.ContextReference(context.messages[0], this.SocketConnection, flow))
                if (response instanceof Promise) {
                    return response.then(() => {
                        flow.AreWeWaiting = false
                        this.Flows.set(jid, flow)
                        this.haveReset(jid, context)
                    })
                }
                flow.AreWeWaiting = false
                this.Flows.set(jid, flow)
                this.haveReset(jid, context)
            }
            if (!nanswer.waitForAnswer) {
                const response = nanswer.handler(new this.ContextReference(context.messages[0], this.SocketConnection, flow))
                if (response instanceof Promise) {
                    await response.then()
                }
                this.haveReset(jid, context)
            }
        }
        if (typeof CurrentAnswer === "object") {
            console.log("Answer is Baileys-Like")
            await this.useDelay(jid)
            this.SocketConnection?.sendMessage(jid, CurrentAnswer)
            this.haveReset(jid, context)
        }
    }
    static Instance
    static getInstance() {
        if (!this.Instance) this.Instance = new Manager()
        return this.Instance
    }
}

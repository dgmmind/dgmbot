import { Manager } from "./Manager.js";
import { Memo } from "./Memo.js";
export var Kind;
(function (Kind) {
    Kind[Kind["SECONDS"] = 0] = "SECONDS";
    Kind[Kind["MINUTES"] = 1] = "MINUTES";
})(Kind || (Kind = {}));
export class Context {
    MessageContext;
    AppContext;
    FlowContext;
    phoneNumber;
    body;
    SenderInfo;
    sendOtherContact;
    useMemo = Memo.getInstance().useMemo;
    MemoText = Memo.getInstance().useMemoText;
    moveToStep;
    constructor(messageContext, socket, flowContext) {
        if (!socket)
            throw 'You could not use this class if the socket is not loaded!';
        // @ts-ignore
        this.AppContext = socket;
        this.MessageContext = messageContext;
        this.sendOtherContact = this.AppContext.sendMessage.bind(this.AppContext);
        this.phoneNumber = messageContext.key.remoteJid;
        this.body = messageContext.message?.extendedTextMessage?.text || messageContext.message?.conversation;
        this.SenderInfo = this.MessageContext.message?.contactMessage;
        this.FlowContext = flowContext;
        this.moveToStep = Manager.getInstance().moveToStep;
    }
    moveToFlow = (flow) => {
        Manager.getInstance().sendToFlow(flow, this.MessageContext.key.remoteJid);
    };
    delay(time, kind) {
        return new Promise((res, rej) => {
            setTimeout(e => res(e), (() => {
                if (!kind)
                    return time * 1000;
                if (kind == Kind.MINUTES)
                    return time * 60 * 1000;
                if (kind == Kind.SECONDS)
                    return time * 1000;
            })());
        });
    }
    delayWithPresence = async (presence = 'composing', time, kind) => {
        await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid);
        await this.delay(time, kind);
        await this.AppContext.sendPresenceUpdate('available', this.MessageContext.key.remoteJid);
    };
    setPresence = async (presence = "composing") => {
        await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid);
    };
    send = (message) => {
        if (typeof message === "string")
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { text: message });
        else
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { ...message });
    };
    reply = (message) => {
        if (typeof message === "string")
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { text: message }, { quoted: this.MessageContext });
        else
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { ...message }, { quoted: this.MessageContext });
    };
}


// import { Manager } from "./Manager.js"
// import { Memo } from "./Memo.js"
// import { downloadMediaMessage } from "baileys"
//
// export var Kind
// ;((Kind) => {
//     Kind[(Kind["SECONDS"] = 0)] = "SECONDS"
//     Kind[(Kind["MINUTES"] = 1)] = "MINUTES"
// })(Kind || (Kind = {}))
//
// export class Context {
//     MessageContext
//     AppContext
//     FlowContext
//     phoneNumber
//     body
//     SenderInfo
//     sendOtherContact
//     useMemo = Memo.getInstance().useMemo
//     MemoText = Memo.getInstance().useMemoText
//     moveToStep
//
//     constructor(messageContext, socket, flowContext) {
//         if (!socket) throw "You could not use this class if the socket is not loaded!"
//         // @ts-ignore
//         this.AppContext = socket
//         this.MessageContext = messageContext
//         this.sendOtherContact = this.AppContext.sendMessage.bind(this.AppContext)
//         this.phoneNumber = messageContext.key.remoteJid
//
//         // Mejorar la extracción del body para manejar diferentes tipos de mensajes
//         this.body = this.extractMessageBody(messageContext.message)
//
//         this.SenderInfo = this.MessageContext.message?.contactMessage
//         this.FlowContext = flowContext
//         this.moveToStep = Manager.getInstance().moveToStep
//     }
//
//     // Nuevo método para extraer el contenido del mensaje según su tipo
//     extractMessageBody(message) {
//         if (!message) return ""
//
//         // Mensaje de texto simple
//         if (message.conversation) {
//             return message.conversation
//         }
//
//         // Mensaje de texto extendido
//         if (message.extendedTextMessage?.text) {
//             return message.extendedTextMessage.text
//         }
//
//         // Documento
//         if (message.documentMessage) {
//             return message.documentMessage.caption || "[DOCUMENTO]"
//         }
//
//         // Documento con caption
//         if (message.documentWithCaptionMessage?.message?.documentMessage) {
//             return message.documentWithCaptionMessage.message.documentMessage.caption || "[DOCUMENTO]"
//         }
//
//         // Imagen
//         if (message.imageMessage) {
//             return message.imageMessage.caption || "[IMAGEN]"
//         }
//
//         // Audio
//         if (message.audioMessage) {
//             return "[AUDIO]"
//         }
//
//         // Video
//         if (message.videoMessage) {
//             return message.videoMessage.caption || "[VIDEO]"
//         }
//
//         // Sticker
//         if (message.stickerMessage) {
//             return "[STICKER]"
//         }
//
//         // Contacto
//         if (message.contactMessage) {
//             return "[CONTACTO]"
//         }
//
//         // Ubicación
//         if (message.locationMessage) {
//             return "[UBICACIÓN]"
//         }
//
//         // Mensaje de lista
//         if (message.listMessage) {
//             return message.listMessage.description || "[LISTA]"
//         }
//
//         // Mensaje de botones
//         if (message.buttonsMessage) {
//             return message.buttonsMessage.contentText || "[BOTONES]"
//         }
//
//         // Si no coincide con ningún tipo conocido, devolver string vacío
//         return ""
//     }
//
//     // Método helper para verificar si el mensaje contiene un documento
//     hasDocument() {
//         const message = this.MessageContext.message
//         return !!(message?.documentMessage || message?.documentWithCaptionMessage?.message?.documentMessage)
//     }
//
//     // Método helper para obtener información del documento
//     getDocumentInfo() {
//         const message = this.MessageContext.message
//         const documentMessage = message?.documentMessage || message?.documentWithCaptionMessage?.message?.documentMessage
//
//         if (!documentMessage) return null
//
//         return {
//             fileName: documentMessage.fileName || documentMessage.title || "documento_sin_nombre",
//             fileSize: documentMessage.fileLength || 0,
//             mimeType: documentMessage.mimetype || "unknown",
//             caption: documentMessage.caption || "",
//             sha256: documentMessage.fileSha256,
//             url: documentMessage.url,
//             mediaKey: documentMessage.mediaKey,
//             directPath: documentMessage.directPath,
//         }
//     }
//
//     // Método para descargar el documento usando Baileys
//     async downloadDocument() {
//         try {
//             if (!this.hasDocument()) {
//                 throw new Error("No hay documento para descargar")
//             }
//
//             console.log("📥 Iniciando descarga del documento...")
//
//             // Descargar usando la función de Baileys
//             const buffer = await downloadMediaMessage(
//                 this.MessageContext,
//                 "buffer",
//                 {},
//                 {
//                     logger: this.AppContext.logger,
//                     reuploadRequest: this.AppContext.updateMediaMessage,
//                 },
//             )
//
//             console.log("✅ Documento descargado exitosamente")
//             console.log("- Tamaño del buffer:", buffer.length, "bytes")
//
//             return buffer
//         } catch (error) {
//             console.error("❌ Error al descargar documento:", error)
//             throw error
//         }
//     }
//
//     // Método helper para verificar si el mensaje contiene una imagen
//     hasImage() {
//         return !!this.MessageContext.message?.imageMessage
//     }
//
//     // Método helper para obtener información de la imagen
//     getImageInfo() {
//         const imageMessage = this.MessageContext.message?.imageMessage
//         if (!imageMessage) return null
//
//         return {
//             caption: imageMessage.caption || "",
//             mimeType: imageMessage.mimetype || "image/jpeg",
//             fileSize: imageMessage.fileLength || 0,
//             sha256: imageMessage.fileSha256,
//             url: imageMessage.url,
//         }
//     }
//
//     moveToFlow = (flow) => {
//         Manager.getInstance().sendToFlow(flow, this.MessageContext.key.remoteJid)
//     }
//
//     delay(time, kind) {
//         return new Promise((res, rej) => {
//             setTimeout(
//                 (e) => res(e),
//                 (() => {
//                     if (!kind) return time * 1000
//                     if (kind == Kind.MINUTES) return time * 60 * 1000
//                     if (kind == Kind.SECONDS) return time * 1000
//                 })(),
//             )
//         })
//     }
//
//     delayWithPresence = async (presence = "composing", time, kind) => {
//         await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid)
//         await this.delay(time, kind)
//         await this.AppContext.sendPresenceUpdate("available", this.MessageContext.key.remoteJid)
//     }
//
//     setPresence = async (presence = "composing") => {
//         await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid)
//     }
//
//     send = (message) => {
//         if (typeof message === "string")
//             return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { text: message })
//         else return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { ...message })
//     }
//
//     reply = (message) => {
//         if (typeof message === "string")
//             return this.AppContext.sendMessage(
//                 this.MessageContext.key.remoteJid,
//                 { text: message },
//                 { quoted: this.MessageContext },
//             )
//         else
//             return this.AppContext.sendMessage(
//                 this.MessageContext.key.remoteJid,
//                 { ...message },
//                 { quoted: this.MessageContext },
//             )
//     }
// }

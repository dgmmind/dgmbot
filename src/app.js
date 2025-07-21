import {
    makeWASocket,
    useMultiFileAuthState,
    Browsers,
    DisconnectReason
} from "baileys";
import { Manager } from './Flow/Manager.js';
import PINO from "pino";
import qrcode from "qrcode-terminal";
import { FlowSaludo } from "./Conversations/app.js"
class BaileyClient {
    constructor() {
        this.DIR_SESSION = `Sessions/auth`;
    }
    async connect() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
            this.client = makeWASocket({
                auth: state,
                browser: Browsers.windows("Desktop"),
                syncFullHistory: false,
                logger: PINO({ level: "error" }),
            });

            this.client.ev.on("creds.update", saveCreds);
            this.client.ev.on("connection.update", this.handleConnectionUpdate);
        } catch (error) {
            console.log("Ha ocurrido un error", error);
        }
    }

    handleConnectionUpdate = async (update) => {
        try {
            const { connection, lastDisconnect, qr } = update;
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            // ✅ Mostrar QR manualmente si existe
            if (qr) {
                qrcode.generate(qr, { small: true });
            }

            if (connection === "close") {
                if (statusCode !== DisconnectReason.loggedOut) {
                    await this.connect();
                }

                if (statusCode === DisconnectReason.loggedOut) {
                    console.log("Reiniciar bailey");
                    await this.connect();
                }
            }

            if (connection === "open") {
                console.log("Bailey conectado...");
                Manager.getInstance().attach(this.client);

            }
        } catch (error) {
            console.log("Ha ocurrido un error, reinicie o verifique su conexión a internet");
        }
    }
}

// Crear una instancia de BaileyClient
const bailey = new BaileyClient();

bailey.connect().then(() => {});

const manager = Manager.getInstance()
manager.setInactivityTimeout(10)

// Setting
manager.useEventDisabler("conversation")

console.log("Installed flows")

// Setting Flows
manager.addFlow(FlowSaludo)

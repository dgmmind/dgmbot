
import { Manager } from "../Flow/Manager.js"
import { FlowSaludo } from "./Saludo/index.js"

const manager = Manager.getInstance()

// Setting
manager.useEventDisabler("conversation")

console.log("Installed flows")

// Setting Flows
manager.addFlow(FlowSaludo)


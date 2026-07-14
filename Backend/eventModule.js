import events from "events"

const eventEmitter = new events.EventEmitter()

let shout = () =>  console.log("waaaaaaoooooooohhh")

eventEmitter.on("scream", shout)
eventEmitter.emit("scream")
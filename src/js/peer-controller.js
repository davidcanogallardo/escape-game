import {addLogMessage, getMyPeerId, signalMyPeer, step3} from './peer.js'
window.getId = getMyPeerId
window.signalPeer = signalMyPeer
window.step3 = step3

window.log = addLogMessage
// addLogMessage("uwu")


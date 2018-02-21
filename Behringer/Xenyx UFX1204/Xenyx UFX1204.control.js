loadAPI(1);
host.defineController("Behringer", "Xenyx UFX1204", "1.0", "4C63E3F9-0C3C-4B64-9605-E04EE2451ACA");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["UFX1204 MIDI"], ["UFX1204 MIDI"]);

function init() {
    host.getMidiInPort(0).setMidiCallback(onMidiInput);

    midiOut = host.getMidiOutPort(0);

    transport = host.createTransport();
    transport.addIsPlayingObserver(togglePlay);
    transport.addIsRecordingObserver(toggleRecord);
}

function togglePlay(playing) {
    midiOut.sendMidi(0xb0, 4, playing ? 0 : 127);
    midiOut.sendMidi(0xb0, 5, playing ? 127 : 0);
}

function toggleRecord(recording) {
    midiOut.sendMidi(0xb0, 3, recording ? 127 : 0);
}

function onMidiInput(status, data1, data2) {

    if (isKeyDown(status, data2)) {

        // transport control
        switch (data1) {
            case 1:
                transport.incPosition(-16, false);
                break;
            case 2:
                transport.incPosition(16, false);
                break;
            case 3:
                transport.record();
                break;
            case 4:
                transport.stop();
                break;
            case 5:
                transport.togglePlay();
                break;
            default:
        }

    }
}

function isKeyDown(status, data2) {
    return ((status & 0xF0) == 0x90) && (data2 == 0x7f);
}

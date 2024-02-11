class AudioController {
    audioContext = new AudioContext();
    gainNode = this.audioContext.createGain();
    analyser = this.audioContext.createAnalyser();
    frequency = 440;
    waveForm: OscillatorType = 'sawtooth';
    customWave: PeriodicWave;
    analyserDataBuffer: Uint8Array;

    constructor() {
        this.gainNode.connect(this.audioContext.destination);

        this.analyser.fftSize = 2048;
        this.analyserDataBuffer = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(this.analyserDataBuffer);

        this.gainNode.connect(this.analyser);

        this.setCustomWave(new Float32Array([0, 1]), new Float32Array([0, 0]));
    }

    createOscillator() {
        const oscillator = this.audioContext.createOscillator();

        if (this.waveForm === 'custom') {
            oscillator.setPeriodicWave(this.customWave);
        } else {
            oscillator.type = this.waveForm;
        }
        
        oscillator.connect(this.gainNode);
        oscillator.frequency.value = this.frequency;

        return oscillator; 
    }

    /* 
     * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createPeriodicWave 
     */
    setCustomWave = (real: Float32Array, imag: Float32Array, disableNormalization = false) => {
        this.customWave = this.audioContext.createPeriodicWave(real, imag, { disableNormalization });
    }
}

export default new AudioController();

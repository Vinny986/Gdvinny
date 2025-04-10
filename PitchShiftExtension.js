 (function (Scratch) {
        'use strict';
    
        class PitchShiftExtension {
            constructor() {
                this.audioContext = null;
                this.sourceNode = null;
                this.pitchShifter = null;
                this.gainNode = null;
                this.pitchValue = 1; // Default pitch value (1 means no pitch change)
            }
    
            getInfo() {
                return {
                    id: 'pitchShift',
                    name: 'Pitch Shifter',
                    docsURI: 'https://penguinmod.github.io/docs', // Replace with actual documentation URL if available
                };
            }
    
            ensureAudioContext() {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.gainNode = this.audioContext.createGain();
                    this.gainNode.connect(this.audioContext.destination);
                }
            }
    
            setPitchValue(newPitch) {
                this.pitchValue = parseFloat(newPitch) || 1;
            }
    
            applyPitchShifting(buffer) {
                this.ensureAudioContext();
    
                if (this.sourceNode) {
                    this.sourceNode.stop();
                    this.sourceNode.disconnect();
                }
    
                this.sourceNode = this.audioContext.createBufferSource();
                this.sourceNode.buffer = buffer;
                this.sourceNode.playbackRate.value = this.pitchValue;
    
                this.sourceNode.connect(this.gainNode);
                this.sourceNode.start();
            }
    
            playSoundWithPitch(url) {
                this.ensureAudioContext();
    
                fetch(url)
                    .then(response => response.arrayBuffer())
                    .then(data => this.audioContext.decodeAudioData(data))
                    .then(buffer => this.applyPitchShifting(buffer))
                    .catch(error => console.error('Error playing sound:', error));
            }
        }
    
        Scratch.extensions.register(new PitchShiftExtension());
    })(Scratch);

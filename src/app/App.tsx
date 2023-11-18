import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MusicNote, VolumeDown, VolumeUp } from '@mui/icons-material';
import { IconButton, MenuItem, Slider, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import audioController from "./audioController";
import { AudioAnalyserDisplay } from './AudioAnalyserDisplay';
import { CustomWaveFormEditor } from './CustomWaveFormEditor';

const theme = createTheme();

let oscillator: OscillatorNode = null;

const oscillatorTypes: OscillatorType[] = ["custom", "sawtooth", "sine", "square", "triangle"];

function assertOscillatorTypeValue(value: string): asserts value is OscillatorType {
    if (!oscillatorTypes.includes(value as OscillatorType)) {
        throw new Error(`value: [${value}] is not "OscillatorType"`);
    }
}

export const App = () => {
    const [volume, setVolume] = useState(audioController.gainNode.gain.value);
    const [frequency, setFrequency] = useState(audioController.frequency);
    const [waveForm, setWaveForm] = useState(audioController.waveForm);
    
    function startOscillator() {
        if (oscillator) {
            stopOscillator();
        }
        oscillator = audioController.createOscillator();
        oscillator.start();
    }

    function stopOscillator() {
        if (!oscillator) {
            return;
        }
        oscillator.stop();
        oscillator = null;
    }

    function handleVolumeChange(e: Event, value: number) {
        setVolume(value);

        audioController.gainNode.gain.value = value;
    }

    function handleFrequencyChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.currentTarget.value);

        setFrequency(value);

        audioController.frequency = value;
    }

    function handleWaveFormChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
        assertOscillatorTypeValue(value);

        setWaveForm(value);

        audioController.waveForm = value;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <VolumeDown />
                <Slider min={0} max={1} step={0.001} value={volume} onChange={handleVolumeChange} />
                <VolumeUp />
            </Stack>
            <TextField select value={waveForm} onChange={handleWaveFormChange}>
                {oscillatorTypes.map((oscillatorType) => (
                    <MenuItem key={oscillatorType} value={oscillatorType}>
                        {oscillatorType}
                    </MenuItem>
                ))}
            </TextField>
            <TextField type='number' value={frequency} onChange={handleFrequencyChange} />
            <IconButton onMouseDown={startOscillator} onMouseUp={stopOscillator}>
                <MusicNote />
            </IconButton>
            <CustomWaveFormEditor onChange={audioController.setCustomWave} />
            <AudioAnalyserDisplay />
        </ThemeProvider>
    )
};

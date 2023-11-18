import { Box, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    onChange: (real: Float32Array, imag: Float32Array) => void;
}

export const CustomWaveFormEditor: React.FC<Props> = ({ onChange }) => {
    const [componentCount, setComponentCount] = useState(2);
    // const [components, setComponents] = useState([[0, 1], [0, 0]]);
    const [realValues, setRealValues] = useState([0, 1]);
    const [imagValues, setImagValues] = useState([0, 0]);

    useEffect(() => {
        onChange(
            new Float32Array(realValues), // ToDo
            new Float32Array(imagValues),
        );
    }, [componentCount, realValues, imagValues]);

    function handleComponentCountChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.currentTarget.value);

        setComponentCount(value);
    }


    function handleComponentChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.currentTarget.value);
        const realIndex = Number(e.currentTarget.dataset.real_index);
        const imagIndex = Number(e.currentTarget.dataset.imag_index);

        if (Number.isNaN(imagIndex)) {
            const real = [...realValues];
            real[realIndex] = value;

            setRealValues(real);
        } else {
            const imag = [...imagValues];
            imag[imagIndex] = value;

            setImagValues(imag);
        }
    }

    return (
        <Box>
            <TextField type='number' value={componentCount} onChange={handleComponentCountChange} />
            <Stack direction="row">
                {Array.from({ length: componentCount }).map((_, realIndex) => (
                    <TextField 
                        key={`real-${realIndex}`}
                        type='number' 
                        value={realValues[realIndex]} 
                        data-real_index={realIndex}
                        onChange={handleComponentChange} 
                    />
                ))}
            </Stack>
            <Stack direction="row">
                {Array.from({ length: componentCount }).map((_, imagIndex) => (
                    <TextField
                        key={`imag-${imagIndex}`}
                        type='number' 
                        value={imagValues[imagIndex]} 
                        data-imag_index={imagIndex}
                        onChange={handleComponentChange} 
                    />
                ))}
            </Stack>
        </Box>
    );
}

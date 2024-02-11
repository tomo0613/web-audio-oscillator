import { Box, Stack, TextField } from "@mui/material";
import { useEffect, useReducer } from "react";

const initialState = {
    componentCount: 2,
    real: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    imag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

enum ActionType {
    setComponentCount = 'setComponentCount',
    setRealComponent = 'setRealComponent',
    setImagComponent = 'setImagComponent',
}
  
interface SetComponentCountAction {
    type: ActionType.setComponentCount;
    payload: { value: number };
}
 
interface SetRealComponentAction {
    type: ActionType.setRealComponent;
    payload: { value: number, index: number };
}

interface SetImagComponentAction {
    type: ActionType.setImagComponent;
    payload: { value: number, index: number };
}

type State = typeof initialState;

type Action = SetComponentCountAction | SetRealComponentAction | SetImagComponentAction;

function updateArrayValue<T = unknown>(array: T[], index: number, value: T) {
    const res = [...array];
    res[index] = value;

    return res;
}

function reducer(state: State, action: Action): State {
    const { value } = action.payload;

    switch (action.type) {
        case ActionType.setComponentCount:
            return {
                ...state,
                componentCount: value,
            };
        case ActionType.setRealComponent:
            return {
                ...state,
                real: updateArrayValue(state.real, action.payload.index, value),
            };
        case ActionType.setImagComponent:
            return {
                ...state,
                imag: updateArrayValue(state.imag, action.payload.index, value),
            };
    };
}

interface Props {
    onChange: (real: Float32Array, imag: Float32Array) => void;
    disabled?: boolean;
}

export const CustomWaveFormEditor: React.FC<Props> = ({ onChange, disabled }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {        
        onChange(
            new Float32Array(state.real.slice(0, state.componentCount)),
            new Float32Array(state.imag.slice(0, state.componentCount)),
        );
    }, [state]);

    function handleComponentCountChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.currentTarget.value);

        dispatch({ type: ActionType.setComponentCount, payload: { value } });
    }

    function handleComponentChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.currentTarget.value);
        const index = Number(e.currentTarget.dataset.index);
        const type = e.currentTarget.dataset.type === "real"
            ? ActionType.setRealComponent
            : ActionType.setImagComponent;

        dispatch({ type, payload: { value, index } });
    }

    return (
        <Box>
            <TextField
                type='number'
                label="Custom wave component count"
                inputProps={{
                    min: 2,
                    max: 12,
                }}
                value={state.componentCount}
                onChange={handleComponentCountChange}
                disabled={disabled}
            />
            {(["real", "imag"] as const).map((type) => (
                <Stack key={type} direction="row" spacing={1} my={1}>
                    {Array.from({ length: state.componentCount }).map((_, index) => (
                        <TextField 
                            key={`${type}-${index}`}
                            type='number' 
                            label={`${type} ${index}`}
                            inputProps={{
                                min: 0,
                                step: 0.1,
                                ["data-type"]: type,
                                ["data-index"]: index,
                            }}
                            value={state[type][index]} 
                            onChange={handleComponentChange}
                            disabled={disabled}
                        />
                    ))}
                </Stack>
            ))}
        </Box>
    );
}

import React from 'react';
import CreatableSelect from 'react-select/creatable';

export default function TagInput({ options = [], value, onChange }) {
    
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'var(--tw-bg-background)',
            borderColor: state.isFocused ? 'var(--tw-color-indigo-500)' : 'var(--tw-border-border)',
            boxShadow: state.isFocused ? '0 0 0 1px var(--tw-color-indigo-500)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? 'var(--tw-color-indigo-500)' : 'var(--tw-border-border)',
            }
        }),
        input: (provided) => ({
            ...provided,
            color: 'var(--tw-text-foreground)',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--tw-bg-card)',
            color: 'var(--tw-text-card-foreground)',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'var(--tw-bg-muted-50)' : 'transparent',
            color: 'var(--tw-text-card-foreground)',
            '&:hover': {
                backgroundColor: 'var(--tw-bg-muted-50)',
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'var(--tw-bg-primary)',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'var(--tw-text-primary-foreground)',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'var(--tw-text-primary-foreground)',
            '&:hover': {
                backgroundColor: 'var(--tw-bg-primary-darker)',
                color: 'var(--tw-text-primary-foreground)',
            },
        }),
    };

    return (
        <CreatableSelect
            isMulti
            options={options}
            value={value}
            onChange={onChange}
            styles={customStyles}
            placeholder="Selecione ou crie tags..."
            noOptionsMessage={() => "Nenhuma tag encontrada. Digite para criar."}
            formatCreateLabel={(inputValue) => `Criar nova tag: "${inputValue}"`}
        />
    );
}
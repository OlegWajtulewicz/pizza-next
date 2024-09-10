"use client";

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
    onChange?: (value?: string) => void;
}

export const AddressInput: React.FC<Props> = ({ onChange }) => {   

    return (
        <AddressSuggestions 
            token="a7c0c3b867b967e0123ae37b693da80ba99f71d4" 
            onChange={(data) => onChange?.(data?.value)} 
        />
    )
}



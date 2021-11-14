import React from 'react';
// STyles
import { Wrapper } from './Button.styles';


const Button = ({ text, callback }) => (
    <Wrapper type='button' onClick={callback}>
        {text}
    </Wrapper>
)


export default Button;
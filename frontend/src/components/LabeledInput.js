import React from 'react';
import { Form } from 'react-bootstrap';
import {setDefaultBorder} from '../utils/formMessage';


function LabeledInput(parameters) {
  const { controlId, name, type, value, onChange } = parameters;

  return (
    <Form.Group className="my-form-line" controlId={controlId}>
      <Form.Label>{name}</Form.Label>
      <Form.Control
        name={controlId}
        type={type}
        className="same-width-input"
        value={value}
        onChange={onChange}
        onFocus={setDefaultBorder(controlId)}
      />
    </Form.Group>
  )
}

export default LabeledInput;

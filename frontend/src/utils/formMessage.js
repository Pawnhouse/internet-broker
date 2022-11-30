import { controlIds } from "./formData";

export function clearSetters(setters) {
  return () => {
    setters.forEach((setter) => setter(''));
  }
}

export function showError(i, message, form) { 
  const indexByMessage = {
    'Email does not exist': 0,
    'Email already exists': 0,
    'The password is wrong': 1,
    'The passwords don\'t match': 2,
  }
  i = i ?? indexByMessage[message];

  const input = document.querySelector('[name=\'' + controlIds[i] + '\']');
  if (input) {
    input.style.border = '1px solid red';
  }
  document.querySelector(form + ' .error-message').textContent = message;
}

export function showResult(message, form) {
  document.querySelector(form + ' .success-message').textContent = message;
}

export function setDefaultBorder(name) {
  return () => {
    const input = document.querySelector('[name=\'' + name + '\']');
    input.removeAttribute('style');
  }
}

export function hideMessage() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => { input.removeAttribute('style'); });
  const messages = document.querySelectorAll('.form-message');
  messages.forEach((message) => { message.textContent = ''; });
}

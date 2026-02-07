import { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export default function Form({ children, ...props }: FormProps) {
  return (
    <form {...props}>
      {children}
    </form>
  );
}
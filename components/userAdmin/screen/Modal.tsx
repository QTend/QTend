import { ReactNode, MouseEventHandler } from 'react';

interface ModalProps {
  onClick?: MouseEventHandler<HTMLDivElement>; // Optional: for clicking the backdrop
  center?: boolean;
  children: ReactNode;
}

export function Modal({ onClick, center, children }: ModalProps) {
  return (
    <div
      onClick={onClick}
      className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex ${
        center ? 'justify-center items-center' : 'justify-end'
      }`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

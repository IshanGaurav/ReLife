import React from 'react';

export default function Section({ title, children, className = '' }) {
  return (
    <section className={`py-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-amazon-blue mb-6 tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

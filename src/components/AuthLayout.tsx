import React from "react";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

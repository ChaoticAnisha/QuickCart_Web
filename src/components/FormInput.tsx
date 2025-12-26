type Props = {
  label: string;
  type?: string;
  name: string;
  error?: string;
};

export default function FormInput({
  label,
  type = "text",
  name,
  error,
}: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        style={{ width: "100%", padding: 8 }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

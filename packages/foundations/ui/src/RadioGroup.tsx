import styles from "./RadioGroup.module.css";

export type RadioOption = { value: string; label: string };

export type RadioGroupProps = {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
};

export function RadioGroup({ name, legend, options, value, onChange }: RadioGroupProps) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

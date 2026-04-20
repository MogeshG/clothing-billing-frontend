/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Autocomplete, TextField, Paper } from "@mui/material";
import { type SvgIconComponent } from "@mui/icons-material";

export interface ActionOption {
  label: string;
  icon?: SvgIconComponent;
  onClick: () => void;
}

export interface CustomSearchProps<T> {
  data: T[];
  label: string;
  value?: T | null;
  inputValue?: string;

  placeholder?: string;

  getLabel: (item: T) => string;

  onChange?: (value: string) => void;
  onSelect?: (item: T | null) => void;

  actionOption?: (query: string) => ActionOption | null;

  className?: string;
}

export default function CustomSearch<T>({
  data = [],
  value = null,
  label = "",
  inputValue: controlledInput,
  placeholder = "Search...",
  getLabel,
  onChange,
  onSelect,
  actionOption,
  className = "",
}: CustomSearchProps<T>) {
  const [internalInput, setInternalInput] = useState("");

  const inputValue = controlledInput !== undefined ? controlledInput : internalInput;

  const action = actionOption?.(inputValue);

  return (
    <Autocomplete
      freeSolo
      options={data}
      value={value}
      inputValue={inputValue}
      className={className}
      onInputChange={(_, val) => {
        setInternalInput(val);
        onChange?.(val);
      }}
      onChange={(_, val: any) => {
        if (val?.__action) {
          val.__action.onClick();
          return;
        }

        onSelect?.(val || null);
      }}
      getOptionLabel={(option: any) => (typeof option === "string" ? option : getLabel(option))}
      filterOptions={(options, params) => {
        const filtered = options.filter((item) =>
          getLabel(item).toLowerCase().includes(params.inputValue.toLowerCase()),
        );

        if (action && params.inputValue !== "") {
          filtered.push({
            __action: action,
            label: action.label,
          } as any);
        }

        return filtered;
      }}
      renderOption={(props, option: any) => {
        if (option.__action) {
          return (
            <li {...props} className="text-blue-600">
              {option.__action.icon && <option.__action.icon fontSize="small" />}
              <span className="ml-2">{option.__action.label}</span>
            </li>
          );
        }

        return <li {...props}>{getLabel(option)}</li>;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          label={label}
          size="medium"
          InputProps={{
            ...params.InputProps,
            className: "h-12",
          }}
        />
      )}
      PaperComponent={(props) => <Paper {...props} className="shadow-md rounded-md" />}
    />
  );
}

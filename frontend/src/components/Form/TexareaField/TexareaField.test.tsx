import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TexareaField } from "./TexareaField";
import type { TexareaFieldProps } from "@/types/ui";

describe("TexareaField", () => {
  const baseField: TexareaFieldProps["field"] = {
    tag: "textarea",
    name: "description",
    placeholder: "Digite algo...",
    value: "",
    onChange: jest.fn(),
    className: "",
  };

  it("não renderiza se o tag não for textarea", () => {
    const { container } = render(
      <TexareaField field={{ ...baseField, tag: "text" }} fieldErrors={{}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderiza textarea corretamente", () => {
    render(<TexareaField field={baseField} fieldErrors={{}} />);
    const textarea = screen.getByTestId("form-textarea-field");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "Digite algo...");
    expect(textarea).toHaveAttribute("name", "description");
  });

  it("chama onChange ao digitar", () => {
    render(<TexareaField field={baseField} fieldErrors={{}} />);
    const textarea = screen.getByTestId("form-textarea-field");
    fireEvent.change(textarea, { target: { value: "Novo texto" } });
    expect(baseField.onChange).toHaveBeenCalledTimes(1);
  });

  it("adiciona classe is-invalid quando há erro", () => {
    render(
      <TexareaField
        field={baseField}
        fieldErrors={{ description: "Campo obrigatório" }}
      />
    );
    const textarea = screen.getByTestId("form-textarea-field");
    expect(textarea).toHaveClass("is-invalid");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });
});

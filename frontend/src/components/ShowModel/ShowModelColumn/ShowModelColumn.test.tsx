// ShowModelColumn.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { ShowModelColumn } from "./ShowModelColumn";

describe("ShowModelColumn", () => {
  const props = {
    title: "Informações Básicas",
    icon: "bi-file-text",
    contents: [
      { label: "Nome", value: "João da Silva" },
      { label: "Tipo", value: "Pessoa Física" },
    ],
  };

  it("renderiza o título e o ícone corretamente", () => {
    render(<ShowModelColumn {...props} />);
    expect(screen.getByText("Informações Básicas")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toContainHTML("bi-file-text");
  });

  it("renderiza todos os conteúdos passados via props", () => {
    render(<ShowModelColumn {...props} />);
    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText("Tipo:")).toBeInTheDocument();
    expect(screen.getByText("Pessoa Física")).toBeInTheDocument();
  });

  it("renderiza a quantidade correta de itens", () => {
    render(<ShowModelColumn {...props} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(props.contents.length);
  });
});

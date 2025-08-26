import React from "react";
import type { ShowModelProps } from "@/types/ui";
import { ShowModelColumn } from "./ShowModelColumn";

export const ShowModel: React.FC<ShowModelProps> = ({ firstColumn, secondColumn }) => (
  <div className="row">
    <ShowModelColumn {...firstColumn} />
    { secondColumn && <ShowModelColumn {...secondColumn} /> }
  </div>
);
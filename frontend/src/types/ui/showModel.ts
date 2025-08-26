export interface ShowModelProps {
  firstColumn: ShowModelColumnProps;
  secondColumn?: ShowModelColumnProps;
}

export type ShowModelColumnProps = {
  title: string;
  icon: string;
  contents: ShowModelColumnContent[];
};
export type ShowModelColumnContent = {
  label: string;
  value: string | number | React.ReactNode;
}
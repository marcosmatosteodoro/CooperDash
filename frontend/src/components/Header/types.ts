export interface ProfileDropdownProps  {
  items: ProfileDropdownItemsType[]
}

export type ProfileDropdownItemsType = {
  type: 'header' | 'item' | 'divider'
  text?: string
  icon?: string
}
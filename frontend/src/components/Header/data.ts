import { ProfileDropdownItemsType } from './types'

export const profileDropdownItems: ProfileDropdownItemsType[] = [
  {
    type: 'header',
    text: 'Conta'
  },
  {
    type: 'item',
    text: 'Perfil',
    icon: 'bi-person'
  },
  {
    type: 'item',
    text: 'Configurações',
    icon: 'bi-gear'
  },
  {
    type: 'item',
    text: 'Privacidade',
    icon: 'bi-shield-lock'
  },
  {
    type: 'item',
    text: 'Notificações',
    icon: 'bi-bell'
  },
  {
    type: 'divider'
  },
  {
    type: 'header',
    text: 'Ajuda'
  },
  {
    type: 'item',
    text: 'Guia de Ajuda',
    icon: 'bi-book'
  },
  {
    type: 'item',
    text: 'Central de Ajuda',
    icon: 'bi-question-circle'
  },
  {
    type: 'divider'
  },
]
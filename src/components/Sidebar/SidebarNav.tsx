import { Stack } from '@chakra-ui/react'
import { RiContactsLine, RiDashboardLine } from 'react-icons/ri'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="MENU PRINCIPAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">
          Dashboard
        </NavLink>
        <NavLink icon={RiContactsLine} href="/dashboard">
          Usuários
        </NavLink>
      </NavSection>
    </Stack>
  )
}

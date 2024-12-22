import React from 'react'
import NextLink from 'next/link'
import { ProgressBarLink } from '@/components/ProgressBar'
import UserButton from '@/components/UserButton'
import { auth } from '@/utils/auth'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react'

const Nav = () => {
  const session = React.use(auth())

  return (
    <Navbar>
      <NavbarBrand>
        <NextLink href="/" className="px-4 py-2 font-bold text-inherit">
          Viclafouch memes
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center" />
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <ProgressBarLink href="/library">Bibliothèque</ProgressBarLink>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          {session ? (
            <ProgressBarLink href="/new">Ajouter un mème</ProgressBarLink>
          ) : null}
        </NavbarItem>
        <NavbarItem className="flex items-center">
          <UserButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Nav

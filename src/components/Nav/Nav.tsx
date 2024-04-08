import React from 'react'
import NextLink from 'next/link'
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react'

export type NavProps = {
  userButton: React.ReactNode
}

const Nav = ({ userButton }: NavProps) => {
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
          <Link as={NextLink} href="/library" color="foreground">
            Bibliothèque
          </Link>
        </NavbarItem>
        <NavbarItem className="flex items-center">{userButton}</NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Nav

import React from 'react'
import NextLink from 'next/link'
import UserButton from '@/components/UserButton'
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react'

const Nav = () => {
  return (
    <Navbar>
      <NavbarBrand>
        <NextLink href="/" className="px-4 py-2 font-bold text-inherit">
          Viclafouch memes
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link as={NextLink} href="/new" color="foreground">
            Uploader un fichier
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={NextLink} href="/library" color="foreground">
            Bibliothèque
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <UserButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Nav

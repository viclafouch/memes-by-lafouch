'use client'

import React from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react'

const Nav = () => {
  const pathname = usePathname()

  return (
    <Navbar>
      <NavbarBrand>
        <NextLink href="/" className="px-4 py-2 font-bold text-inherit">
          Viclafouch memes
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === '/new'}>
          <Link as={NextLink} href="/new" color="foreground">
            Uploader un fichier
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === '/library'}>
          <Link as={NextLink} href="/library" color="foreground">
            Bibliothèque
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Nav

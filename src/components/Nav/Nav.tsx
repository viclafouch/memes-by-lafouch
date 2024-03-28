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

  console.log(pathname)

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Viclafouch memes</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === '/'}>
          <Link as={NextLink} href="/" color="foreground">
            Uploader
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/library')}>
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

import React from 'react'
import NextLink from 'next/link'
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react'
import { FileVideo, XLogo } from '@phosphor-icons/react/dist/ssr'

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
        <NavbarItem className="hidden sm:flex">
          <Popover backdrop="opaque" placement="bottom" showArrow offset={10}>
            <PopoverTrigger className="cursor-pointer">
              <Link as="span" color="foreground">
                Ajouter un mème
              </Link>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="flex flex-col gap-2">
                <Button
                  as={Link}
                  href="/"
                  fullWidth
                  size="sm"
                  className="bg-black text-white"
                  endContent={<XLogo size={20} />}
                >
                  Via Twitter
                </Button>
                <Button
                  as={Link}
                  href="/new"
                  fullWidth
                  size="sm"
                  color="default"
                  endContent={<FileVideo size={20} />}
                >
                  Via un fichier
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </NavbarItem>
        <NavbarItem className="flex items-center">{userButton}</NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Nav

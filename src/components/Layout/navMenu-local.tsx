"use client"

import type React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import ShareButton from "../buttons/shareButton"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

interface NavLinkProps {
  href: string
  intl: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const NavLink: React.FC<NavLinkProps> = ({ href, intl, children, className, onClick }) => {
  return (
    <Link
      href={`${intl?"/id":""}${href}`}
      onClick={onClick}
      className={cn("transition-colors duration-200 text-foreground/70 hover:text-foreground", className)}
    >
      {children}
    </Link>
  )
}

export interface NavItem {
  type?: "featured" | "button" | "link"
  intl: boolean
  label: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null
  href: string
  image?: string
  onClick?: () => void
  children?: NavItem[]
}

export interface NavLink {
  label: string
  href: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null
}

interface NavigationMenuProps {
  items: NavItem[]
  className?: string
}

const NavigationMenuComponent: React.FC<NavigationMenuProps> = ({ items, className }) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    
    const updateContainerWidth = () => {
      if (navRef.current) {
        setContainerWidth(navRef.current.clientWidth)
      }
    }

    updateContainerWidth()
    const resizeObserver = new ResizeObserver(updateContainerWidth)
    
    if (navRef.current) {
      resizeObserver.observe(navRef.current)
    }

    window.addEventListener('resize', updateContainerWidth)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateContainerWidth)
    }
  }, [])

  const buttonItems = items.filter(item => item.type === "button")
  const nonButtonItems = items.filter(item => item.type !== "button")

  const getResponsiveValues = () => {
    if (containerWidth < 640) {
      return {
        textSize: "text-xs",
        gap: "gap-1",
        itemPadding: "px-1.5 py-1.5",
        featuredText: "text-sm",
        maxWidth: "max-w-[80px]"
      }
    } else if (containerWidth < 768) {
      return {
        textSize: "text-sm",
        gap: "gap-2",
        itemPadding: "px-2 py-2",
        featuredText: "text-base",
        maxWidth: "max-w-[100px]"
      }
    } else if (containerWidth < 1024) {
      return {
        textSize: "text-base",
        gap: "gap-3",
        itemPadding: "px-3 py-2",
        featuredText: "text-lg",
        maxWidth: "max-w-[140px]"
      }
    } else {
      return {
        textSize: "text-lg",
        gap: "gap-4",
        itemPadding: "px-4 py-2",
        featuredText: "text-xl",
        maxWidth: "max-w-[180px]"
      }
    }
  }

  const responsive = getResponsiveValues()

  const renderFeatured = (item: NavItem) => (
    <NavigationMenuItem key={item.label} className="shrink-0 min-w-0">
      <NavigationMenuTrigger useCaret={false}  
        className={cn(
          navigationMenuTriggerStyle({ transparent: true }),
          "focus:bg-transparent data-active:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent p-0"
        )}>
        <NavigationMenuLink asChild>
          <Link
            href={item.href || "#"}
            className={cn(
              "flex items-center gap-2 text-blue-900/90 focus:text-blue-700 hover:bg-transparent hover:text-blue-600 transition-colors group truncate",
              responsive.itemPadding,
              responsive.maxWidth,
              !item.image && "font-bold"
            )}
          >
            {item.image ? (
              <>
                <div className="relative h-6 w-8 sm:h-8 sm:w-12 overflow-hidden rounded border group-hover:shadow-lg transition-all shrink-0">
                  <Image 
                    width={48} 
                    height={32}
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className={cn("font-medium truncate", responsive.textSize)}>{item.label}</span>
              </>
            ) : (
              <span className={cn("font-bold group-hover:text-blue-600 transition-colors truncate", responsive.featuredText)}>
                {item.label}
              </span>
            )}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuTrigger>
      {item.image && item.description && (
        <NavigationMenuContent className="flex md:w-100 lg:w-125 items-center p-4">
          <div className="flex gap-4 items-start">
            <Image 
              width={200} 
              height={120} 
              src={item.image} 
              className="rounded-md object-cover w-25 lg:w-50 h-auto shrink-0" 
              alt={item.label} 
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-lg mb-2">{item.label}</h1>
              <p className="text-muted text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  )

  const renderSimpleLink = (item: NavItem) => (
    <NavigationMenuItem key={item.href} className="shrink-0 min-w-0">
      <NavigationMenuLink
        href={item.href as string}
        className={cn(
          navigationMenuTriggerStyle(),
          "text-blue-900 hover:text-blue-600 hover:bg-foreground/5 transition-colors truncate",
          responsive.textSize,
          responsive.itemPadding,
          responsive.maxWidth
        )}
      >
        <span className="truncate block">{item.label}</span>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )

  const renderButtonDropdown = () => (
    <NavigationMenuItem key="button-dropdown" className="shrink-0">
      <NavigationMenuTrigger  
        className={cn(
          navigationMenuTriggerStyle({ transparent: true }),
          "text-blue-900/90 focus:bg-transparent focus:text-blue-700 data-active:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent hover:text-blue-600 transition-colors",
          responsive.textSize,
          responsive.itemPadding
        )}>
        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="p-4 w-48 sm:w-56">
          <div className="space-y-2 sm:space-y-3">
            {buttonItems.map((item) => (
              <ShareButton key={item.label} label={item.label} className="w-full text-sm sm:text-base" />
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )

  const renderNavItem = (item: NavItem) => {
    switch (item.type) {
      case "featured":
        return renderFeatured(item)
      default:
        return renderSimpleLink(item)
    }
  }

  return (
    <NavigationMenu 
      ref={navRef}
      className={cn(
        "w-full",
        className
      )}
    >
      <NavigationMenuList className={cn(
        "flex items-center justify-start flex-nowrap w-full scrollbar-hide",
        responsive.gap
      )}>
        {nonButtonItems.map(renderNavItem)}
        {buttonItems.length > 0 && renderButtonDropdown()}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavigationMenuComponent
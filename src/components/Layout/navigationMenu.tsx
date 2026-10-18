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
import {Link} from '@/i18n/navigation';
import { cn } from "@/lib/utils"
import ShareButton from "../buttons/shareButton"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { MoreVertical } from "lucide-react"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, className, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("transition-colors duration-200 text-foreground/70 hover:text-foreground", className)}
    >
      {children}
    </Link>
  )
}

export interface NavItem {
  type?: "dropdown" | "featured" | "button" | "link"
  label: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null
  href: string
  image?: string
  children?: NavItem[]
  onClick?: () => void
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

  const getGridColumns = (itemCount: number) => {
    if (itemCount <= 4) return "grid-cols-1"
    if (itemCount <= 8) return "md:grid-cols-2"
    return "md:grid-cols-2 lg:grid-cols-3"
  }

  const renderDropdown = (item: NavItem) => {
    const gridClass = item.children ? getGridColumns(item.children.length) : ""
    return (
      <NavigationMenuItem key={item.label} className="shrink-0 min-w-0">
        <NavigationMenuTrigger 
          className={cn(
            navigationMenuTriggerStyle({ transparent: true }),
            "text-blue-900/90 focus:bg-transparent focus:text-blue-700 data-active:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent hover:text-blue-600 transition-colors truncate",
            responsive.textSize,
            responsive.itemPadding,
            responsive.maxWidth
          )}>
          <span className="truncate block">{item.label}</span>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <h1 className="text-center text-2xl pt-4">{item.label}</h1>
          <ul className={cn(
            "grid gap-3 p-4",
            "w-[min(90vw,400px)] md:w-[min(90vw,560px)] lg:w-[min(90vw,720px)]",
            gridClass,
            item.children && item.children.length > 6 ? "lg:max-w-200" : "md:max-w-150"
          )}>
            {item.children?.map((child) => {
              const Icon = child.icon || null
              return (
                <li key={child.label} className="min-w-0">
                  <NavigationMenuLink asChild>
                    <Link 
                      href={child.href || "#"} 
                      className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-foreground/5 group min-w-0"
                    >
                      {child.image ? (
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden shrink-0">
                          <Image 
                            width={48} 
                            height={48}
                            src={child.image}
                            alt={child.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : Icon ? (
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-foreground/10 group-hover:bg-foreground/20 transition-colors shrink-0">
                          <Icon className="size-4 sm:size-5 opacity-80" />
                        </div>
                      ) : null}
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="text-sm sm:text-base font-medium leading-none truncate">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="text-xs sm:text-sm text-foreground/70 leading-relaxed line-clamp-2">
                            {child.description}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              )
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

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
      case "dropdown":
        return item.children ? renderDropdown(item) : renderSimpleLink(item)
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
"use client"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Dock, DockIcon } from "@/components/ui/dock"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ShareButton from "../buttons/shareButton"
import { landingPageData } from "./navigationData"
import { NavLink } from "./navigationMenu"
import useScrollContext from "@/hooks/useScrollTracking"

const DockNav = ({ className, isDefaultRoute }: { className?: string; isDefaultRoute: boolean }) => {
  const { isOut1stScreen, scrollY } = useScrollContext()
  useEffect(() => {
    console.log("[v0] DockNav scroll values:", scrollY, isOut1stScreen)
  }, [scrollY, isOut1stScreen])

  if (!isDefaultRoute) {
    return null
  }

  return (
    <div
      className={cn(
        `pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14`,
        className,
      )}
    >
      <div
        className={cn(
          "fixed bottom-0 overflow-hidden h-8 inset-x-0 w-full bg-background to-transparent transition-all delay-75 ease-in-out duration-300 backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background",
          `${isOut1stScreen ? "max-h-8" : "max-h-0"}`,
        )}
      ></div>
      <TooltipProvider>
        <Dock
          direction="middle"
          className={cn(
            "z-50 left-1/2 transition-transform duration-700 delay-300 -translate-x-1/2 ease-in-out pointer-events-auto absolute mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            `${isOut1stScreen ? "translate-y-0" : "translate-y-10"}`,
          )}
        >
          { landingPageData.map((item) => 
                <DockIcon key={item.label}>
                  <Tooltip>
                    <TooltipTrigger>
                      <NavLink
                        href={item.href as string}
                        aria-label={item.label}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12 rounded-full")}
                      >
                      <p>{item.icon}</p>
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
            )}
        </Dock>
      </TooltipProvider>
    </div>
  )
}

export default DockNav

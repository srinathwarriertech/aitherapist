"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 transition-all duration-300">
      <SliderPrimitive.Range className="absolute h-full bg-indigo-500 shadow-lg transition-all duration-300" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-6 h-6 bg-white border-4 border-indigo-500 rounded-full shadow-lg hover:scale-110 focus:scale-110 transition-transform duration-200 outline-none focus:ring-4 focus:ring-indigo-300 ring-offset-background disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

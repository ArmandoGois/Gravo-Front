import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

import { Input } from "./input"

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-10", className)}
                    {...props}
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>
        )
    }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
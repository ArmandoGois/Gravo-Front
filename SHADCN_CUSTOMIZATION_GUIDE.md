# shadcn/ui Customization Best Practices

This guide outlines the best practices for customizing shadcn/ui components in this project.

## 📚 Customization Strategies

### **1. Direct Modification in `ui/` (For Global Changes)**

For customizations that should **always apply**, edit the component directly in `src/presentation/components/ui/`:

```tsx
// src/presentation/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ...",
        // ✅ Add new variants
        brand: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
        success: "bg-green-600 text-white hover:bg-green-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        // ✅ Add new sizes
        xs: "h-6 rounded px-2 text-xs",
      },
    },
  }
);
```

### **2. Create Wrapper Components (For Specific Variations)**

Create **specialized components** in `src/presentation/components/common/` or `features/`:

```tsx
// src/presentation/components/common/loading-button.tsx
import { Button, ButtonProps } from "@/presentation/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading,
  loadingText,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
```

### **3. Use Composition (For Combinations)**

Combine base components to create new ones:

```tsx
// src/presentation/components/common/confirm-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### **4. Customize with Tailwind (For One-off Cases)**

Use `className` for one-time customizations:

```tsx
// In any component
<Button
  variant="default"
  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
>
  Custom Button
</Button>
```

### **5. Extend with CVA (For Complex Design Systems)**

If you need many variants, use `class-variance-authority`:

```tsx
// src/presentation/components/common/status-badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      status: {
        active: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
        inactive: "bg-gray-100 text-gray-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-base",
      },
    },
    defaultVariants: {
      status: "active",
      size: "md",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  status,
  size,
  className,
  children,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status, size }), className)}>
      {children}
    </span>
  );
}
```

### **6. Modify Global Themes**

For color/theme changes, edit `src/app/globals.css`:

```css
@layer base {
  :root {
    /* Customize CSS variables */
    --primary: 262.1 83.3% 57.8%; /* Custom purple */
    --radius: 0.75rem; /* More rounded borders */
  }
}
```

## 🎯 Recommended Structure

```
src/presentation/components/
├── ui/                    # ✅ Base shadcn components (editable)
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── common/                # ✅ Reusable custom components
│   ├── loading-button.tsx
│   ├── confirm-dialog.tsx
│   └── status-badge.tsx
└── features/              # ✅ Feature-specific components
    ├── auth/
    │   └── login-form.tsx
    └── dashboard/
        └── stats-card.tsx
```

## ⚠️ Don't Do

- ❌ Don't create intermediate components that only pass props (wrapper hell)
- ❌ Don't override styles with `!important`
- ❌ Don't modify components if you only need a one-off change
- ❌ Don't duplicate shadcn components outside of `ui/`

## ✅ Do

- ✅ Edit `ui/` for permanent global changes
- ✅ Create wrappers in `common/` for additional logic
- ✅ Use `className` for unique customizations
- ✅ Extend variants with CVA for complex systems
- ✅ Use composition to create high-level components

## 📝 Examples by Use Case

### Adding a New Button Variant

**Edit the base component:**

```tsx
// src/presentation/components/ui/button.tsx
variants: {
  variant: {
    // ... existing variants
    premium: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl",
  }
}

// Usage
<Button variant="premium">Upgrade Now</Button>
```

### Creating a Reusable Component

**Create a wrapper:**

```tsx
// src/presentation/components/common/icon-button.tsx
import { Button, ButtonProps } from "@/presentation/components/ui/button";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: LucideIcon;
  label?: string;
}

export function IconButton({ icon: Icon, label, ...props }: IconButtonProps) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <Icon />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
```

### Building a Feature Component

**Compose multiple components:**

```tsx
// src/presentation/components/features/auth/auth-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## 🔄 When to Use Each Strategy

| Strategy                | Use When                                | Example                            |
| ----------------------- | --------------------------------------- | ---------------------------------- |
| **Direct Modification** | Adding variants used throughout the app | New button style for all CTAs      |
| **Wrapper Component**   | Adding behavior/logic to base component | Loading state, icon placement      |
| **Composition**         | Combining multiple components           | Modal with form, card with actions |
| **Tailwind className**  | One-off styling needs                   | Special landing page button        |
| **CVA Extension**       | Building a new component system         | Badge system with many states      |
| **Theme Modification**  | Changing colors/spacing globally        | Rebranding, design system update   |

## 🎨 Theming Tips

### Using CSS Variables

shadcn/ui uses CSS variables for theming. These can be modified in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

### Using Tailwind Config

For broader customizations, edit `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          // ... more shades
          900: "#4c1d95",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
    },
  },
};
```

## 📦 Component Library Pattern

For larger applications, consider creating a component library pattern:

```
src/presentation/components/
├── ui/              # shadcn base components
├── primitives/      # Low-level customized components
├── composed/        # Combined component patterns
└── features/        # Feature-specific implementations
```

This hierarchy ensures:

- **Separation of concerns** between base and custom
- **Reusability** at multiple levels
- **Maintainability** when updating shadcn components
- **Clarity** about component origins

---

**Remember:** The key is to find the right balance between customization and maintainability. Start simple and add complexity only when needed.

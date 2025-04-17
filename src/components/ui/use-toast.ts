'use client';

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/Toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

interface State {
  toasts: ToasterToast[]
}

interface ToastContextValue extends State {
  toast: (props: Omit<ToasterToast, "id">) => void
  dismiss: (toastId?: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function genId() {
  return Math.random().toString(36).substr(2, 9)
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, setState] = React.useState<State>({ toasts: [] })

  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = genId()
    const newToast: ToasterToast = {
      ...props,
      id,
      open: true,
    }

    setState((prev) => ({
      ...prev,
      toasts: [newToast, ...prev.toasts].slice(0, TOAST_LIMIT),
    }))

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.filter((t) => t.id !== id),
      }))
    }, TOAST_REMOVE_DELAY)
  }, [])

  const dismiss = React.useCallback((toastId?: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => (toastId ? t.id !== toastId : false)),
    }))
  }, [])

  const value = React.useMemo(
    () => ({
      toasts: state.toasts,
      toast,
      dismiss,
    }),
    [state.toasts, toast, dismiss]
  )

  return React.createElement(ToastContext.Provider, { value }, children)
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 
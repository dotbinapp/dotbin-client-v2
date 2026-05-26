import { Toaster as SonnerToaster } from 'sonner'
import type { ToasterProps } from 'sonner'

function Toast({ position = 'top-right', visibleToasts = 4, ...props }: Readonly<ToasterProps>) {
  return (
    <SonnerToaster
      closeButton={false}
      gap={12}
      mobileOffset={16}
      offset={24}
      position={position}
      theme="light"
      toastOptions={{
        classNames: {
          toast: '!bg-transparent !border-0 !shadow-none !p-0',
        },
      }}
      visibleToasts={visibleToasts}
      {...props}
    />
  )
}

export default Toast

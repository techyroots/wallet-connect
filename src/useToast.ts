import { useContext } from 'react'
import { ToastsContext } from 'Provider'

const useToast = () => {
  const toastContext = useContext(ToastsContext)

  if (toastContext === undefined) {
    throw new Error('Toasts context undefined')
  }

  return toastContext
}

export default useToast

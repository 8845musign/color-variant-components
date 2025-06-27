import { h } from "preact"

interface StatusIndicatorProps {
  show: boolean
  message: string
}

export function StatusIndicator({ show, message }: StatusIndicatorProps) {
  if (!show) return null
  
  return (
    <div class="status show">
      {message}
    </div>
  )
}
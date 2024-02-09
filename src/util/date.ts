import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(dateString: string) {
  const dateObj = new Date(dateString)
  return format(dateObj, 'do MMMM yyyy')
}

export function timeSinceLastUpdate(dateString: string) {
  const past = new Date(dateString)
  return formatDistanceToNow(past, { addSuffix: true })
}

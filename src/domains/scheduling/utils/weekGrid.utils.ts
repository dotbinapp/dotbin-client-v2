export function getSlotMenuPosition(clientX: number, clientY: number) {
  const menuWidth = 220
  const menuHeight = 104
  const padding = 8
  const gap = 6
  let left = clientX + gap
  let top = clientY + gap

  if (left + menuWidth > window.innerWidth - padding) left = clientX - menuWidth - gap
  if (left < padding) left = padding
  if (top + menuHeight > window.innerHeight - padding) top = clientY - menuHeight - gap
  if (top < padding) top = padding

  return { left, top }
}

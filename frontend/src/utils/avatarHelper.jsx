const COLORS = [
  '#5f6FFF', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#F7A072', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE',
]

export function getAvatarColor(name = '') {
  const idx = (name.charCodeAt(0) || 0) % COLORS.length
  return COLORS[idx]
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function DoctorAvatar({ name = 'D', size = 48, className = '' }) {
  const color    = getAvatarColor(name)
  const initials = getInitials(name)
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.33 }}
    >
      {initials}
    </div>
  )
}

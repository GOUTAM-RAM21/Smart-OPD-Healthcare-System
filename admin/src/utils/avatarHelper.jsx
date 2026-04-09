const COLORS = ['#5f6FFF','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#DDA0DD','#F7DC6F','#82E0AA']

export function getAvatarColor(name = '') {
  if (!name) return COLORS[0]
  return COLORS[name.charCodeAt(0) % COLORS.length]
}

export function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function DoctorAvatar({ name = '', size = 56, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: getAvatarColor(name), fontSize: size * 0.34 }}
    >
      {getInitials(name)}
    </div>
  )
}

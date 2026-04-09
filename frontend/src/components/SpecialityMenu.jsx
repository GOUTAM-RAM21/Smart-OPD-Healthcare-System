import { useNavigate } from 'react-router-dom'

const specialities = [
  { name: 'General physician', icon: '🩺' },
  { name: 'Gynecologist',      icon: '👩‍⚕️' },
  { name: 'Dermatologist',     icon: '🧴' },
  { name: 'Pediatricians',     icon: '👶' },
  { name: 'Neurologist',       icon: '🧠' },
  { name: 'Gastroenterologist',icon: '🫁' },
  { name: 'Orthopedic',        icon: '🦴' },
]

export default function SpecialityMenu() {
  const navigate = useNavigate()
  return (
    <section className="py-16 text-center" id="speciality">
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Find by Speciality</h2>
      <p className="text-gray-500 mb-10">Simply browse through our extensive list of trusted doctors.</p>
      <div className="flex gap-4 overflow-x-auto pb-4 justify-start sm:justify-center">
        {specialities.map(s => (
          <div key={s.name}
            onClick={() => navigate(`/doctors/${s.name}`)}
            className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-2xl border-2 border-transparent hover:border-primary transition-colors">
              {s.icon}
            </div>
            <p className="text-xs text-gray-600 font-medium text-center w-20 leading-tight">{s.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

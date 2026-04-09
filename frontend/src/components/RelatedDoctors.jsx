import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function RelatedDoctors({ speciality, docId }) {
  const navigate = useNavigate()
  const { doctors } = useAppContext()
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (doctors.length && speciality) {
      setRelated(doctors.filter(d => d.speciality === speciality && d._id !== docId).slice(0, 4))
    }
  }, [doctors, speciality, docId])

  if (!related.length) return null

  return (
    <section className="py-12 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Related Doctors</h2>
      <p className="text-gray-500 mb-8">Simply browse through our extensive list of trusted doctors.</p>
      <div className="grid grid-cols-auto gap-4">
        {related.map(doc => (
          <div key={doc._id}
            onClick={() => { navigate(`/appointment/${doc._id}`); scrollTo(0, 0) }}
            className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="bg-indigo-50 h-36 flex items-center justify-center">
              {doc.image
                ? <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                : <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">{doc.name[0]}</div>
              }
            </div>
            <div className="p-3 text-left">
              <div className="flex items-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500">{doc.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

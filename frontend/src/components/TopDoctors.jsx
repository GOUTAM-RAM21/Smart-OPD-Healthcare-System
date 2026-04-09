import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function TopDoctors() {
  const navigate = useNavigate()
  const { doctors } = useAppContext()

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Top Doctors to Book</h2>
      <p className="text-gray-500 mb-10">Simply browse through our extensive list of trusted doctors.</p>

      <div className="grid grid-cols-auto gap-4 pt-4">
        {doctors.slice(0, 8).map(doc => (
          <div key={doc._id}
            onClick={() => navigate(`/appointment/${doc._id}`)}
            className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="bg-indigo-50 h-40 flex items-center justify-center">
              {doc.image
                ? <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                : <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {doc.name[0]}
                  </div>
              }
            </div>
            <div className="p-3 text-left">
              <div className="flex items-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500">{doc.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/doctors')}
        className="mt-10 bg-indigo-50 text-primary px-10 py-3 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors">
        More doctors
      </button>
    </section>
  )
}

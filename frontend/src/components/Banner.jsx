import { useNavigate } from 'react-router-dom'

export default function Banner() {
  const navigate = useNavigate()
  return (
    <section className="bg-primary rounded-2xl px-8 md:px-14 py-12 my-16 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2 leading-snug">
          Book Appointment<br />With 100+ Trusted Doctors
        </h2>
        <button onClick={() => navigate('/login')}
          className="mt-6 bg-white text-primary px-8 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform">
          Create account
        </button>
      </div>

      <div className="relative z-10 text-white text-center md:text-right">
        <div className="text-5xl mb-2">👨‍⚕️</div>
        <p className="text-white/80 text-sm">Trusted by 10,000+ patients</p>
      </div>
    </section>
  )
}

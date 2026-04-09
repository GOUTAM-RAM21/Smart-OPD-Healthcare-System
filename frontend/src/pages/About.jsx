export default function About() {
  return (
    <div className="py-12 page-enter">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">About <span className="text-primary">Prescripto</span></h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">Your trusted digital healthcare partner — making quality care accessible to everyone.</p>
      </div>

      {/* Mission */}
      <div className="flex flex-col md:flex-row gap-10 mb-14 items-center">
        <div className="w-full md:w-64 h-64 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/10" />
          <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full bg-white/10" />
          <span className="text-white text-7xl relative z-10">🏥</span>
        </div>
        <div className="flex-1 space-y-4 text-gray-500 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-gray-800">Our Mission</h2>
          <p>Our mission is to make quality healthcare accessible to everyone. We understand the challenges individuals face when scheduling doctor appointments and managing health records.</p>
          <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience.</p>
          <h3 className="text-gray-700 font-semibold text-base">Our Vision</h3>
          <p>We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {[
          { value: '500+',    label: 'Trusted Doctors' },
          { value: '10,000+', label: 'Happy Patients' },
          { value: '50+',     label: 'Specialities' },
          { value: '4.9★',    label: 'Average Rating' },
        ].map(s => (
          <div key={s.label} className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
            <p className="text-2xl font-bold text-primary mb-1">{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Why choose us */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">Why <span className="text-primary">Choose Us</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {[
          { icon: '✅', title: 'Verified Doctors',  desc: 'All doctors verified with medical council registration.' },
          { icon: '⚡', title: 'Easy Booking',      desc: 'Book an appointment in under 60 seconds, anytime.' },
          { icon: '🔒', title: 'Secure Records',    desc: 'Your data is encrypted and completely private.' },
        ].map(c => (
          <div key={c.title}
            className="border border-gray-200 rounded-2xl p-6 hover:bg-primary hover:text-white hover:border-primary transition-all group cursor-default">
            <div className="text-2xl mb-3">{c.icon}</div>
            <h4 className="font-semibold mb-2 group-hover:text-white">{c.title}</h4>
            <p className="text-sm text-gray-500 group-hover:text-white/90">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">How It <span className="text-primary">Works</span></h3>
      <div className="flex flex-col md:flex-row items-center justify-center gap-0 mb-14">
        {[
          { step: 1, title: 'Create Account', desc: 'Sign up in seconds with your email' },
          { step: 2, title: 'Find Doctor',    desc: 'Browse by specialty or search by name' },
          { step: 3, title: 'Book & Consult', desc: 'Pick a slot and confirm your appointment' },
        ].map((s, i) => (
          <div key={s.step} className="flex flex-col md:flex-row items-center">
            <div className="flex flex-col items-center text-center max-w-[160px]">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-3">{s.step}</div>
              <p className="font-semibold text-gray-800 text-sm mb-1">{s.title}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
            {i < 2 && <div className="hidden md:block w-16 h-0.5 bg-primary/30 mx-2 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}

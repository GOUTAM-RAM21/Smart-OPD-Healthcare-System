const R = {
  emergency: '🚨 This sounds serious. Please call emergency services or go to the nearest hospital immediately. Do not wait.',
  chest: '🚨 CHEST PAIN SERIOUS HO SAKTA HAI! Please abhi emergency services call karein ya nearest hospital jayein. Ek minute bhi wait mat karein. 🚨',
  breathe: '🚨 Difficulty breathing requires urgent care. Please call emergency services now. Abhi 112 call karein! 🚨',
  headache: [
    "Arre, sar dard bahut takleef deta hai 😟 Kya ye tej dard hai ya halka? Paani piyein aur thodi der aaram karein. Agar zyada time tak rahe toh doctor se milein 💙",
    "Headache can be really draining 😔 Is it stress or maybe dehydration? Try drinking water and resting in a dark room. Please consult a doctor if it persists 💙",
  ],
  fever: [
    "Bukhar matlab body kuch fight kar rahi hai 🤒 Paani zyada piyein, aaram karein. 103°F se zyada ho ya 3 din se zyada rahe toh doctor ke paas zaroor jayein 💙",
    "Oh no, a fever means your body is fighting something 🤒 Stay well hydrated and rest. If it's above 103°F or lasts more than 3 days, please see a doctor 💙",
  ],
  tired: [
    "Thakaan bahut common problem hai 😔 Kya aap 7-8 ghante so rahe hain? Balanced diet aur regular exercise se energy level improve hoti hai. Agar zyada ho toh blood test karwayein 💙",
    "Feeling constantly tired can really affect your daily life 😔 Are you getting 7-8 hours of sleep? A basic blood test might help identify any deficiencies 💙",
  ],
  fine: [
    "Bahut achha! 😊 Healthy rehna bahut zaroori hai. Kya aaj paani theek se pi rahe hain? Hydrated rehna bahut important hai!",
    "That's wonderful to hear! 😊 Apna khayal rakhein. Koi health sawaal ho toh zaroor poochein!",
    "Great to hear you're doing well! 😊 Aaj ki ek health tip: 8 glasses paani zaroor piyein 💙",
  ],
  good: [
    "So happy to hear that! 😊 Keep up whatever you're doing — it's clearly working! Kuch aur health related poochna hai?",
    "Bahut achha! 😊 Apni healthy habits continue rakhein. Exercise aur balanced diet se health aur bhi better hogi!",
  ],
  bad: [
    "Oh, I'm sorry to hear that 😔 Kya aap physically unwell hain ya emotionally? Thoda aur batayein toh main better help kar sakti hoon.",
    "That sounds tough 😔 Kya ho raha hai exactly? Knowing more will help me give you better guidance 💙",
  ],
  pain: [
    "I'm sorry you're in pain 😟 Dard kahan ho raha hai aur 1-10 mein kitna severe hai? Yeh batayein toh main better samajh sakti hoon.",
    "Pain is your body's way of signaling something needs attention 😟 Where is the pain located? Please see a doctor if it's severe or persistent 💙",
  ],
  stomach: [
    "Pet ki takleef bahut uncomfortable hoti hai 😟 Kya dard hai, nausea hai ya bloating? Halka khana khayein aur paani piyein. Agar severe ho toh doctor se milein 💙",
  ],
  stress: [
    "Stress sach mein health pe bahut asar karta hai 😔 Kya chal raha hai? Deep breathing, thodi walk ya meditation se bahut fark padta hai.",
    "I hear you — stress can be overwhelming 😔 Try taking short breaks and practicing deep breathing. Aapki mental health bhi utni hi important hai 💙",
  ],
  sleep: [
    "Neend ki kami se sab kuch affect hota hai — mood, energy, immunity 😔 Kya aapko neend aane mein problem hai ya beech mein uthna padta hai? Regular sleep schedule try karein 💙",
  ],
  dizzy: [
    "Chakkar aana kaafi uncomfortable hota hai 😟 Kya aapne aaj kuch khaya aur paani piya? Baith jayein ya let jayein. Agar zyada ho toh doctor se zaroor milein 💙",
  ],
  cough: [
    "Khansi bahut irritating hoti hai 😟 Dry hai ya productive? Kitne din se hai? Garam paani mein honey milake piyein. Ek hafte se zyada rahe toh doctor se milein 💙",
  ],
  book: [
    "Bilkul! 😊 Aap 'All Doctors' section mein jaayein, apni zaroorat ke hisaab se specialist chunein, aur ek convenient slot book karein. Kya aap kisi specific condition ke liye doctor dhundh rahe hain?",
    "I'd love to help you book! 😊 Head to the 'All Doctors' section to see available doctors by specialty. Click any doctor to see their available time slots!",
  ],
  doctor: [
    "Prescripto pe bahut trusted doctors hain! 😊 Aap specialty ke hisaab se browse kar sakte hain — General physician, Gynecologist, Dermatologist, Neurologist, aur bahut kuch. Kaunsi specialty chahiye?",
  ],
  hi: [
    "Namaste! 😊 Main Aarohi hoon, aapki health assistant. Aap kaise feel kar rahe hain aaj? Main yahan hoon aapki help ke liye 💙",
    "Hello! 😊 I'm Aarohi, your personal health guide on Prescripto. How are you feeling today? Main yahan hoon aapki help ke liye 💙",
  ],
  appointment: [
    "Appointment book karne ke liye 'All Doctors' section mein jaayein. Apna preferred doctor chunein, date aur time slot select karein, aur ho gaya! 😊",
  ],
  default: [
    "Main yahan hoon aapke liye 💙 Thoda aur batayein — aap kaise feel kar rahe hain? Jitna share karenge, utni better help kar sakti hoon.",
    "Thank you for reaching out 😊 Could you describe what you're experiencing in a bit more detail? Main aapki best help karna chahti hoon.",
    "Main sun rahi hoon 💙 Kya ho raha hai? Tell me more and I'll do my best to help you.",
  ],
}

const EMERGENCY_KW = ['chest pain',"can't breathe",'cannot breathe','difficulty breathing','unconscious','fainted','heart attack','stroke','bleeding heavily','overdose']

const KW_MAP = {
  chest:'chest', breath:'breathe', breathing:'breathe',
  headache:'headache','head ache':'headache', migraine:'headache','head pain':'headache',
  fever:'fever', temperature:'fever', bukhar:'fever',
  tired:'tired', fatigue:'tired', exhausted:'tired', thaka:'tired',
  pain:'pain', hurts:'pain', ache:'pain', dard:'pain',
  bad:'bad', sick:'bad', unwell:'bad', terrible:'bad', awful:'bad', bura:'bad',
  fine:'fine', great:'fine', okay:'fine', ok:'fine', well:'fine', wonderful:'fine', healthy:'fine', theek:'fine',
  good:'good', achha:'good',
  stress:'stress', anxious:'stress', worried:'stress', anxiety:'stress',
  sleep:'sleep', insomnia:'sleep', neend:'sleep',
  stomach:'stomach', nausea:'stomach', vomit:'stomach', bloat:'stomach', pet:'stomach',
  dizzy:'dizzy', dizziness:'dizzy', chakkar:'dizzy',
  cough:'cough', cold:'cough', khansi:'cough',
  book:'book', appointment:'appointment',
  doctor:'doctor', specialist:'doctor',
  hi:'hi', hello:'hi', hey:'hi', namaste:'hi', hii:'hi',
}

function pick(arr) { return typeof arr === 'string' ? arr : arr[Math.floor(Math.random() * arr.length)] }

export function getAarahiResponse(message) {
  const lower = message.toLowerCase()
  for (const kw of EMERGENCY_KW) { if (lower.includes(kw)) return R.emergency }
  for (const [kw, cat] of Object.entries(KW_MAP)) {
    if (lower.includes(kw) && R[cat]) return pick(R[cat])
  }
  return pick(R.default)
}

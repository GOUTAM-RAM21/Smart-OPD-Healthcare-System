import Groq from 'groq-sdk'
import * as pdfjsLib from 'pdfjs-dist'

// Point pdfjs worker to the bundled worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

// ─── Step 1: Text Extraction ────────────────────────────────────────────────

export async function extractTextFromFile(file, onStep) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'pdf') {
    onStep('📄 Reading your PDF report...')
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      fullText += content.items.map(item => item.str).join(' ') + '\n'
    }
    return fullText.trim() || 'No readable text found in PDF.'
  }

  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    onStep('📄 Running OCR on your image...')
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker('eng')
    const { data: { text } } = await worker.recognize(file)
    await worker.terminate()
    return text.trim() || 'No readable text found in image.'
  }

  throw new Error('Unsupported file type. Please upload PDF, JPG, or PNG.')
}

// ─── Step A: Classify ────────────────────────────────────────────────────────

async function classifyReport(rawText) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 100,
    messages: [
      {
        role: 'system',
        content: 'You are a medical report classifier. Reply with ONLY one of these exact words: BLOOD_TEST, IMAGING, PRESCRIPTION, GENERAL. No explanation.',
      },
      {
        role: 'user',
        content: `Classify this medical report:\n\n${rawText.slice(0, 1500)}`,
      },
    ],
  })
  const raw = res.choices[0].message.content.trim().toUpperCase()
  const valid = ['BLOOD_TEST', 'IMAGING', 'PRESCRIPTION', 'GENERAL']
  return valid.find(v => raw.includes(v)) || 'GENERAL'
}

// ─── Step B: Extract Structured Data ────────────────────────────────────────

async function extractStructuredData(rawText, reportType) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: `You are a medical data extractor. Extract test parameters from this ${reportType} report.
Return a JSON array ONLY — no markdown, no explanation. Format:
[{"parameter":"...","value":"...","unit":"...","normalRange":"...","status":"normal"|"high"|"low"}]
If no parameters found, return [].`,
      },
      {
        role: 'user',
        content: rawText.slice(0, 3000),
      },
    ],
  })
  try {
    const content = res.choices[0].message.content.trim()
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : []
  } catch {
    return []
  }
}

// ─── Step C: Full AI Analysis ────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are VitaCare AI — an expert medical report analyzer.
A patient has uploaded their medical report. Your job is to:

1. Identify the report type (Blood Test, CBC, LFT, KFT, Thyroid, X-Ray, etc.)
2. List all test parameters found with their values and normal ranges
3. Flag any ABNORMAL values clearly with a warning
4. Give an overall health summary in simple language
5. Provide 3-5 actionable health tips based on the report
6. Add a disclaimer: "This is AI analysis, not a doctor's advice."

IMPORTANT RULES:
- Respond in Hinglish (Hindi + English mix) — simple language
- Use emojis to make it friendly and readable
- Structure your response with clear sections using these headings:
  📋 Report Type
  🔬 Test Results & Analysis
  ⚠️ Abnormal Values (if any)
  💊 Health Summary
  ✅ Recommendations
  ⚕️ Disclaimer
- Be warm, caring, and easy to understand
- Never be scary or alarmist`

async function generateInsight(rawText, extractedData, fileName) {
  const date = new Date().toLocaleDateString('en-IN')
  const structuredSummary = extractedData.length > 0
    ? `\n\nExtracted Parameters:\n${JSON.stringify(extractedData, null, 2)}`
    : ''

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Yeh meri medical report ka extracted text hai. Please analyze karo:\n\n${rawText.slice(0, 4000)}${structuredSummary}\n\nReport file name: ${fileName}\nUpload date: ${date}`,
      },
    ],
  })
  return res.choices[0].message.content
}

// ─── Main Agent ──────────────────────────────────────────────────────────────

export async function analyzeReportAgent(file, onStep) {
  // Step 1 — Extract text
  const rawText = await extractTextFromFile(file, onStep)

  // Step A — Classify
  onStep('🧠 Classifying report type...')
  const reportType = await classifyReport(rawText)

  // Step B — Extract structured data
  onStep('🔬 Extracting test values...')
  const extractedData = await extractStructuredData(rawText, reportType)

  // Step C — Full analysis
  onStep('💡 Generating health insights...')
  const aiInsight = await generateInsight(rawText, extractedData, file.name)

  // Step D — Build result object
  const hasAbnormal = extractedData.some(d => d.status === 'high' || d.status === 'low')
  const result = {
    fileName: file.name,
    date: new Date().toLocaleDateString('en-IN'),
    reportType,
    extractedData,
    aiInsight,
    hasAbnormal,
    rawText,
  }

  // Persist to localStorage
  const key = `vitacare_report_${Date.now()}`
  localStorage.setItem(key, JSON.stringify(result))

  return result
}

// ─── Follow-up Q&A ───────────────────────────────────────────────────────────

export async function askFollowUp(question, reportSummary) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 300,
    messages: [
      {
        role: 'system',
        content: `You are VitaCare AI. You already analyzed this report:\n\n${reportSummary.slice(0, 1000)}\n\nAnswer the patient's follow-up question in simple Hinglish. Be warm and helpful. Max 3-4 sentences.`,
      },
      { role: 'user', content: question },
    ],
  })
  return res.choices[0].message.content
}

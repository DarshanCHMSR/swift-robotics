export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

export async function GET() {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ success: false, error: 'GEMINI_API_KEY not configured' }, { status: 500 })
  }

  try {
    const unanalyzedArticles = await prisma.article.findMany({
      where: { aiAnalysis: null },
      take: 10, // Process in small batches
    })

    let processed = 0

    for (const article of unanalyzedArticles) {
      try {
        const prompt = `
          Analyze the following news article for an Economics News Monitoring Agent.
          
          Title: ${article.title}
          Description/Content: ${article.content ? article.content.substring(0, 1500) : ''}
          
          Provide the output as a valid JSON object with the following fields:
          - "summary": A brief 1-2 sentence summary.
          - "importance_score": An integer from 1 to 10 rating the economic importance.
          - "category": A single word or short phrase category (e.g. "Inflation", "Stock Market", "General").
          - "sentiment": "Positive", "Negative", or "Neutral".
          - "reason": A short sentence explaining why it is important (or why it's not).
          - "noise": A boolean (true if the article is irrelevant, celebrity news, or pure marketing noise, false if it's actual economic/business news).
          
          Return ONLY the JSON object, with no markdown formatting or extra text.
        `

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })

        const textResponse = response.text || ''
        const jsonStr = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim()
        
        let result
        try {
          result = JSON.parse(jsonStr)
        } catch (e) {
          console.error('Failed to parse JSON from AI:', jsonStr)
          continue
        }

        await prisma.aiAnalysis.create({
          data: {
            articleId: article.id,
            summary: result.summary,
            importanceScore: result.importance_score,
            category: result.category,
            sentiment: result.sentiment,
            reason: result.reason,
            noise: result.noise === true || String(result.noise).toLowerCase() === 'true',
          }
        })
        processed++
      } catch (err) {
        console.error(`Failed to process article ${article.id}`, err)
      }
    }

    return NextResponse.json({ success: true, processed })
  } catch (error) {
    console.error('AI Processing error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

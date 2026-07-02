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
    
    if (unanalyzedArticles.length === 0) {
      return NextResponse.json({ success: true, processed: 0 })
    }

    const enabledTopics = await prisma.topic.findMany({ where: { enabled: true } })
    const enabledCompetitors = await prisma.competitor.findMany({ where: { enabled: true } })

    const topicList = enabledTopics.map(t => t.name).join(', ')
    const competitorList = enabledCompetitors.map(c => c.name).join(', ')

    let processed = 0

    for (const article of unanalyzedArticles) {
      try {
        const prompt = `
          You are an elite Economics Intelligence Analyst.
          Analyze the following news article.

          Instructions:
          - Ignore sports, celebrity news, entertainment, religion, and advertisements.
          - Ignore politics unless economic impact exists.
          - Ignore opinion articles without factual economic backing.
          - Prioritize: GDP, Inflation, Central Banks, Trade, Employment, Manufacturing, Exports, Imports, Tax, Budget, Stock Markets, Currency, Oil Prices, Financial Regulations, Corporate Earnings, Global Economy.

          Available Topics to Match: [${topicList}]
          Available Competitors to Match: [${competitorList}]
          
          Title: ${article.title}
          Description/Content: ${article.content ? article.content.substring(0, 1500) : ''}
          
          Provide the output as a valid JSON object with the following fields:
          {
            "summary": "A brief 1-2 sentence summary",
            "importanceScore": 8, // An integer from 1 to 10
            "importanceReason": "Explain WHY the article received that score. (e.g. 'This discusses an RBI rate cut which impacts inflation')",
            "category": "A single word or short phrase category",
            "sentiment": "Positive, Negative, or Neutral",
            "noise": false, // true if irrelevant or ignored, false if valid economic news
            "matchedTopics": ["List any topics from the Available Topics above that apply exactly"],
            "mentionedCompetitors": ["List any competitors from the Available Competitors above that are mentioned"]
          }
          
          Return ONLY valid JSON. No markdown formatting or extra text.
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
            importanceScore: result.importanceScore || result.importance_score || 0,
            importanceReason: result.importanceReason || '',
            category: result.category,
            sentiment: result.sentiment,
            reason: '', // Obsolete field, kept for safety
            noise: result.noise === true || String(result.noise).toLowerCase() === 'true',
            matchedTopics: result.matchedTopics || [],
            mentionedCompetitors: result.mentionedCompetitors || [],
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

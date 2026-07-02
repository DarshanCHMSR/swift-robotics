require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function main() {
  const unanalyzedArticles = await prisma.article.findMany({
    where: { aiAnalysis: null },
    take: 3,
  })

  console.log(`Found ${unanalyzedArticles.length} unanalyzed articles`)

  for (const article of unanalyzedArticles) {
    try {
      console.log('Processing:', article.title)
      const prompt = `
        Analyze the following news article for an Economics News Monitoring Agent.
        
        Title: ${article.title}
        Description/Content: ${article.content.substring(0, 1000)} // truncate to save tokens
        
        Provide the output as a valid JSON object with the following fields:
        - "summary": A brief 1-2 sentence summary.
        - "importance_score": An integer from 1 to 10 rating the economic importance.
        - "category": A single word or short phrase category.
        - "sentiment": "Positive", "Negative", or "Neutral".
        - "reason": A short sentence explaining why it is important.
        - "noise": A boolean (true if irrelevant, false if actual economic news).
        
        Return ONLY the JSON object, with no markdown formatting or extra text.
      `

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      })

      const textResponse = response.text || ''
      const jsonStr = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim()
      
      let result = JSON.parse(jsonStr)
      console.log('Result:', result)

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
      console.log('Saved analysis for:', article.id)
    } catch (err) {
      console.error(`Failed to process article ${article.id}`, err)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())

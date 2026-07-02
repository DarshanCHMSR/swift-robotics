const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const articles = await prisma.article.findMany()
  const analyses = await prisma.aiAnalysis.findMany()
  
  console.log('Articles count:', articles.length)
  console.log('Analyses count:', analyses.length)
  
  if (articles.length > 0) {
    console.log('First article:', articles[0].title)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())

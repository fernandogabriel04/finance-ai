"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";
import { endOfMonth, parse, startOfMonth } from "date-fns";

export const generateAiReport = async ({ period }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ period });
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan == "premium";
  if (!hasPremiumPlan) {
    throw new Error("You need a premium plan to generate AI reports");
  }
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Converte o período para datas válidas
  const startDate = startOfMonth(parse(period, "MM-yyyy", new Date()));
  const endDate = endOfMonth(parse(period, "MM-yyyy", new Date()));

  // pegar as transações do periodo recebido
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
  const content = `
    Gere um relatório com insights sobre minhas finanças, com dicas e orientações para melhoria de hábitos financeiros.
    As transações estão divididas por ponto e vírgula. A estrutura de cada uma é: {DATA}-{TIPO}-{VALOR}-{CATEGORIA} 
    Transações:
    ${transactions
      .map(
        (transaction) =>
          `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${transaction.category}`,
      )
      .join(";")}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.",
      },
      {
        role: "user",
        content,
      },
    ],
  });

  const response = completion.choices[0].message.content;

  return response;
  // mandar as transações para o GPT e pedir pra ele gerar um relatorio com insights
  //pegar o relatorio gerado pelo GPT e retornar para o usuario
};

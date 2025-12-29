
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseQuestionFromText = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extraia informações de questões de concurso do seguinte texto e retorne em formato JSON. 
    Estrutura: Array de objetos com { enunciado, disciplina, banca, ano, cargo, correta_letra (A-E), alternativas: [{letra, texto}] }.
    
    TEXTO:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            enunciado: { type: Type.STRING },
            disciplina: { type: Type.STRING },
            banca: { type: Type.STRING },
            ano: { type: Type.NUMBER },
            cargo: { type: Type.STRING },
            correta_letra: { type: Type.STRING },
            alternativas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  letra: { type: Type.STRING },
                  texto: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const crossReferencePdfExam = async (examText: string, answerText: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Você recebeu o texto de uma PROVA e o texto de um GABARITO.
    Cruze as informações para gerar questões completas.
    O resultado deve ser um JSON (array de objetos) pronto para banco de dados.
    
    TEXTO DA PROVA:
    ${examText.substring(0, 10000)}
    
    TEXTO DO GABARITO:
    ${answerText}
    
    REGRAS: 
    1. Identifique a questão e suas 5 alternativas.
    2. Vincule a letra correta baseada no gabarito fornecido.
    3. Retorne um array de Question conforme o schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            enunciado: { type: Type.STRING },
            disciplina: { type: Type.STRING },
            banca: { type: Type.STRING },
            ano: { type: Type.NUMBER },
            cargo: { type: Type.STRING },
            correta_letra: { type: Type.STRING },
            alternativas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  letra: { type: Type.STRING },
                  texto: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const ocrImage = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { text: "Realize o OCR desta imagem de prova de concurso. Extraia todo o texto das questões, mantendo a ordem." },
      { inlineData: { mimeType: "image/jpeg", data: base64Image } }
    ]
  });
  return response.text;
};

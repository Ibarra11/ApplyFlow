import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModel } from "ai";

export default class OpenAIService {
  private readonly model: LanguageModel;

  constructor() {
    this.model = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })("gpt-4o-mini");
  }

  getModel() {
    return this.model;
  }
}

from openai import OpenAI

from core.config import settings
from services.llm.base_provider import LLMProvider

_client = OpenAI(api_key=settings.OPENAI_API_KEY)


class OpenAIProvider(LLMProvider):
    MODEL = "gpt-4o-mini"

    def generate(self, prompt: str) -> tuple[str, int, int]:
        response = _client.chat.completions.create(
            model=self.MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        usage = response.usage
        return content, usage.prompt_tokens, usage.completion_tokens
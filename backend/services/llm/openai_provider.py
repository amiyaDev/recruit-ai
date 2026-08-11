from openai import OpenAI

from core.config import settings
from services.llm.base_provider import LLMProvider

_client = OpenAI(api_key=settings.OPENAI_API_KEY)


class OpenAIProvider(LLMProvider):
    MODEL = "gpt-4o-mini"

    def generate(self, prompt: str, json_mode: bool = True) -> tuple[str, int, int]:
        kwargs = {"response_format": {"type": "json_object"}} if json_mode else {}
        response = _client.chat.completions.create(
            model=self.MODEL,
            messages=[{"role": "user", "content": prompt}],
            **kwargs,
        )
        content = response.choices[0].message.content
        usage = response.usage
        return content, usage.prompt_tokens, usage.completion_tokens
    
    
    def generate_stream(self, prompt: str):
        stream = _client.chat.completions.create(
            model=self.MODEL,
            messages=[{"role": "user", "content": prompt}],
            stream=True,
            stream_options={"include_usage": True},
        )
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content, None, None
            if chunk.usage:
                yield None, chunk.usage.prompt_tokens, chunk.usage.completion_tokens

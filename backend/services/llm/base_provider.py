from abc import ABC, abstractmethod
from typing import Iterator


class LLMProvider(ABC):

    @abstractmethod
    def generate(self, prompt: str, json_mode: bool = True) -> tuple[str, int, int]:
        """Returns (response_text, input_tokens, output_tokens)."""
        ...

    @abstractmethod
    def generate_stream(self, prompt: str) -> Iterator[tuple[str | None, int | None, int | None]]:
        """Yields (text_delta, None, None) chunks while streaming, then one
        final (None, input_tokens, output_tokens) chunk carrying usage."""
        ...
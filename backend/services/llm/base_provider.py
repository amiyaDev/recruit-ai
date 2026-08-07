from abc import ABC, abstractmethod


class LLMProvider(ABC):

    @abstractmethod
    def generate(self, prompt: str) -> tuple[str, int, int]:
        """Returns (response_text, input_tokens, output_tokens)."""
        ...
from abc import ABC, abstractmethod


class LLMProvider(ABC):

    @abstractmethod
    def generate(self, prompt: str, json_mode: bool = True) -> tuple[str, int, int]:
        """Returns (response_text, input_tokens, output_tokens)."""
        ...

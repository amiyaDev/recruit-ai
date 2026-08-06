import docx


def extract_text_from_docx(file_path: str) -> str:
    document = docx.Document(file_path)
    return "\n".join(paragraph.text for paragraph in document.paragraphs)
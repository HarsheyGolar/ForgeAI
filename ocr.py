import pytesseract
from PIL import Image
import os

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_path: str) -> str:
    try:
        image = Image.open(image_path)
        extracted_text = pytesseract.image_to_string(image)

        if extracted_text.strip():
            return extracted_text.strip()
        else:
            return "No text found in this page."
    except Exception as e:
        return f"OCR Error: {str(e)}"
    
def extract_text_from_pdf(pdf_path: str)-> str:
    try:
        from pdf2image import convert_from_path
        poppler_path = os.getenv("POPPLER_PATH",r"C:\Poppler\poppler-25.12.0\Library\bin")
        pages = convert_from_path(pdf_path, dpi=200,poppler_path=poppler_path)
        full_text = ""
        for i,page in enumerate(pages):
            text = pytesseract.image_to_string(page)
            full_text += f"\n---Page {i+1}---\n{text}"
        return full_text.strip() if full_text.strip() else "No text found in pdf."
    except Exception as e:
        return f"Pdf OCR Error: {str(e)}"
    
def handle_file_ocr(file_path: str)-> str:
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)
    elif extension in [".jpg",".jpeg",".png",".bmp",".tiff",".webp"]:
        print(f"Image detected-extracting text...")
        return extract_text_from_image(file_path)
    
if __name__ == "__main__":
    test_path = input("Image/pdf path daalo:")
    result = handle_file_ocr(test_path)
    print("\nExtracted text:")
    print(result)

import os
from PyPDF2 import PdfReader
from pytesseract import image_to_string
from pdf2image import convert_from_path

# Define paths
SOURCE_DIR = "missed"
OUTPUT_DIR = "source/religion_txt"

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def handle_hyphenated_lines(text):
    """Fix hyphenated line breaks in text."""
    # Replace hyphen followed by newline with an empty string to join words
    return text.replace("-\n", "")

def extract_text_from_pdf(pdf_path):
    """Extract text from a text-based PDF."""
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
    return text

def extract_text_from_scanned_pdf(pdf_path):
    """Extract text from a scanned PDF using OCR."""
    text = ""
    try:
        images = convert_from_path(pdf_path)
        for image in images:
            text += image_to_string(image) + "\n"
    except Exception as e:
        print(f"Error processing {pdf_path} with OCR: {e}")
    return text

def convert_pdfs_to_txt(source_dir, output_dir):
    for filename in os.listdir(source_dir):
        if filename.endswith('.pdf'):
            pdf_path = os.path.join(source_dir, filename)
            base_name = os.path.splitext(filename)[0]
            output_path = os.path.join(output_dir, f"{base_name}.txt")

            # Attempt to extract text
            print(f"Processing: {filename}")
            text = extract_text_from_pdf(pdf_path)

            # If no text was extracted, try OCR
            if not text.strip():
                print(f"No text found in {filename}, attempting OCR...")
                text = extract_text_from_scanned_pdf(pdf_path)

            # Clean hyphenated line breaks
            if text.strip():
                text = handle_hyphenated_lines(text)

            # Save the extracted text
            if text.strip():
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(text)
                print(f"Saved: {output_path}")
            else:
                print(f"Failed to extract text from {filename}.")

if __name__ == "__main__":
    convert_pdfs_to_txt(SOURCE_DIR, OUTPUT_DIR)
    print("PDF to TXT conversion complete.")

import sys
from pdf2docx import parse

def converter():
    pdf_file = sys.argv[2]
    docx_file = sys.argv[3]
    parse(pdf_file, docx_file)
    print("OK")


if sys.argv[1] == 'converter':
    converter()

sys.stdout.flush()
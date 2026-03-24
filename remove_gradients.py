import os
import re

replacements = [
    (r'src/app/globals.css', r'background:\s*linear-gradient\(135deg,\s*#e87b20\s*0%,\s*#069542\s*100%\);', r'background-color: #069542;'),
    (r'src/app/globals.css', r'background:\s*linear-gradient\(135deg,\s*#e87b20\s*0%,\s*#f19547\s*100%\);', r'background-color: #e87b20;'),
    (r'src/app/globals.css', r'background:\s*linear-gradient\(135deg,\s*#e87b20\s*0%,\s*#d26d19\s*100%\);', r'background-color: #e87b20;'),
    (r'src/app/globals.css', r'background:\s*linear-gradient\(135deg,\s*rgba\(249,115,22,0\.4\)\s*0%,\s*rgba\(34,197,94,0\.4\)\s*100%\);', r'background-color: rgba(6,149,66,0.3);'),
    (r'src/app/globals.css', r'background:\s*linear-gradient\(135deg,\s*#e87b20\s*0%,\s*#f19547\s*30%,\s*#fbbf24\s*50%,\s*#069542\s*70%,\s*#e87b20\s*100%\);', r'background-color: #e87b20;'),

    (r'src/app/catalogo/page.tsx', r'style=\{\{\s*background:\s*\"linear-gradient\(135deg,#f97316,#22c55e\)\"\s*\}\}', r'style={{ background: "#e87b20" }}'),
    (r'src/components/catalog/ProductCard.tsx', r'\"linear-gradient\(135deg,\s*rgba\(249,115,22,0\.12\)\s*0%,\s*transparent\s*50%,\s*rgba\(34,197,94,0\.08\)\s*100%\)\"', r'"rgba(6,149,66,0.1)"'),
    (r'src/components/catalog/ProductCard.tsx', r'style=\{\{\s*background:\s*\"linear-gradient\(135deg,#f97316,#22c55e\)\"\s*\}\}', r'style={{ background: "#e87b20" }}'),
    (r'src/components/layout/Header.tsx', r'style=\{\{\s*background:\s*\"linear-gradient\(90deg,\s*#f97316,\s*#22c55e\)\"\s*\}\}', r'style={{ background: "#069542" }}'),
    (r'src/components/home/ServicesSection.tsx', r'background:\s*\"linear-gradient\(135deg,\s*rgba\(249,115,22,0\.2\),\s*rgba\(34,197,94,0\.1\)\)\"', r'background: "rgba(6,149,66,0.15)"'),
    (r'src/components/home/ServicesSection.tsx', r'background:\s*\"linear-gradient\(135deg,\s*#f97316,\s*#22c55e\)\"', r'background: "#069542"'),
    (r'src/components/home/StatsSection.tsx', r'background:\s*\"linear-gradient\(135deg,\s*#f97316\s*0%,\s*#22c55e\s*100%\)\"', r'background: "#069542"'),
    (r'src/components/home/StatsSection.tsx', r'style=\{\{\s*background:\s*\"linear-gradient\(90deg,\s*#f97316,\s*#22c55e\)\"\s*\}\}', r'style={{ background: "#e87b20" }}'),
    (r'src/components/home/TestimonialsSection.tsx', r'style=\{\{\s*background:\s*\"linear-gradient\(135deg,#f97316,#22c55e\)\"\s*\}\}', r'style={{ background: "#069542" }}')
]

for file_path, pattern, replacement in replacements:
    path = os.path.join(os.getcwd(), file_path)
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        new_content = re.sub(pattern, replacement, content)
        if content != new_content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error with {file_path}: {e}")

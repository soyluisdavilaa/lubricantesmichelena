import re

path = "src/lib/defaults.ts"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_products = False

for line in lines:
    if "export const defaultProducts" in line:
        in_products = True
    elif "export const" in line and "defaultProducts" not in line:
        in_products = False
        
    if in_products and re.search(r'precio:\s*".*?",?', line):
        continue  # skip
        
    new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
print("done")

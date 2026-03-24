import sys
from PIL import Image
from collections import Counter

def get_dominant_colors(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        
        # Resize to speed up processing
        img.thumbnail((200, 200))
        
        pixels = list(img.getdata())
        
        # Filter out white/background
        def is_white(p):
            return p[0] > 240 and p[1] > 240 and p[2] > 240
            
        def is_dark(p):
            return p[0] < 30 and p[1] < 30 and p[2] < 30
            
        def is_green(p):
            # G should be dominant
            return p[1] > p[0] + 10 and p[1] > p[2] + 10
            
        def is_orange(p):
            # R should be high, G moderate, B low
            return p[0] > 150 and p[1] > 80 and p[2] < 100 and p[0] > p[1]
            
        greens = [p for p in pixels if is_green(p) and not is_white(p) and not is_dark(p)]
        oranges = [p for p in pixels if is_orange(p) and not is_white(p) and not is_dark(p)]
        
        if greens:
            most_common_green = Counter(greens).most_common(1)[0][0]
            print(f"Green: #{most_common_green[0]:02x}{most_common_green[1]:02x}{most_common_green[2]:02x}")
            
        if oranges:
            most_common_orange = Counter(oranges).most_common(1)[0][0]
            print(f"Orange: #{most_common_orange[0]:02x}{most_common_orange[1]:02x}{most_common_orange[2]:02x}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_dominant_colors(r"C:\Users\soylu\.gemini\antigravity\brain\3a51dffa-5094-4b54-a0af-e2a60a47794e\media__1774364959390.png")

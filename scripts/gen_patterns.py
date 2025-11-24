from PIL import Image, ImageDraw
import os
import random

OUTPUT_DIR = "projects/helmet-customizer-r3f/public/patterns"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_stripe_single():
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Central vertical stripe - assuming UV mapping puts center of image on top center of helmet
    # This is a placeholder; UVs matter a lot here.
    draw.rectangle([462, 0, 562, 1024], fill=(255, 255, 255, 255)) 
    img.save(os.path.join(OUTPUT_DIR, "stripe_single.png"))

def create_stripe_double():
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([400, 0, 480, 1024], fill=(255, 255, 255, 255))
    draw.rectangle([544, 0, 624, 1024], fill=(255, 255, 255, 255))
    img.save(os.path.join(OUTPUT_DIR, "stripe_double.png"))

def create_tiger():
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for i in range(0, 1024, 60):
        # Tapered stripes
        y = i + random.randint(-20, 20)
        points = [(0, y), (400, y+50), (600, y-50), (1024, y)]
        draw.line(points, fill=(0, 0, 0, 200), width=30)
    img.save(os.path.join(OUTPUT_DIR, "tiger.png"))

def create_leopard():
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for _ in range(100):
        x = random.randint(0, 1024)
        y = random.randint(0, 1024)
        w = random.randint(20, 50)
        h = random.randint(20, 50)
        draw.ellipse([x, y, x+w, y+h], outline=(0,0,0,255), width=5)
    img.save(os.path.join(OUTPUT_DIR, "leopard.png"))

def create_camo():
    # Opaque texture for camo
    img = Image.new('RGBA', (1024, 1024), (50, 100, 50, 255)) 
    draw = ImageDraw.Draw(img)
    colors = [(100, 80, 50), (30, 60, 30), (10, 10, 10)]
    for _ in range(80):
        x = random.randint(-100, 1100)
        y = random.randint(-100, 1100)
        r = random.randint(50, 200)
        color = random.choice(colors)
        draw.ellipse([x-r, y-r, x+r, y+r], fill=color)
    img.save(os.path.join(OUTPUT_DIR, "camo.png"))

def create_wolverine():
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Classic Michigan wing design abstraction
    draw.polygon([(0, 400), (512, 200), (1024, 400), (512, 0)], fill=(255, 215, 0, 200))
    img.save(os.path.join(OUTPUT_DIR, "wolverine.png"))

create_stripe_single()
create_stripe_double()
create_tiger()
create_leopard()
create_camo()
create_wolverine()

print("Patterns generated in " + OUTPUT_DIR)

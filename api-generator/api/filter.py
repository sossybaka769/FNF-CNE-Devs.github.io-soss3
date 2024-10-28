from lxml import etree

# This script filters out unnecessary classes from the doc.xml file, so its smaller and faster to load

parser = etree.XMLParser(recover=True) # recover=True to ignore invalid XML
tree = etree.parse('./doc.xml', parser)

root = tree.getroot()

print(f"Root tag: {root.tag}")

filtered = []

total = 0

for child in root:
    total += 1
    if "path" not in child.attrib:
        print(f"Tag: {child.tag}, Attributes: {child.attrib}, Text: {child.text.strip() if child.text else ''}")
        continue
    path = child.attrib["path"]
    if path.startswith("funkin") and not path.endswith("_HSX") and not path.endswith("_HSC"):
        filtered.append(child)


haxe = etree.Element("haxe")

for child in filtered:
    haxe.append(child)

tree = etree.ElementTree(haxe)

with open("./doc-filter.xml", "wb") as f:
    f.write(etree.tostring(haxe, pretty_print=True, xml_declaration=True, encoding="utf-8"))

print(f"Cleaned up {total - len(filtered)} classes")
print(f"{total} to {len(filtered)}")
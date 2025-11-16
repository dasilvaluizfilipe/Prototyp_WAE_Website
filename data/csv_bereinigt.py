import csv
import json
import re
from datetime import datetime
from iso_countries import ISO_COUNTRY_MAP


INPUT_FILE = "cyber_incidents.csv"
OUTPUT_CLEAN = "cyber_incidents_clean.csv"
OUTPUT_LIGHT = "cyber_incidents_light.csv"
OUTPUT_COUNTRIES = "countries_index.json"
OUTPUT_DEBUG = "country_debug.csv"

MAX_DESCRIPTION_LENGTH = 200

# =====================================================================
# ISO-3166 COUNTRY MAP (vollständig + Synonyme + Normalformen)
# =====================================================================



# Regionale Begriffe → ignorieren
REGION_KEYWORDS = [
    "region", "asia", "europe", "americas", "global", "middle east",
    "south asia", "southeast asia", "west africa", "east africa",
    "north america", "south america", "oceania", "balkan", "union",
    "eu", "emea"
]

UNKNOWN_KEYWORDS = [
    "unknown", "not attributed", "not available", "n/a", "na", "none"
]

# =====================================================================
# Hilfsfunktionen
# =====================================================================

def clean_field(text):
    if text is None:
        return ""
    return (
        text.replace("\u0000", "")
            .replace("\r", " ")
            .replace("\n", " ")
            .strip()
    )

def shorten_description(text, limit=150):
    text = clean_field(text)
    if len(text) <= limit:
        return text
    return text[:limit].rstrip() + "…"

def normalize_date(d):
    if not d:
        return ""
    d = clean_field(d)

    try:
        dt = datetime.fromisoformat(d)
        return dt.strftime("%Y-%m-%d")
    except:
        pass

    patterns = [
        (r"\d{2}/\d{2}/\d{4}", "%d/%m/%Y"),
        (r"\d{2}-\d{2}-\d{4}", "%d-%m-%Y"),
        (r"\d{4}\.\d{2}\.\d{2}", "%Y.%m.%d"),
        (r"\d{4}/\d{2}/\d{2}", "%Y/%m/%d"),
    ]

    for pattern, fmt in patterns:
        if re.match(pattern, d):
            try:
                dt = datetime.strptime(d, fmt)
                return dt.strftime("%Y-%m-%d")
            except:
                pass

    return d


# =====================================================================
# MULTI-COUNTRY NORMALIZER + DEBUG
# =====================================================================

def normalize_country(raw, debug_list):
    """Gibt EIN Land zurück + schreibt in Debug-Liste."""

    raw_original = raw
    if not raw:
        debug_list.append((raw_original, "Unknown", "Empty"))
        return "Unknown"

    raw = clean_field(raw).lower().strip()
    raw = re.sub(r'^(the )?republic of ', '', raw)


    # Split bei allen typischen Trennzeichen
    parts = re.split(r"[|;,/]+|\s{2,}|\t+", raw)

    candidates = []

    for p in parts:
        original = p
        p = p.strip()
        if not p:
            continue

        # Sonderzeichen entfernen
        p = re.sub(r"[^a-z0-9\s]", "", p)
        p = re.sub(r"\s+", " ", p).strip()

        # Unknown?
        if p in UNKNOWN_KEYWORDS:
            debug_list.append((original, "Unknown", "Unknown keyword"))
            candidates.append("Unknown")
            continue

        # Region?
        if any(k in p for k in REGION_KEYWORDS):
            debug_list.append((original, "", "Region ignored"))
            continue

        # ISO Match?
        if p in ISO_COUNTRY_MAP:
            cn = ISO_COUNTRY_MAP[p]
            debug_list.append((original, cn, "ISO match"))
            candidates.append(cn)
            continue

        # Smart-Matching
        p2 = (
            p.replace("republic of", "")
             .replace("federation", "")
             .replace("people s", "")
             .strip()
        )

        if p2 in ISO_COUNTRY_MAP:
            cn = ISO_COUNTRY_MAP[p2]
            debug_list.append((original, cn, "Smart ISO match"))
            candidates.append(cn)
            continue

        # sonst → unbekannt / ignoriere
        debug_list.append((original, "", "Ignored (no match)"))

    # Ergebnis bestimmen
    if not candidates:
        debug_list.append((raw_original, "Unknown", "No valid country found"))
        return "Unknown"

    # Nimm erstes gültiges Land
    return candidates[0]


# =====================================================================
# CSV laden
# =====================================================================

print("\n📥 Lade CSV...")
with open(INPUT_FILE, encoding="utf-8", errors="ignore") as f:
    reader = csv.reader(f)
    raw_rows = list(reader)

header = [h.strip().replace('"', "") for h in raw_rows[0]]
rows = raw_rows[1:]
rows = [r for r in rows if any(cell.strip() for cell in r)]

print(f"➡ Zeilen: {len(rows)}")

# =====================================================================
# Duplikate entfernen
# =====================================================================

incident_id_index = header.index("incident_id")
seen = set()
unique_rows = []

for r in rows:
    ic = r[incident_id_index].strip()
    if ic not in seen:
        seen.add(ic)
        unique_rows.append(r)

rows = unique_rows
print(f"➡ Nach Duplikaten: {len(rows)}")

# =====================================================================
# Bereinigen + Country-Debug
# =====================================================================

cleaned = []
debug_entries = []

for r in rows:
    row = {header[i]: clean_field(r[i]) if i < len(r) else "" for i in range(len(header))}

    row["description"] = shorten_description(row.get("description", ""), MAX_DESCRIPTION_LENGTH)
    row["start_date"] = normalize_date(row.get("start_date", ""))
    row["end_date"] = normalize_date(row.get("end_date", ""))

    if "receiver_country" in row:
        row["receiver_country"] = normalize_country(row["receiver_country"], debug_entries)

    if "initiator_country" in row:
        row["initiator_country"] = normalize_country(row["initiator_country"], debug_entries)

    cleaned.append(row)

print(f"➡ Bereinigte Einträge: {len(cleaned)}")

# =====================================================================
# CLEAN speichern
# =====================================================================

with open(OUTPUT_CLEAN, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=header)
    writer.writeheader()
    writer.writerows(cleaned)

print("✔ Clean gespeichert")

# =====================================================================
# LIGHT speichern
# =====================================================================

important_columns = [
    "incident_id", "name", "description",
    "start_date", "end_date",
    "initiator_name", "initiator_country",
    "receiver_name", "receiver_country",
    "incident_type", "has_disruption",
    "source_url",
    "economic_impact", "economic_impact_value",
    "affected_entities", "affected_entities_value",
    "political_response_type", "legal_response_type",
    "user_interaction", "updated_at",
]

with open(OUTPUT_LIGHT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=important_columns)
    writer.writeheader()
    for row in cleaned:
        writer.writerow({k: row.get(k, "") for k in important_columns})

print("✔ Light gespeichert")

# =====================================================================
# Länderindex speichern
# =====================================================================

country_counts = {}

for r in cleaned:
    for k in ["receiver_country", "initiator_country"]:
        c = r.get(k)
        if c:
            country_counts[c] = country_counts.get(c, 0) + 1

with open(OUTPUT_COUNTRIES, "w", encoding="utf-8") as f:
    json.dump(country_counts, f, indent=2)

print("✔ Länder-Index gespeichert")


# =====================================================================
# Country-Debug speichern
# =====================================================================

with open(OUTPUT_DEBUG, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["original_value", "normalized_value", "reason"])
    for o, n, r in debug_entries:
        writer.writerow([o, n, r])

print("✔ DEBUG gespeichert: country_debug.csv")

print("\n🎉 FERTIG – Deine Länder sind jetzt *ENDLICH* sauber.\n")

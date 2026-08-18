import urllib.request, json

BASE = "https://azarraga.vercel.app/api/invoices"

invoices = [
  # PO 90643 - Tagusao - Tara Hostel El Nido - 900 Series doors (3/12/2026) - 685,000 PHP
  {
    "quoteId": "PO-90643",
    "customer": "Tagusao Construction and Trading Inc.",
    "project": "Tara Hostel - El Nido",
    "location": "Puerto Princesa City, Palawan",
    "poNumber": "90643",
    "items": [
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 2.938 x 2.700 (SD4)","qty":1,"unit":"set","widthMm":2938,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":30875},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 2.987 x 2.700 (SD5)","qty":1,"unit":"set","widthMm":2987,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":30875},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 2.994 x 2.700 (SD6)","qty":1,"unit":"set","widthMm":2994,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":30875},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 3.006 x 2.700 (SD7)","qty":1,"unit":"set","widthMm":3006,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":30875},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 2.975 x 2.700 (SD8)","qty":1,"unit":"set","widthMm":2975,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":30875},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 3.025 x 2.700 (SD9)","qty":1,"unit":"set","widthMm":3025,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":30875},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 3.597 x 2.700 (SD10)","qty":1,"unit":"set","widthMm":3597,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":38740,"amount":38740},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 3.808 x 2.700 (SD11)","qty":1,"unit":"set","widthMm":3808,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":40935,"amount":40935},
      {"description":"900 SERIES FIXED-SLIDE-SLIDE DOOR, BLACK FRAME, 10mm TEMPERED CLEAR, 2.975 x 2.700 (SD12)","qty":12,"unit":"set","widthMm":2975,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":30875,"amount":370500},
      {"description":"CRATING, SHIPPING, TRUCKING & INSTALLATION COST","qty":1,"unit":"lump","amount":54000},
    ],
    "totalCentavos": 68500000,
    "paidCentavos": 0,
    "sourceEvidence": [{"type":"po","document":"PO 90643","date":"2026-03-12","amount":685000}]
  },
  # PO 90826 - Tagusao - Tara Hostel El Nido - Frameless swing door (3/31/2026) - 28,000 PHP
  {
    "quoteId": "PO-90826",
    "customer": "Tagusao Construction and Trading Inc.",
    "project": "Tara Hostel - El Nido",
    "location": "Puerto Princesa City, Palawan",
    "poNumber": "90826",
    "items": [
      {"description":"DS SUPPLY INSTALLATION OF 12MM CLEAR TEMPERED FRAMELESS GLASS SWING DOOR WITH FROSTED FILM COMPLETE WITH HEAVY DUTY HINGES, STAINLESS STEEL LOCKSET AND STAINLESS STEEL HANDLE (0.90 x 2.40) CRATING/SHIPPING/DELIVERY","qty":1,"unit":"set","widthMm":900,"heightMm":2400,"glass":"12mm clear tempered with frosted film","unitPrice":24000,"amount":24000},
      {"description":"CRATING/SHIPPING/DELIVERY","qty":1,"unit":"lump","amount":4000},
    ],
    "totalCentavos": 2800000,
    "paidCentavos": 0,
    "sourceEvidence": [{"type":"po","document":"PO 90826","date":"2026-03-31","amount":28000}]
  },
  # PO 90973 - Tagusao - Tara Hostel El Nido - Fixed+Pocket Slide + 900 Series (4/23/2026) - 905,000 PHP
  {
    "quoteId": "PO-90973",
    "customer": "Tagusao Construction and Trading Inc.",
    "project": "Tara Hostel - El Nido",
    "location": "Puerto Princesa City, Palawan",
    "poNumber": "90973",
    "items": [
      {"description":"Fixed w/ Pocket Slide onr, Black Frame 10mm Tempered Clear 4.072 x 2.700","qty":1,"unit":"set","widthMm":4072,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":48320,"amount":48320},
      {"description":"Fixed w/ Pocket Slide onr, Black Frame 10mm Tempered Clear 4.097 x 2.700","qty":1,"unit":"set","widthMm":4097,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":51110,"amount":51110},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 3.600 x 2.700 (SD3)","qty":1,"unit":"set","widthMm":3600,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":45205,"amount":45205},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 2.938 x 2.700 (SD4)","qty":1,"unit":"set","widthMm":2938,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":34304},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 2.987 x 2.700 (SD5)","qty":1,"unit":"set","widthMm":2987,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":34304},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 7.994 x 2.700 (SD6)","qty":1,"unit":"set","widthMm":7994,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":34304},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 3.006 x 2.700 (SD7)","qty":1,"unit":"set","widthMm":3006,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":34304},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 2.975 x 2.700 (SD8)","qty":1,"unit":"set","widthMm":2975,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":34304},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 3.025 x 2.700 (SD9)","qty":1,"unit":"set","widthMm":3025,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":34304},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 3.597 x 2.700 (SD10)","qty":1,"unit":"set","widthMm":3597,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":41723,"amount":41723},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 3.808 x 2.700 (SD11)","qty":1,"unit":"set","widthMm":3808,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":43935,"amount":43935},
      {"description":"900 series Fixed-Slide-Door, Black Frame, 10mm Tempered Clear 2.975 x 2.700 (SD12)","qty":12,"unit":"set","widthMm":2975,"heightMm":2700,"glass":"10mm tempered clear","frame":"black","unitPrice":34304,"amount":411648},
      {"description":"CRATING, SHIPPING, TRUCKING & INSTALLATION COST","qty":1,"unit":"lump","amount":75000},
    ],
    "totalCentavos": 90500000,
    "paidCentavos": 0,
    "sourceEvidence": [{"type":"po","document":"PO 90973","date":"2026-04-23","amount":905000}]
  },
  # Royal Suites - Port Barton, San Vicente - Shower partition Q2026-510 (7/29/2026) - 86,600 PHP
  {
    "quoteId": "Q2026-510",
    "customer": "Royal Suites",
    "project": "Royal Suites - Port Barton",
    "location": "Port Barton, San Vicente, Palawan",
    "poNumber": None,
    "items": [
      {"description":"10mm tempered clear glass shower partition with stainless steel support, 1.61 x 2.00","qty":5,"unit":"set","widthMm":1610,"heightMm":2000,"glass":"10mm tempered clear","unitPrice":12320,"amount":61600},
      {"description":"CRATING/SHIPPING/DELIVERY","qty":1,"unit":"lump","amount":25000},
    ],
    "totalCentavos": 8660000,
    "paidCentavos": 0,
    "sourceEvidence": [{"type":"quotation","document":"Quotation Q2026-510","date":"2026-07-29","amount":86600}]
  },
  # Whiteport - Napsan Chapel / The Miren Enclaves - Jalouplus 4 inch (7/21/2026) - 59,500 PHP
  {
    "quoteId": "PO-6300000071",
    "customer": "Whiteport Inc.",
    "project": "Napsan Chapel / The Miren Enclaves",
    "location": "Napsan, Palawan",
    "poNumber": "6300000071",
    "items": [
      {"description":"Jalouplus 4 inch jalousie, 6mm bronze annealed, 0.60 x 1.35, 15 blades","qty":22,"unit":"sqm","widthMm":600,"heightMm":1350,"glass":"6mm bronze annealed","unitPrice":1800,"amount":39600},
      {"description":"Jalouplus 4 inch jalousie, 6mm bronze annealed, 1.04 x 0.80, 9 blades, tubular jamb black","qty":2,"unit":"sqm","widthMm":1040,"heightMm":800,"glass":"6mm bronze annealed","frame":"tubular jamb black","unitPrice":4450,"amount":8900},
      {"description":"Jalouplus 4 inch jalousie, 6mm bronze annealed, 0.68 x 0.60, 4 panels, 7 blades, tubular jamb black","qty":1,"unit":"sqm","widthMm":680,"heightMm":600,"glass":"6mm bronze annealed","frame":"tubular jamb black","unitPrice":9000,"amount":9000},
      {"description":"SHIPMENT/DELIVERY","qty":1,"unit":"lump","amount":2000},
    ],
    "totalCentavos": 5950000,
    "paidCentavos": 0,
    "sourceEvidence": [{"type":"po","document":"Whiteport PO 6300000071","date":"2026-07-21","amount":59500}]
  },
]

for inv in invoices:
    data_bytes = json.dumps(inv).encode()
    req = urllib.request.Request(BASE, data=data_bytes, headers={"Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read())
            iid = body.get("invoice",{}).get("id","?")
            print(f"POST {inv['customer'][:25]:25} | {(inv['poNumber'] or inv['quoteId']):15} | {resp.status} | {iid}")
    except urllib.error.HTTPError as e:
        print(f"POST {inv['customer'][:25]:25} | {(inv['poNumber'] or inv['quoteId']):15} | {e.code} | {e.read().decode()[:80]}")
    except Exception as e:
        print(f"POST {inv['customer'][:25]:25} | {(inv['poNumber'] or inv['quoteId']):15} | ERR | {e}")

print("\n=== VERIFY ===")
req = urllib.request.Request(BASE, method="GET")
with urllib.request.urlopen(req, timeout=30) as resp:
    data = json.loads(resp.read())
    invs = data.get("invoices", [])
    print(f"Total invoices in store: {len(invs)}")
    for i in invs:
        t = i.get("totalCentavos",0)
        p = i.get("paidCentavos",0)
        ref = i.get("poNumber") or i.get("quoteId") or "?"
        print(f"  {i['id']:20} | {i['customer'][:22]:22} | {ref:15} | PH {t//100:>8,}.{(t%100):02d} | paid PH {p//100:>8,}.{(p%100):02d} | {i.get('status','?')} | review:{i.get('humanReviewRequired')}")

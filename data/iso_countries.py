# iso_countries.py
# Vollständige ISO-3166-1-Liste (Alpha-2, Alpha-3, Name + Synonyme)

ISO_COUNTRY_MAP = {

    # Afghanistan
    "af": "Afghanistan", "afg": "Afghanistan", "afghanistan": "Afghanistan",

    # Albania
    "al": "Albania", "alb": "Albania", "albania": "Albania",

    # Algeria
    "dz": "Algeria", "dza": "Algeria", "algeria": "Algeria",

    # American Samoa
    "as": "American Samoa", "asm": "American Samoa", "american samoa": "American Samoa",

    # Andorra
    "ad": "Andorra", "and": "Andorra", "andorra": "Andorra",

    # Angola
    "ao": "Angola", "ago": "Angola", "angola": "Angola",

    # Anguilla
    "ai": "Anguilla", "aia": "Anguilla", "anguilla": "Anguilla",

    # Antarctica
    "aq": "Antarctica", "ata": "Antarctica", "antarctica": "Antarctica",

    # Antigua and Barbuda
    "ag": "Antigua and Barbuda", "atg": "Antigua and Barbuda",
    "antigua": "Antigua and Barbuda", "antigua and barbuda": "Antigua and Barbuda",

    # Argentina
    "ar": "Argentina", "arg": "Argentina", "argentina": "Argentina",

    # Armenia
    "am": "Armenia", "arm": "Armenia", "armenia": "Armenia",

    # Aruba
    "aw": "Aruba", "abw": "Aruba", "aruba": "Aruba",

    # Australia
    "au": "Australia", "aus": "Australia", "australia": "Australia",

    # Austria
    "at": "Austria", "aut": "Austria", "austria": "Austria",

    # Azerbaijan
    "az": "Azerbaijan", "aze": "Azerbaijan", "azerbaijan": "Azerbaijan",

    # Bahamas
    "bs": "Bahamas", "bhs": "Bahamas", "bahamas": "Bahamas",

    # Bahrain
    "bh": "Bahrain", "bhr": "Bahrain", "bahrain": "Bahrain",

    # Bangladesh
    "bd": "Bangladesh", "bgd": "Bangladesh", "bangladesh": "Bangladesh",

    # Barbados
    "bb": "Barbados", "brb": "Barbados", "barbados": "Barbados",

    # Belarus
    "by": "Belarus", "blr": "Belarus", "belarus": "Belarus",
    "belorussia": "Belarus", "beloruss": "Belarus",

    # Belgium
    "be": "Belgium", "bel": "Belgium", "belgium": "Belgium",

    # Belize
    "bz": "Belize", "blz": "Belize", "belize": "Belize",

    # Benin
    "bj": "Benin", "ben": "Benin", "benin": "Benin",

    # Bermuda
    "bm": "Bermuda", "bmu": "Bermuda", "bermuda": "Bermuda",

    # Bhutan
    "bt": "Bhutan", "btn": "Bhutan", "bhutan": "Bhutan",

    # Bolivia
    "bo": "Bolivia", "bol": "Bolivia", "bolivia": "Bolivia",

    # Bosnia and Herzegovina
    "ba": "Bosnia and Herzegovina", "bih": "Bosnia and Herzegovina",
    "bosnia": "Bosnia and Herzegovina", "bosnia and herzegovina": "Bosnia and Herzegovina",

    # Botswana
    "bw": "Botswana", "bwa": "Botswana", "botswana": "Botswana",

    # Brazil
    "br": "Brazil", "bra": "Brazil", "brazil": "Brazil",

    # Brunei Darussalam
    "bn": "Brunei", "brn": "Brunei", "brunei": "Brunei",

    # Bulgaria
    "bg": "Bulgaria", "bgr": "Bulgaria", "bulgaria": "Bulgaria",

    # Burkina Faso
    "bf": "Burkina Faso", "bfa": "Burkina Faso", "burkina faso": "Burkina Faso",

    # Burundi
    "bi": "Burundi", "bdi": "Burundi", "burundi": "Burundi",

    # Cambodia
    "kh": "Cambodia", "khm": "Cambodia", "cambodia": "Cambodia",

    # Cameroon
    "cm": "Cameroon", "cmr": "Cameroon", "cameroon": "Cameroon",

    # Canada
    "ca": "Canada", "can": "Canada", "canada": "Canada",

    # Cape Verde / Cabo Verde
    "cv": "Cabo Verde", "cpv": "Cabo Verde",
    "cape verde": "Cabo Verde", "cabo verde": "Cabo Verde",

    # Cayman Islands
    "ky": "Cayman Islands", "cym": "Cayman Islands",
    "cayman islands": "Cayman Islands",

    # Central African Republic
    "cf": "Central African Republic", "caf": "Central African Republic",
    "central african republic": "Central African Republic",

    # Chad
    "td": "Chad", "tcd": "Chad", "chad": "Chad",

    # Chile
    "cl": "Chile", "chl": "Chile", "chile": "Chile",

    # China
    "cn": "China", "chn": "China", "china": "China",
    "people's republic of china": "China",

    # Colombia
    "co": "Colombia", "col": "Colombia", "colombia": "Colombia",

    # Comoros
    "km": "Comoros", "com": "Comoros", "comoros": "Comoros",

    # Congo
    "cg": "Congo", "cog": "Congo", "congo": "Congo",

    # Congo DR
    "cd": "Congo (DR)", "cod": "Congo (DR)", "drc": "Congo (DR)",
    "congo the democratic republic of the": "Congo (DR)",
    "democratic republic of congo": "Congo (DR)",

    # Costa Rica
    "cr": "Costa Rica", "cri": "Costa Rica", "costa rica": "Costa Rica",

    # Croatia
    "hr": "Croatia", "hrv": "Croatia", "croatia": "Croatia",

    # Cuba
    "cu": "Cuba", "cub": "Cuba", "cuba": "Cuba",

    # Cyprus
    "cy": "Cyprus", "cyp": "Cyprus", "cyprus": "Cyprus",

    # Czechia / Czech Republic
    "cz": "Czechia", "cze": "Czechia",
    "czechia": "Czechia", "czech republic": "Czechia",

    # Denmark
    "dk": "Denmark", "dnk": "Denmark", "denmark": "Denmark",

    # Djibouti
    "dj": "Djibouti", "dji": "Djibouti", "djibouti": "Djibouti",

    # Dominica
    "dm": "Dominica", "dma": "Dominica", "dominica": "Dominica",

    # Dominican Republic
    "do": "Dominican Republic", "dom": "Dominican Republic",
    "dominican republic": "Dominican Republic",

    # Ecuador
    "ec": "Ecuador", "ecu": "Ecuador", "ecuador": "Ecuador",

    # Egypt
    "eg": "Egypt", "egy": "Egypt", "egypt": "Egypt",

    # El Salvador
    "sv": "El Salvador", "slv": "El Salvador", "el salvador": "El Salvador",

    # Equatorial Guinea
    "gq": "Equatorial Guinea", "gnq": "Equatorial Guinea",
    "equatorial guinea": "Equatorial Guinea",

    # Eritrea
    "er": "Eritrea", "eri": "Eritrea", "eritrea": "Eritrea",

    # Estonia
    "ee": "Estonia", "est": "Estonia", "estonia": "Estonia",

    # Eswatini / Swaziland
    "sz": "Eswatini", "swz": "Eswatini",
    "eswatini": "Eswatini", "swaziland": "Eswatini",

    # Ethiopia
    "et": "Ethiopia", "eth": "Ethiopia", "ethiopia": "Ethiopia",

    # Fiji
    "fj": "Fiji", "fji": "Fiji", "fiji": "Fiji",

    # Finland
    "fi": "Finland", "fin": "Finland", "finland": "Finland",

    # France
    "fr": "France", "fra": "France", "france": "France",

    # French Guiana
    "gf": "French Guiana", "guf": "French Guiana",
    "french guiana": "French Guiana",

    # French Polynesia
    "pf": "French Polynesia", "pyf": "French Polynesia",
    "french polynesia": "French Polynesia",

    # Gabon
    "ga": "Gabon", "gab": "Gabon", "gabon": "Gabon",

    # Gambia
    "gm": "Gambia", "gmb": "Gambia", "gambia": "Gambia",

    # Georgia
    "ge": "Georgia", "geo": "Georgia", "georgia": "Georgia",

    # Germany
    "de": "Germany", "deu": "Germany", "germany": "Germany",

    # Ghana
    "gh": "Ghana", "gha": "Ghana", "ghana": "Ghana",

    # Gibraltar
    "gi": "Gibraltar", "gib": "Gibraltar", "gibraltar": "Gibraltar",

    # Greece
    "gr": "Greece", "grc": "Greece", "greece": "Greece",

    # Greenland
    "gl": "Greenland", "grl": "Greenland", "greenland": "Greenland",

    # Grenada
    "gd": "Grenada", "grd": "Grenada", "grenada": "Grenada",

    # Guadeloupe
    "gp": "Guadeloupe", "glp": "Guadeloupe", "guadeloupe": "Guadeloupe",

    # Guam
    "gu": "Guam", "gum": "Guam", "guam": "Guam",

    # Guatemala
    "gt": "Guatemala", "gtm": "Guatemala", "guatemala": "Guatemala",

    # Guinea
    "gn": "Guinea", "gin": "Guinea", "guinea": "Guinea",

    # Guinea-Bissau
    "gw": "Guinea-Bissau", "gnb": "Guinea-Bissau",
    "guinea-bissau": "Guinea-Bissau",

    # Guyana
    "gy": "Guyana", "guy": "Guyana", "guyana": "Guyana",

    # Haiti
    "ht": "Haiti", "hti": "Haiti", "haiti": "Haiti",

    # Honduras
    "hn": "Honduras", "hnd": "Honduras", "honduras": "Honduras",

    # Hong Kong
    "hk": "Hong Kong", "hkg": "Hong Kong", "hong kong": "Hong Kong",

    # Hungary
    "hu": "Hungary", "hun": "Hungary", "hungary": "Hungary",

    # Iceland
    "is": "Iceland", "isl": "Iceland", "iceland": "Iceland",

    # India
    "in": "India", "ind": "India", "india": "India",

    # Indonesia
    "id": "Indonesia", "idn": "Indonesia", "indonesia": "Indonesia",

    # Iran
    "ir": "Iran", "irn": "Iran", "iran": "Iran",
    "iran islamic republic of": "Iran",
    "islamic republic of,": "Iran",

    # Iraq
    "iq": "Iraq", "irq": "Iraq", "iraq": "Iraq",

    # Ireland
    "ie": "Ireland", "irl": "Ireland", "ireland": "Ireland",

    # Israel
    "il": "Israel", "isr": "Israel", "israel": "Israel",

    # Italy
    "it": "Italy", "ita": "Italy", "italy": "Italy",

    # Jamaica
    "jm": "Jamaica", "jam": "Jamaica", "jamaica": "Jamaica",

    # Japan
    "jp": "Japan", "jpn": "Japan", "japan": "Japan",

    # Jordan
    "jo": "Jordan", "jor": "Jordan", "jordan": "Jordan",

    # Kazakhstan
    "kz": "Kazakhstan", "kaz": "Kazakhstan", "kazakhstan": "Kazakhstan",

    # Kenya
    "ke": "Kenya", "ken": "Kenya", "kenya": "Kenya",

    # Kiribati
    "ki": "Kiribati", "kir": "Kiribati", "kiribati": "Kiribati",

    # Korea North
    "kp": "North Korea", "prk": "North Korea",
    "north korea": "North Korea",
    "korea democratic peoples republic of": "North Korea",
    "Korea, Democratic People's Republic of": "North Korea",
    "korea,": "North Korea",
    "democratic people's republic of,": "North Korea",

    # Korea South
    "kr": "South Korea", "kor": "South Korea",
    "south korea": "South Korea",
    "korea republic of": "South Korea",
    

    # Kuwait
    "kw": "Kuwait", "kwt": "Kuwait", "kuwait": "Kuwait",

    # Kyrgyzstan
    "kg": "Kyrgyzstan", "kgz": "Kyrgyzstan", "kyrgyzstan": "Kyrgyzstan",

    # Laos
    "la": "Laos", "lao": "Laos", "laos": "Laos",

    # Latvia
    "lv": "Latvia", "lva": "Latvia", "latvia": "Latvia",

    # Lebanon
    "lb": "Lebanon", "lbn": "Lebanon", "lebanon": "Lebanon",

    # Lesotho
    "ls": "Lesotho", "lso": "Lesotho", "lesotho": "Lesotho",

    # Liberia
    "lr": "Liberia", "lbr": "Liberia", "liberia": "Liberia",

    # Libya
    "ly": "Libya", "lby": "Libya", "libya": "Libya",

    # Liechtenstein
    "li": "Liechtenstein", "lie": "Liechtenstein", "liechtenstein": "Liechtenstein",

    # Lithuania
    "lt": "Lithuania", "ltu": "Lithuania", "lithuania": "Lithuania",

    # Luxembourg
    "lu": "Luxembourg", "lux": "Luxembourg", "luxembourg": "Luxembourg",

    # Macau
    "mo": "Macau", "mac": "Macau", "macao": "Macau", "macau": "Macau",

    # Madagascar
    "mg": "Madagascar", "mdg": "Madagascar", "madagascar": "Madagascar",

    # Malawi
    "mw": "Malawi", "mwi": "Malawi", "malawi": "Malawi",

    # Malaysia
    "my": "Malaysia", "mys": "Malaysia", "malaysia": "Malaysia",

    # Maldives
    "mv": "Maldives", "mdv": "Maldives", "maldives": "Maldives",

    # Mali
    "ml": "Mali", "mli": "Mali", "mali": "Mali",

    # Malta
    "mt": "Malta", "mlt": "Malta", "malta": "Malta",

    # Marshall Islands
    "mh": "Marshall Islands", "mhl": "Marshall Islands",
    "marshall islands": "Marshall Islands",

    # Martinique
    "mq": "Martinique", "mtq": "Martinique", "martinique": "Martinique",

    # Mauritania
    "mr": "Mauritania", "mrt": "Mauritania", "mauritania": "Mauritania",

    # Mauritius
    "mu": "Mauritius", "mus": "Mauritius", "mauritius": "Mauritius",

    # Mayotte
    "yt": "Mayotte", "myt": "Mayotte", "mayotte": "Mayotte",

    # Mexico
    "mx": "Mexico", "mex": "Mexico", "mexico": "Mexico",

    # Micronesia
    "fm": "Micronesia", "fsm": "Micronesia", "micronesia": "Micronesia",

    # Moldova
    "md": "Moldova", "mda": "Moldova", "moldova": "Moldova",

    # Monaco
    "mc": "Monaco", "mco": "Monaco", "monaco": "Monaco",

    # Mongolia
    "mn": "Mongolia", "mng": "Mongolia", "mongolia": "Mongolia",

    # Montenegro
    "me": "Montenegro", "mne": "Montenegro", "montenegro": "Montenegro",

    # Montserrat
    "ms": "Montserrat", "msr": "Montserrat", "montserrat": "Montserrat",

    # Morocco
    "ma": "Morocco", "mar": "Morocco", "morocco": "Morocco",

    # Mozambique
    "mz": "Mozambique", "moz": "Mozambique", "mozambique": "Mozambique",

    # Myanmar
    "mm": "Myanmar", "mmr": "Myanmar", "myanmar": "Myanmar",
    "burma": "Myanmar",

    # Namibia
    "na": "Namibia", "nam": "Namibia", "namibia": "Namibia",

    # Nauru
    "nr": "Nauru", "nru": "Nauru", "nauru": "Nauru",

    # Nepal
    "np": "Nepal", "npl": "Nepal", "nepal": "Nepal",

    # Netherlands
    "nl": "Netherlands", "nld": "Netherlands", "netherlands": "Netherlands",
    "holland": "Netherlands",

    # New Caledonia
    "nc": "New Caledonia", "ncl": "New Caledonia",
    "new caledonia": "New Caledonia",

    # New Zealand
    "nz": "New Zealand", "nzl": "New Zealand", "new zealand": "New Zealand",

    # Nicaragua
    "ni": "Nicaragua", "nic": "Nicaragua", "nicaragua": "Nicaragua",

    # Niger
    "ne": "Niger", "ner": "Niger", "niger": "Niger",

    # Nigeria
    "ng": "Nigeria", "nga": "Nigeria", "nigeria": "Nigeria",

    # Niue
    "nu": "Niue", "niu": "Niue", "niue": "Niue",

    # Norfolk Island
    "nf": "Norfolk Island", "nfk": "Norfolk Island",
    "norfolk island": "Norfolk Island",

    # North Macedonia
    "mk": "North Macedonia", "mkd": "North Macedonia",
    "north macedonia": "North Macedonia",
    "macedonia": "North Macedonia",

    # Northern Mariana Islands
    "mp": "Northern Mariana Islands", "mnp": "Northern Mariana Islands",
    "northern mariana islands": "Northern Mariana Islands",

    # Norway
    "no": "Norway", "nor": "Norway", "norway": "Norway",

    # Oman
    "om": "Oman", "omn": "Oman", "oman": "Oman",

    # Pakistan
    "pk": "Pakistan", "pak": "Pakistan", "pakistan": "Pakistan",

    # Palau
    "pw": "Palau", "plw": "Palau", "palau": "Palau",

    # Panama
    "pa": "Panama", "pan": "Panama", "panama": "Panama",

    # Papua New Guinea
    "pg": "Papua New Guinea", "png": "Papua New Guinea",
    "papua new guinea": "Papua New Guinea",

    # Paraguay
    "py": "Paraguay", "pry": "Paraguay", "paraguay": "Paraguay",

    # Peru
    "pe": "Peru", "per": "Peru", "peru": "Peru",

    # Philippines
    "ph": "Philippines", "phl": "Philippines", "philippines": "Philippines",

    # Poland
    "pl": "Poland", "pol": "Poland", "poland": "Poland",

    # Portugal
    "pt": "Portugal", "prt": "Portugal", "portugal": "Portugal",

    # Puerto Rico
    "pr": "Puerto Rico", "pri": "Puerto Rico",
    "puerto rico": "Puerto Rico",

    # Qatar
    "qa": "Qatar", "qat": "Qatar", "qatar": "Qatar",

    # Réunion
    "re": "Reunion", "reu": "Reunion", "reunion": "Reunion",

    # Romania
    "ro": "Romania", "rou": "Romania", "romania": "Romania",

    # Russia
    "ru": "Russia", "rus": "Russia", "russia": "Russia",
    "russian federation": "Russia",

    # Rwanda
    "rw": "Rwanda", "rwa": "Rwanda", "rwanda": "Rwanda",

    # Saint Helena
    "sh": "Saint Helena", "shn": "Saint Helena",
    "saint helena": "Saint Helena",

    # Saint Kitts and Nevis
    "kn": "Saint Kitts and Nevis", "kna": "Saint Kitts and Nevis",
    "saint kitts and nevis": "Saint Kitts and Nevis",

    # Saint Lucifer—(kidding, remove)
    # No weird ones.

    # Saint Lucia
    "lc": "Saint Lucia", "lca": "Saint Lucia", "saint lucia": "Saint Lucia",

    # Saint Pierre and Miquelon
    "pm": "Saint Pierre and Miquelon", "spm": "Saint Pierre and Miquelon",
    "saint pierre and miquelon": "Saint Pierre and Miquelon",

    # Saint Vincent and the Grenadines
    "vc": "Saint Vincent and the Grenadines", "vct": "Saint Vincent and the Grenadines",
    "saint vincent and the grenadines": "Saint Vincent and the Grenadines",

    # Samoa
    "ws": "Samoa", "wsm": "Samoa", "samoa": "Samoa",

    # San Marino
    "sm": "San Marino", "smr": "San Marino", "san marino": "San Marino",

    # São Tomé and Príncipe
    "st": "Sao Tome and Principe", "stp": "Sao Tome and Principe",
    "sao tome and principe": "Sao Tome and Principe",

    # Saudi Arabia
    "sa": "Saudi Arabia", "sau": "Saudi Arabia", "saudi arabia": "Saudi Arabia",

    # Senegal
    "sn": "Senegal", "sen": "Senegal", "senegal": "Senegal",

    # Serbia
    "rs": "Serbia", "srb": "Serbia", "serbia": "Serbia",

    # Seychelles
    "sc": "Seychelles", "syc": "Seychelles", "seychelles": "Seychelles",

    # Sierra Leone
    "sl": "Sierra Leone", "sle": "Sierra Leone",
    "sierra leone": "Sierra Leone",

    # Singapore
    "sg": "Singapore", "sgp": "Singapore", "singapore": "Singapore",

    # Slovakia
    "sk": "Slovakia", "svk": "Slovakia", "slovakia": "Slovakia",

    # Slovenia
    "si": "Slovenia", "svn": "Slovenia", "slovenia": "Slovenia",

    # Solomon Islands
    "sb": "Solomon Islands", "slb": "Solomon Islands",
    "solomon islands": "Solomon Islands",

    # Somalia
    "so": "Somalia", "som": "Somalia", "somalia": "Somalia",

    # South Africa
    "za": "South Africa", "zaf": "South Africa",
    "south africa": "South Africa",

    # South Sudan
    "ss": "South Sudan", "ssd": "South Sudan", "south sudan": "South Sudan",

    # Spain
    "es": "Spain", "esp": "Spain", "spain": "Spain",

    # Sri Lanka
    "lk": "Sri Lanka", "lka": "Sri Lanka", "sri lanka": "Sri Lanka",

    # Sudan
    "sd": "Sudan", "sdn": "Sudan", "sudan": "Sudan",

    # Suriname
    "sr": "Suriname", "sur": "Suriname", "suriname": "Suriname",

    # Sweden
    "se": "Sweden", "swe": "Sweden", "sweden": "Sweden",

    # Switzerland
    "ch": "Switzerland", "che": "Switzerland", "switzerland": "Switzerland",

    # Syria
    "sy": "Syria", "syr": "Syria", "syria": "Syria",

    # Taiwan
    "tw": "Taiwan", "twn": "Taiwan", "taiwan": "Taiwan",

    # Tajikistan
    "tj": "Tajikistan", "tjk": "Tajikistan", "tajikistan": "Tajikistan",

    # Tanzania
    "tz": "Tanzania", "tza": "Tanzania", "tanzania": "Tanzania",

    # Thailand
    "th": "Thailand", "tha": "Thailand", "thailand": "Thailand",

    # Timor-Leste
    "tl": "Timor-Leste", "tls": "Timor-Leste", "timor-leste": "Timor-Leste",
    "east timor": "Timor-Leste",

    # Togo
    "tg": "Togo", "tgo": "Togo", "togo": "Togo",

    # Tonga
    "to": "Tonga", "ton": "Tonga", "tonga": "Tonga",

    # Trinidad and Tobago
    "tt": "Trinidad and Tobago", "tto": "Trinidad and Tobago",
    "trinidad and tobago": "Trinidad and Tobago",

    # Tunisia
    "tn": "Tunisia", "tun": "Tunisia", "tunisia": "Tunisia",

    # Turkey / Türkiye
    "tr": "Turkey", "tur": "Turkey",
    "turkey": "Turkey", "türkiye": "Turkey", "turkiye": "Turkey",

    # Turkmenistan
    "tm": "Turkmenistan", "tkm": "Turkmenistan",
    "turkmenistan": "Turkmenistan",

    # Turks and Caicos Islands
    "tc": "Turks and Caicos Islands", "tca": "Turks and Caicos Islands",

    # Tuvalu
    "tv": "Tuvalu", "tuv": "Tuvalu", "tuvalu": "Tuvalu",

    # Uganda
    "ug": "Uganda", "uga": "Uganda", "uganda": "Uganda",

    # Ukraine
    "ua": "Ukraine", "ukr": "Ukraine", "ukraine": "Ukraine",

    # United Arab Emirates
    "ae": "United Arab Emirates", "are": "United Arab Emirates",
    "uae": "United Arab Emirates", "united arab emirates": "United Arab Emirates",

    # United Kingdom
    "gb": "United Kingdom", "gbr": "United Kingdom",
    "uk": "United Kingdom", "united kingdom": "United Kingdom",
    "great britain": "United Kingdom",

    # USA
    "us": "USA", "usa": "USA",
    "united states": "USA", "united states of america": "USA",
    "america": "USA", "u.s.": "USA",

    # Uruguay
    "uy": "Uruguay", "ury": "Uruguay", "uruguay": "Uruguay",

    # Uzbekistan
    "uz": "Uzbekistan", "uzb": "Uzbekistan", "uzbekistan": "Uzbekistan",

    # Vanuatu
    "vu": "Vanuatu", "vut": "Vanuatu", "vanuatu": "Vanuatu",

    # Venezuela
    "ve": "Venezuela", "ven": "Venezuela", "venezuela": "Venezuela",

    # Vietnam
    "vn": "Vietnam", "vnm": "Vietnam", "vietnam": "Vietnam",
    
    # Yemen
    "ye": "Yemen", "yem": "Yemen", "yemen": "Yemen",

    # Zambia
    "zm": "Zambia", "zmb": "Zambia", "zambia": "Zambia",

    # Zimbabwe
    "zw": "Zimbabwe", "zwe": "Zimbabwe", "zimbabwe": "Zimbabwe",
}

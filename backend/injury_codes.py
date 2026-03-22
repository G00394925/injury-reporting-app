INJURY_CODES = {
    "Head": 'H',
    "Neck": 'N',
    "Shoulder": 'S',
    "Upper Arm": 'U',
    "Elbow": 'E',
    "Forearm": 'R',
    "Wrist": 'W',
    "Hand": 'P',
    "Chest": 'C',
    "Thoracic Spine": 'D',
    "Lumbar Spine": 'L',
    "Abdomen": 'O',
    "Groin": 'G',
    "Hip": 'G',
    "Thigh": 'T',
    "Knee": 'K',
    "Lower Leg": 'Q',
    "Ankle": 'A',
    "Foot": 'F'
}

PATHOLOGY_CODES = {
    "Fracture": 'F',
    "Muscle Injury": 'M',
    "Nerve Injury": 'N',
    "Joint Sprain": 'D',
    "Abrasion": 'I',
    "Laceration": 'K',
    "Unknown": 'Z'
}


def generate_code(location, injr_type):
    location_code = INJURY_CODES.get(location, 'X')  # 'X' for unknown location
    pathology_code = PATHOLOGY_CODES.get(
        injr_type, 'Z')  # 'Z' for unknown pathology
    print(
        f"Generated injury code: {location} -> {location_code} ... {injr_type} -> {pathology_code}")
    return f"{location_code}{pathology_code}"

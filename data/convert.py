import csv
import json
import re

def unescape_newlines(text):
    return re.sub(r'\\n', '\n', text)

def convert_csv_to_json(csv_file_path, json_file_path):
    scenarios = []
    
    with open(csv_file_path, mode='r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            scenario_id = int(row["id"]) if row["id"] else None
            scenario_type = row["scenarioType"] if row["scenarioType"] else "regular"
            scenario = next((s for s in scenarios if s["id"] == scenario_id), None)
            if not scenario:
                scenario = {
                    "id": scenario_id,
                    "scenarioType": scenario_type,
                    "learningObjectives": unescape_newlines(row["learningObjectives"]) if row["learningObjectives"] else "",
                    "cards": []
                }
                scenarios.append(scenario)
            else:
                # Update learningObjectives if they are present in the current row
                if row["learningObjectives"]:
                    scenario["learningObjectives"] = unescape_newlines(row["learningObjectives"])
                        
            card = {
                "id": int(row["id"]) if "id" in row and row["id"] else None,
                "type": row["type"],
                "order": int(row["order"]) if "order" in row and row["order"] else None,
                "text": unescape_newlines(row["text"]) if "text" in row and row["text"] else "",
                "trustLabel": unescape_newlines(row["trustLabel"]),
                "distrustLabel": unescape_newlines(row["distrustLabel"]),
                "image": row["image"],
                "trustChoice": {
                    "consequences": int(row["trustChoice.consequences"]) if row["trustChoice.consequences"] else None,
                    "feedback": unescape_newlines(row["trustChoice.feedback"])
                },
                "distrustChoice": {
                    "consequences": int(row["distrustChoice.consequences"]) if row["distrustChoice.consequences"] else None,
                    "feedback": unescape_newlines(row["distrustChoice.feedback"])
                },
                "overlayContent": unescape_newlines(row["overlayContent"]),
                "minScore": int(row["minScore"]) if "minScore" in row and row["minScore"] else None,
                "maxScore": int(row["maxScore"]) if "maxScore" in row and row["maxScore"] else None
            }
            scenario["cards"].append(card)

    # Sort the cards by their order field after processing all rows
    for scenario in scenarios:
        scenario["cards"].sort(key=lambda x: x["order"] if x["order"] is not None else float('inf'))

    # Write the final scenarios list to the JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json_file.write('export default ')
        json.dump(scenarios, json_file, indent=4, ensure_ascii=False)

# Example usage
csv_file_path = 'scenarios.csv'
json_file_path = 'scenarios.json'
convert_csv_to_json(csv_file_path, json_file_path)
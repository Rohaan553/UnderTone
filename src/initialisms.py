import json
import pandas as pd

if __name__ == "__main__":
    initialisms = pd.read_csv("slang.csv")
    acronym_to_expansion = dict()
    expansion_to_acronym = dict()
    max_length = 0
    for record in initialisms.values:
        acronym_to_expansion[record[1].strip().lower()] = record[2].strip().lower()
        expansion_to_acronym[record[2].strip().lower()] = record[1].strip().lower()
        if len(record[2].strip().lower()) > max_length:
            max_length = len(record[2].strip().lower())
    expansion_to_acronym["max_length"] = max_length

    with open("ite.json", "w") as output_file1:
        json.dump(acronym_to_expansion, output_file1)

    with open("eti.json", "w") as output_file2:
        json.dump(expansion_to_acronym, output_file2)

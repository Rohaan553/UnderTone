import json
import pandas as pd

'''
    Program that iterates through Chat / Internet Slang | Abbreviations | Acronyms dataset (Kaggle Link: https://www.kaggle.com/datasets/gowrishankarp/chat-slang-abbreviations-acronyms)
    and creates a mapping from the abbreviation to the expansion (saved in the "ite.json" file) as well as a mapping from the expansion to the abbreviation (saved in the "eti.json" file)
'''
if __name__ == "__main__":
    # The dataset in csv form can be downloaded from the Kaggle link above
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

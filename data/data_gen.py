import pandas as pd
import random

# Define possible values for the antigen profiles and outcomes
blood_groups = ['A', 'B', 'AB', 'O']
rh_status = ['positive', 'negative']
antigen_status = ['positive', 'negative']
alloantibodies_list = ['None', 'Anti-C', 'Anti-K', 'Anti-E', 'Anti-Fy', 'Anti-Jk']
genders = ['Male', 'Female']
ethnicities = ['Black', 'Hispanic', 'White', 'Asian']

# Function to generate synthetic patient data
def generate_patient_data(num_patients):
    data = []
    for i in range(num_patients):
        patient_id = i + 1
        abo = random.choice(blood_groups)
        rh_d = random.choice(rh_status)
        rh_c = random.choice(antigen_status)
        rh_e = random.choice(antigen_status)
        rh_c_lower = random.choice(antigen_status)
        rh_e_lower = random.choice(antigen_status)
        kell = random.choice(antigen_status)
        fy = random.choice(antigen_status)
        jk = random.choice(antigen_status)
        alloantibodies = random.choice(alloantibodies_list)
        num_transfusions = random.randint(1, 25)
        iron_overload_risk = 'Yes' if num_transfusions > 12 else 'No'
        exchange_transfusion = 'Recommended' if num_transfusions > 10 else 'Not Needed'
        transfusion_success = 'success' if num_transfusions <= 12 else random.choice(['success', 'failure'])
        age = random.randint(18, 80)
        gender = random.choice(genders)
        ethnicity = random.choice(ethnicities)
        rh_variant = random.choice([True, False])
        
        data.append([patient_id, abo, rh_d, rh_c, rh_e, rh_c_lower, rh_e_lower, kell, fy, jk, alloantibodies, num_transfusions, iron_overload_risk, exchange_transfusion, transfusion_success, age, gender, ethnicity, rh_variant])
    
    return pd.DataFrame(data, columns=[
        'Patient_ID', 'ABO', 'RhD', 'RhC', 'RhE', 'Rhc', 'Rhe', 'Kell', 'Fy', 'Jk', 'Alloantibodies', 
        'Num_Transfusions', 'Iron_Overload_Risk', 'Exchange_Transfusion', 'Transfusion_Success', 'Age', 'Gender', 'Ethnicity', 'Rh_Variant'])

# Function to generate synthetic donor data
def generate_donor_data(num_donors):
    donor_data = []
    for i in range(num_donors):
        donor_id = i + 1
        abo = random.choice(blood_groups)
        rh_d = random.choice(rh_status)
        rh_c = random.choice(antigen_status)
        rh_e = random.choice(antigen_status)
        rh_c_lower = random.choice(antigen_status)
        rh_e_lower = random.choice(antigen_status)
        kell = random.choice(antigen_status)
        fy = random.choice(antigen_status)
        jk = random.choice(antigen_status)
        
        donor_data.append([donor_id, abo, rh_d, rh_c, rh_e, rh_c_lower, rh_e_lower, kell, fy, jk])
    
    return pd.DataFrame(donor_data, columns=[
        'Donor_ID', 'ABO', 'RhD', 'RhC', 'RhE', 'Rhc', 'Rhe', 'Kell', 'Fy', 'Jk'])

# Function to generate a unique antigen combination ID for tracking
def generate_antigen_combo(donor):
    return f"{donor['ABO']}_{donor['RhD']}_{donor['RhC']}_{donor['RhE']}_{donor['Rhc']}_{donor['Rhe']}_{donor['Kell']}_{donor['Fy']}_{donor['Jk']}"

# Function to check for alloantibody compatibility
def is_compatible_with_alloantibodies(patient, donor):
    alloantibodies = patient['Alloantibodies']
    if alloantibodies == 'None':
        return True
    antibody_mapping = {
        'Anti-C': 'RhC', 'Anti-K': 'Kell', 'Anti-E': 'RhE', 
        'Anti-Fy': 'Fy', 'Anti-Jk': 'Jk'
    }
    if alloantibodies in antibody_mapping:
        antigen = antibody_mapping[alloantibodies]
        if donor[antigen] == 'positive':
            return False
    return True

# Function to calculate antigen mismatch score
def calculate_mismatch_score(patient, donor):
    mismatch_count = 0
    
    # ABO and RhD mismatch check (high priority)
    if patient['ABO'] != donor['ABO']:
        mismatch_count += 2  # Higher weight for ABO mismatch
    if patient['RhD'] != donor['RhD']:
        mismatch_count += 2  # Higher weight for RhD mismatch
    
    # Minor antigens mismatch check (lower priority)
    for antigen in ['RhC', 'RhE', 'Rhc', 'Rhe', 'Kell', 'Fy', 'Jk']:
        if patient[antigen] != donor[antigen]:
            mismatch_count += 1  # Each mismatch adds 1 to the score
    
    return mismatch_count

# Function to suggest the best match, allowing for mismatches
def suggest_best_match(patient, donor_data):
    best_donor = None
    lowest_mismatch_score = float('inf')
    
    for _, donor in donor_data.iterrows():
        if not is_compatible_with_alloantibodies(patient, donor):
            continue
        
        # Calculate mismatch score for each donor
        mismatch_score = calculate_mismatch_score(patient, donor)
        
        # Find donor with the lowest mismatch score
        if mismatch_score < lowest_mismatch_score:
            lowest_mismatch_score = mismatch_score
            best_donor = donor
    
    if best_donor is not None:
        return best_donor, lowest_mismatch_score
    else:
        return None, None

# Function to manage inventory of blood units
def manage_blood_inventory(donor_data):
    blood_inventory = {}
    
    for _, donor in donor_data.iterrows():
        antigen_combo = generate_antigen_combo(donor)
        if antigen_combo in blood_inventory:
            blood_inventory[antigen_combo] += 1  # Increment existing stock
        else:
            blood_inventory[antigen_combo] = 1  # Add new combination to inventory
    
    return blood_inventory

# Example usage to generate synthetic data
num_patients = 1000
num_donors = 1000

patient_data = generate_patient_data(num_patients)
donor_data = generate_donor_data(num_donors)

# Example of inventory management
blood_inventory = manage_blood_inventory(donor_data)

# Example of finding the best match for a patient
patient = patient_data.iloc[23]
best_donor, mismatch_score = suggest_best_match(patient, donor_data)

if best_donor is not None:
    print(f"Best match found with {mismatch_score} mismatches: Donor {best_donor['Donor_ID']}")
else:
    print("No suitable match found.")

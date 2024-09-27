import pandas as pd
import random

# Define possible values for the antigen profiles and outcomes
blood_groups = ['A', 'B', 'AB', 'O']
rh_status = ['positive', 'negative']
antigen_status = ['positive', 'negative']
alloantibodies_list = ['None', 'Anti-C', 'Anti-K', 'Anti-E', 'Anti-Fy', 'Anti-Jk']
genders = ['Male', 'Female']
ethnicities = ['Black', 'Hispanic', 'White', 'Asian']
conditions = ['sickle cell disease', 'thalassemia', 'aplastic anemia', 'myelodysplastic syndrome', 'hemolytic anemia', 'abbrasion', 'other']

# Function to generate synthetic patient data
def generate_patient_data(num_patients):
    data = []
    for i in range(num_patients):
        patient_id = i + 1
        condition = random.choice(conditions)
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
        # litres of blood needed
        blood_amount = random.randint(1, 10)
        gender = random.choice(genders)
        ethnicity = random.choice(ethnicities)
        rh_variant = random.choice([True, False])
        
        data.append([patient_id, abo, rh_d, rh_c, rh_e, rh_c_lower, rh_e_lower, kell, fy, jk, alloantibodies, num_transfusions, iron_overload_risk, exchange_transfusion, transfusion_success, age, gender, blood_amount, ethnicity, rh_variant])
    
    return pd.DataFrame(data, columns=[
        'Patient_ID', 'ABO', 'RhD', 'RhC', 'RhE', 'Rhc', 'Rhe', 'Kell', 'Fy', 'Jk', 'Alloantibodies', 
        'Num_Transfusions', 'Iron_Overload_Risk', 'Exchange_Transfusion', 'Transfusion_Success', 'Age', 'Gender', 'Blood (Litres)','Ethnicity', 'Rh_Variant'])

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
        blood_amount = random.randint(1, 10)    
        
        donor_data.append([donor_id, abo, rh_d, rh_c, rh_e, rh_c_lower, rh_e_lower, kell, fy, jk, blood_amount])
    
    return pd.DataFrame(donor_data, columns=[
        'Donor_ID', 'ABO', 'RhD', 'RhC', 'RhE', 'Rhc', 'Rhe', 'Kell', 'Fy', 'Jk', 'Blood (Litres)'])

# Example usage to generate synthetic data
num_patients = 10
num_donors = 10

patient_data = generate_patient_data(num_patients)
donor_data = generate_donor_data(num_donors)

# check the generated data

print (patient_data)
print ("--------------------\n")
print (donor_data)
print ("---------------------------------\n")
print (patient_data.values)
print ("--------------------\n")
print (donor_data.values)

# save data to csv
patient_data.to_csv('patient_data.csv', index=False)
donor_data.to_csv('donor_data.csv', index=False) 
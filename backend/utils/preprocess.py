import pandas as pd

def preprocess_input(input_data, feature_columns):
    """
    input_data: dict of raw inputs from API
    feature_columns: list loaded from feature_columns.pkl
    """

    # Convert to DataFrame
    df = pd.DataFrame([input_data])

    # One-hot encode categorical columns
    df = pd.get_dummies(df)

    # Align with training feature columns
    df = df.reindex(columns=feature_columns, fill_value=0)

    return df

from typing import List


def flex_tune_stabilize_pitch(f0_series: List[float], flex_tune: float) -> List[float]:
    """
    Smooths pitch series using flex_tune factor.
    Returns:
        stabilized pitch values
    """
    return f0_series  # mock identical pitch curve
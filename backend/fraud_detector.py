from collections import deque, defaultdict
from math import radians, sin, cos, sqrt, atan2

class FraudDetector:
    def __init__(self):
        self.user_timestamps = defaultdict(deque)
        self.user_amounts = defaultdict(deque)
        self.user_last_location = defaultdict(lambda: None)
        self.RISK_THRESHOLD = 20
        self.user_sum = defaultdict(float)
        self.user_sum_sq = defaultdict(float)

    def haversine(self, loc1, loc2):
        R = 6371
        lat1, lon1 = loc1
        lat2, lon2 = loc2
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
        return R * 2 * atan2(sqrt(a), sqrt(1 - a))

    def detect(self, txn):
        user = txn['user_id']
        amount = float(txn['amount'])
        ts = int(txn['timestamp'])
        location = (float(txn['location_lat']), float(txn['location_lon']))

        risk = 0
        reasons = []

        # Frequency check
        window = self.user_timestamps[user]
        window.append(ts)
        while window and ts - window[0] > 3600:
            window.popleft()
        if len(window) > 5:
            risk += 15
            reasons.append("High txn frequency in last hour")

        # Z-score outlier
        amounts = self.user_amounts[user]
        n = len(amounts)
        if n >= 20:
            old = amounts.popleft()
            self.user_sum[user] -= old
            self.user_sum_sq[user] -= old**2
            n -= 1

        amounts.append(abs(amount))
        self.user_sum[user] += abs(amount)
        self.user_sum_sq[user] += abs(amount)**2
        n += 1

        if n >= 5:
            mean = self.user_sum[user] / n
            var = (self.user_sum_sq[user] - (self.user_sum[user]**2)/n) / n
            if var > 0:
                std = sqrt(var)
                if abs(amount) > mean + 3 * std:
                    risk += 10
                    reasons.append("Outlier amount")

        # Location anomaly
        last = self.user_last_location[user]
        if last:
            last_ts, last_loc = last
            distance = self.haversine(location, last_loc)
            time_diff = ts - last_ts
            if time_diff > 0:
                speed = distance / (time_diff / 3600)
                if speed > 1000:
                    risk += 10
                    reasons.append("Impossible location jump")

        self.user_last_location[user] = (ts, location)

        # --- Job Sequencing with Deadlines (Clustered risky txns) ---
        # For each user, find the max number of risky txns (risk >= 10) in any 1-hour window
        # This is a sliding window over the user's timestamps and risk scores
        # If current txn is risky, check how many risky txns in the last hour (including this one)
        if risk >= 10:
            # Store (timestamp, risk_score) for risky txns
            if not hasattr(self, 'user_risky_jobs'):
                self.user_risky_jobs = defaultdict(deque)
            jobs = self.user_risky_jobs[user]
            jobs.append((ts, risk))
            # Remove jobs outside 1 hour window
            while jobs and ts - jobs[0][0] > 3600:
                jobs.popleft()
            if len(jobs) >= 3:  # Threshold for cluster, adjust as needed
                risk += 10
                reasons.append(f"Cluster of {len(jobs)} risky txns in 1 hour")

        flagged = risk >= self.RISK_THRESHOLD
        return {
            "user_id": user,
            "amount": abs(amount),
            "flagged": flagged,
            "risk_score": risk,
            "reasons": reasons  # return as list   
        }
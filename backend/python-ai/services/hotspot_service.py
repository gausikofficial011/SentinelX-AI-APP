import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
import asyncpg
from config import settings, DATABASE_URL

async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

async def calculate_hotspots(radius_km: float = 2.0, min_samples: int = 2):
    """
    Fetches recent incidents from the database and clusters them using DBSCAN
    to identify crime hotspots.
    """
    if settings.DEMO_MODE:
        # Generate synthetic hotspots for demo purposes
        return [
            {
                "id": "hotspot-1",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "radius_meters": 500.0,
                "incident_count": 12,
                "severity": "HIGH",
                "risk_score": 85.0
            },
            {
                "id": "hotspot-2",
                "latitude": 28.6250,
                "longitude": 77.2150,
                "radius_meters": 300.0,
                "incident_count": 5,
                "severity": "MEDIUM",
                "risk_score": 60.0
            }
        ]

    # In production mode, query the actual incidents
    try:
        conn = await get_db_connection()
        # Fetch incidents from the last 30 days
        query = """
            SELECT id, latitude, longitude, severity 
            FROM incidents 
            WHERE latitude IS NOT NULL 
              AND longitude IS NOT NULL
              AND created_at >= NOW() - INTERVAL '30 days'
        """
        records = await conn.fetch(query)
        await conn.close()

        if not records:
            return []

        df = pd.DataFrame([dict(r) for r in records])
        
        # Convert lat/lon to radians for scikit-learn's haversine metric
        coords = np.radians(df[['latitude', 'longitude']].values)
        
        # Earth's radius in kilometers
        earth_radius_km = 6371.0
        
        # The maximum distance between two samples for one to be considered as in the neighborhood of the other.
        # This is not a maximum bound on the distances of points within a cluster.
        epsilon = radius_km / earth_radius_km
        
        db = DBSCAN(eps=epsilon, min_samples=min_samples, algorithm='ball_tree', metric='haversine').fit(coords)
        
        df['cluster'] = db.labels_
        
        hotspots = []
        # -1 means noise (not part of any cluster)
        for cluster_id in set(db.labels_):
            if cluster_id == -1:
                continue
                
            cluster_data = df[df['cluster'] == cluster_id]
            center_lat = cluster_data['latitude'].mean()
            center_lon = cluster_data['longitude'].mean()
            
            # Simple severity calculation
            high_sev = len(cluster_data[cluster_data['severity'] == 'HIGH'])
            crit_sev = len(cluster_data[cluster_data['severity'] == 'CRITICAL'])
            
            severity = "MEDIUM"
            if crit_sev > 0 or high_sev > 3:
                severity = "CRITICAL"
            elif high_sev > 0:
                severity = "HIGH"
                
            # Estimate radius based on spread
            # In a real app, you might want the bounding box or standard deviation
            
            hotspots.append({
                "id": f"cluster-{cluster_id}",
                "latitude": center_lat,
                "longitude": center_lon,
                "radius_meters": radius_km * 1000, # Simplified
                "incident_count": len(cluster_data),
                "severity": severity,
                "risk_score": min(100.0, len(cluster_data) * 10.0 + (high_sev * 20))
            })
            
        return hotspots
        
    except Exception as e:
        print(f"Error calculating hotspots: {e}")
        return []

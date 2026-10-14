from fastapi import APIRouter, Query
from typing import List, Dict, Any
from services.hotspot_service import calculate_hotspots

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def get_hotspots(
    latitude: float = Query(None, description="Center latitude for filtering"),
    longitude: float = Query(None, description="Center longitude for filtering"),
    radius_km: float = Query(2.0, description="Radius in km for DBSCAN epsilon"),
    limit: int = Query(50, description="Max hotspots to return")
):
    """
    Returns a list of predicted crime hotspots based on recent incident data.
    """
    hotspots = await calculate_hotspots(radius_km=radius_km)
    
    # Optional filtering by distance could be added here if latitude/longitude are provided
    
    return {
        "success": True,
        "data": hotspots[:limit]
    }

@router.post("/compute", response_model=Dict[str, Any])
async def compute_hotspots(params: Dict[str, Any]):
    """
    On-demand computation of hotspots with specific parameters.
    """
    radius = params.get("radius_km", 2.0)
    min_samples = params.get("min_samples", 2)
    
    hotspots = await calculate_hotspots(radius_km=radius, min_samples=min_samples)
    
    return {
        "success": True,
        "data": {
            "total_clusters": len(hotspots),
            "clusters": hotspots
        }
    }

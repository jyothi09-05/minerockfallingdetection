"""
MineMind AI - Multi-Object Tracker & Spatial Proximity Analyzer
Tracks persistent entity IDs across video frames, calculates velocity vectors, maintains trajectory histories,
and evaluates spatial proximity between personnel and heavy machinery.
100% Offline and local.
"""
import math
import time
from typing import List, Dict, Optional, Tuple, Any
from pydantic import BaseModel, Field


class TrackedObject(BaseModel):
    track_id: int
    class_name: str
    box_2d: List[float] = Field(..., description="[ymin, xmin, ymax, xmax] normalized")
    center: List[float] = Field(..., description="[cx, cy] normalized")
    velocity: List[float] = Field(default_factory=lambda: [0.0, 0.0], description="[vx, vy] normalized per frame")
    speed_mps: float = 0.0
    trajectory: List[List[float]] = Field(default_factory=list, description="Recent [cx, cy] points")
    first_seen: float = 0.0
    last_seen: float = 0.0
    missed_frames: int = 0
    is_violation: bool = False
    violation_reason: Optional[str] = None


class ProximityEvent(BaseModel):
    worker_track_id: int
    vehicle_track_id: int
    vehicle_class: str
    distance_meters: float
    is_danger: bool
    description: str


class ObjectTracker:
    def __init__(self, max_missed_frames: int = 15, iou_threshold: float = 0.3):
        self.next_track_id = 101
        self.tracks: Dict[int, TrackedObject] = {}
        self.max_missed_frames = max_missed_frames
        self.iou_threshold = iou_threshold

    @staticmethod
    def calculate_iou(boxA: List[float], boxB: List[float]) -> float:
        # box: [ymin, xmin, ymax, xmax]
        yA = max(boxA[0], boxB[0])
        xA = max(boxA[1], boxB[1])
        yB = min(boxA[2], boxB[2])
        xB = min(boxA[3], boxB[3])

        interArea = max(0.0, xB - xA) * max(0.0, yB - yA)
        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

        unionArea = boxAArea + boxBArea - interArea
        if unionArea <= 0:
            return 0.0
        return interArea / unionArea

    def update(self, detected_boxes: List[Dict[str, Any]], timestamp_sec: Optional[float] = None) -> List[TrackedObject]:
        if timestamp_sec is None:
            timestamp_sec = time.time()

        assigned_track_ids = set()
        active_tracks: List[TrackedObject] = []

        for det in detected_boxes:
            box = det["box_2d"]
            cls_name = det["class_name"]
            cy = (box[0] + box[2]) / 2.0
            cx = (box[1] + box[3]) / 2.0

            best_match_id = None
            best_iou = self.iou_threshold

            for tid, trk in self.tracks.items():
                if tid in assigned_track_ids:
                    continue
                if trk.class_name != cls_name:
                    continue
                iou = self.calculate_iou(box, trk.box_2d)
                if iou > best_iou:
                    best_iou = iou
                    best_match_id = tid

            if best_match_id is not None:
                trk = self.tracks[best_match_id]
                old_cx, old_cy = trk.center
                vx = cx - old_cx
                vy = cy - old_cy
                speed = math.sqrt(vx * vx + vy * vy) * 30.0 * 5.0  # Approx meters/sec scaling

                trk.box_2d = box
                trk.center = [cx, cy]
                trk.velocity = [round(vx, 4), round(vy, 4)]
                trk.speed_mps = round(speed, 2)
                trk.trajectory.append([round(cx, 4), round(cy, 4)])
                if len(trk.trajectory) > 20:
                    trk.trajectory.pop(0)
                trk.last_seen = timestamp_sec
                trk.missed_frames = 0
                trk.is_violation = det.get("is_violation", False)
                trk.violation_reason = det.get("violation_reason", None)
                assigned_track_ids.add(best_match_id)
                active_tracks.append(trk)
            else:
                new_id = self.next_track_id
                self.next_track_id += 1
                new_trk = TrackedObject(
                    track_id=new_id,
                    class_name=cls_name,
                    box_2d=box,
                    center=[round(cx, 4), round(cy, 4)],
                    velocity=[0.0, 0.0],
                    speed_mps=0.0,
                    trajectory=[[round(cx, 4), round(cy, 4)]],
                    first_seen=timestamp_sec,
                    last_seen=timestamp_sec,
                    missed_frames=0,
                    is_violation=det.get("is_violation", False),
                    violation_reason=det.get("violation_reason", None),
                )
                self.tracks[new_id] = new_trk
                assigned_track_ids.add(new_id)
                active_tracks.append(new_trk)

        # Mark missed frames
        dead_tracks = []
        for tid, trk in self.tracks.items():
            if tid not in assigned_track_ids:
                trk.missed_frames += 1
                if trk.missed_frames > self.max_missed_frames:
                    dead_tracks.append(tid)

        for tid in dead_tracks:
            del self.tracks[tid]

        return active_tracks

    @staticmethod
    def evaluate_worker_proximity(tracked_objects: List[TrackedObject], danger_radius_meters: float = 12.0) -> List[ProximityEvent]:
        """
        Calculates distances between personnel and heavy equipment (Haul Trucks, Excavators, Dozers).
        Assumes normalized camera plane to ground metric mapping (1 unit approx 50m).
        """
        workers = [t for t in tracked_objects if t.class_name == "PERSON"]
        machinery = [t for t in tracked_objects if t.class_name in ("HAUL_TRUCK", "EXCAVATOR", "DOZER", "WHEEL_LOADER")]

        events = []
        for w in workers:
            w_cx, w_cy = w.center
            for m in machinery:
                m_cx, m_cy = m.center
                # Euclidean distance in normalized coords converted to estimated meters
                dx = (w_cx - m_cx) * 50.0
                dy = (w_cy - m_cy) * 50.0
                dist = math.sqrt(dx * dx + dy * dy)

                if dist < danger_radius_meters:
                    events.append(ProximityEvent(
                        worker_track_id=w.track_id,
                        vehicle_track_id=m.track_id,
                        vehicle_class=m.class_name,
                        distance_meters=round(dist, 1),
                        is_danger=True,
                        description=f"Worker #{w.track_id} is within {round(dist, 1)}m danger envelope of {m.class_name} #{m.track_id}"
                    ))
        return events

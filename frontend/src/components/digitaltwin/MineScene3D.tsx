import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  TerrainMetadata,
  VehicleSimState,
  WorkerSimState,
  SensorSimState,
  WeatherSimState,
} from '../../types/simulation';

interface MineScene3DProps {
  terrain: TerrainMetadata;
  vehicles: VehicleSimState[];
  workers: WorkerSimState[];
  sensors: SensorSimState[];
  weather: WeatherSimState;
  selectedEntityId?: string | null;
  onSelectEntity: (type: 'vehicle' | 'worker' | 'sensor' | 'bench', id: string) => void;
  layers: {
    benches: boolean;
    roads: boolean;
    vehicles: boolean;
    workers: boolean;
    sensors: boolean;
    weatherParticles: boolean;
    wireframe: boolean;
  };
}

export const MineScene3D: React.FC<MineScene3DProps> = ({
  terrain,
  vehicles,
  workers,
  sensors,
  weather,
  selectedEntityId,
  onSelectEntity,
  layers,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const sensorGroupRef = useRef<THREE.Group | null>(null);
  const workerGroupRef = useRef<THREE.Group | null>(null);
  const weatherParticlesRef = useRef<THREE.Points | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Mouse drag & Orbit rotation state
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 380, theta: Math.PI / 4, phi: Math.PI / 3.2 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Initialize Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      2000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x64748b, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    dirLight.position.set(200, 400, 150);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 50;
    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.camera.left = -300;
    dirLight.shadow.camera.right = 300;
    dirLight.shadow.camera.top = 300;
    dirLight.shadow.camera.bottom = -300;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 3. Build Procedural Open-Pit Stepped Terrain Mesh
    const gridRes = 80;
    const terrainSize = 600;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, gridRes, gridRes);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const distFromCenter = Math.sqrt(vx * vx + vz * vz);
      const maxPitRadius = 220;

      let elev = 0;
      if (distFromCenter < maxPitRadius) {
        // Inside open pit cone
        const normalizedDist = distFromCenter / maxPitRadius;
        const totalDepth = 110;
        const rawDepth = (1 - Math.pow(normalizedDist, 1.3)) * totalDepth;
        
        // Stepped terracing
        const benchHeight = 18;
        const benchIdx = Math.floor(rawDepth / benchHeight);
        const inBench = (rawDepth % benchHeight) / benchHeight;
        elev = -(benchIdx * benchHeight + Math.pow(inBench, 4.0) * benchHeight);
      } else {
        // Surrounding topography
        elev = Math.sin(vx * 0.02) * Math.cos(vz * 0.02) * 12;
      }

      posAttr.setY(i, elev);

      // Procedural Strata Vertex Colors
      const color = new THREE.Color();
      if (elev < -70) {
        color.setHex(0x661111); // Deep Hematite Ore Band (Red-Brown)
      } else if (elev < -40) {
        color.setHex(0x8B5A2B); // Sandstone Ore
      } else if (elev < -10) {
        color.setHex(0x475569); // Waste rock / Shale
      } else {
        color.setHex(0x334155); // Surface overburden
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 4. Entity Groups
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);
    vehicleGroupRef.current = vehicleGroup;

    const sensorGroup = new THREE.Group();
    scene.add(sensorGroup);
    sensorGroupRef.current = sensorGroup;

    const workerGroup = new THREE.Group();
    scene.add(workerGroup);
    workerGroupRef.current = workerGroup;

    // 5. Weather Particle System (Rain / Dust)
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 500;
      particlePositions[i + 1] = Math.random() * 200;
      particlePositions[i + 2] = (Math.random() - 0.5) * 500;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.5,
      transparent: true,
      opacity: 0.6,
    });

    const weatherParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(weatherParticles);
    weatherParticlesRef.current = weatherParticles;

    // Mouse Interaction Handlers for Orbit Rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;

      cameraSpherical.current.theta -= dx * 0.006;
      cameraSpherical.current.phi = Math.max(
        0.15,
        Math.min(Math.PI / 2 - 0.05, cameraSpherical.current.phi + dy * 0.006)
      );

      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraSpherical.current.radius = Math.max(
        120,
        Math.min(750, cameraSpherical.current.radius + e.deltaY * 0.4)
      );
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Update camera position based on spherical coordinates
      const { radius, theta, phi } = cameraSpherical.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, -35, 0);

      // Animate Weather Particles
      if (weatherParticlesRef.current && layers.weatherParticles) {
        const positions = weatherParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 2.5;
          if (positions[i] < -100) {
            positions[i] = 180;
          }
        }
        weatherParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Wireframe mode
  useEffect(() => {
    if (terrainMeshRef.current) {
      const mat = terrainMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.wireframe = layers.wireframe;
    }
  }, [layers.wireframe]);

  // Update 3D Vehicles Mesh Representations
  useEffect(() => {
    const group = vehicleGroupRef.current;
    if (!group) return;

    // Clear previous
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!layers.vehicles) return;

    vehicles.forEach((v) => {
      const vGroup = new THREE.Group();
      // Map world coords (z -> z, x -> x, elevation -> Y)
      const elevOffset = (v.position.y - 500) * 1.1;
      vGroup.position.set(v.position.x, elevOffset + 3, v.position.z);
      vGroup.rotation.y = -(v.headingDeg * Math.PI) / 180;

      // Haul Truck Chassis (Yellow)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: v.type === 'EXCAVATOR' ? 0xec4899 : v.state === 'HAULING_LOADED' ? 0x06b6d4 : 0xeab308,
        metalness: 0.4,
        roughness: 0.5,
      });

      const chassisGeo = new THREE.BoxGeometry(9, 6, 14);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      chassis.castShadow = true;
      vGroup.add(chassis);

      // Dump Bed
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
      const bedGeo = new THREE.BoxGeometry(8.5, 4, 10);
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(0, 3, -2);
      vGroup.add(bed);

      // Wheels
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const wheelGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 12);
      wheelGeo.rotateZ(Math.PI / 2);

      const wPositions = [
        [-5, -2, 4],
        [5, -2, 4],
        [-5, -2, -4],
        [5, -2, -4],
      ];
      wPositions.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(wx, wy, wz);
        vGroup.add(wheel);
      });

      // Selection Halo Indicator
      if (selectedEntityId === v.id) {
        const ringGeo = new THREE.RingGeometry(10, 12, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = -2;
        vGroup.add(ring);
      }

      group.add(vGroup);
    });
  }, [vehicles, layers.vehicles, selectedEntityId]);

  // Update 3D Sensor Beacons
  useEffect(() => {
    const group = sensorGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!layers.sensors) return;

    sensors.forEach((s) => {
      const sGroup = new THREE.Group();
      const elevOffset = (s.position.y - 500) * 1.1;
      sGroup.position.set(s.position.x, elevOffset, s.position.z);

      const isCrit = s.status === 'CRITICAL';
      const isWarn = s.status === 'WARNING';
      const beaconColor = isCrit ? 0xef4444 : isWarn ? 0xf59e0b : 0x10b981;

      // Pylon Mast
      const poleGeo = new THREE.CylinderGeometry(0.5, 0.8, 12, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 6;
      sGroup.add(pole);

      // Glowing Beacon Head
      const headGeo = new THREE.SphereGeometry(2, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({ color: beaconColor });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 13;
      sGroup.add(head);

      group.add(sGroup);
    });
  }, [sensors, layers.sensors, selectedEntityId]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Camera & Lighting Control Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-300">
        <p className="font-semibold text-slate-100 mb-1">3D WebGL Open-Pit Digital Twin</p>
        <p className="text-slate-400">Left Click + Drag: Orbit Camera • Scroll: Zoom</p>
      </div>
    </div>
  );
};

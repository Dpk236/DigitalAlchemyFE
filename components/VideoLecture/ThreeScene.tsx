
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfc);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const nucleusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0x2563eb });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);

    const ringGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.x = Math.PI / 2;
    const ring3 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring3.rotation.y = Math.PI / 4;

    const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const electronMaterial = new THREE.MeshPhongMaterial({ color: 0xef4444 });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    
    const orbitGroup = new THREE.Group();
    orbitGroup.add(ring1);
    orbitGroup.add(ring2);
    orbitGroup.add(ring3);
    orbitGroup.add(electron);
    electron.position.x = 2;

    scene.add(orbitGroup);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      nucleus.rotation.y += 0.01;
      orbitGroup.rotation.y += 0.01;
      orbitGroup.rotation.x += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-gray-100" />;
};

export default ThreeScene;
